const net = require('net')
const {InvalidError} = require("../../Errors")
const EventEmitter = require('events')
const os = require("os")
const util = require("../../Util")

const Channel = require("../Channel")

class Client extends EventEmitter{

	/**
	 * @param {Object} options - The options for the client
	 * @param {String} options.username - The username to use
	 * @param {String} options.hostname - The hostname to use
	 * @param {String} options.servername - The servername to use
	 * @param {String} options.realname - The realname for the client
	 * @param {String} options.pass - The pass to use
	 * @param {String} options.nick - The nick to use, defaults to username
	 */
	constructor(options={}){
		super()

		if(!options.username){
			throw new InvalidError("An invalid username was supplied.")
		}

		this._clientData = {
			username: options.username,
			hostname: options.hostname||"0",
			servername: options.servername||"*",
			realname: options.realname||"CarpLib",
			pass: options.pass||new Date().valueOf().toString("36"),
			nick: options.nick||options.username
		}

		this._server = {}

		this._connection = null

		this._channels = {}

		this._verbose = false
	}

	/**
	 * Adds event listeners to the connection
	 * @function
	 * @private
	 */

	/*
	 * Emits when the client is logged in (ready)
	 * @event Client#login
	 * @type {Object}
	 */

	/*
	 * Emits when the client joins a channel
	 * @event Client#join
	 * @type {Object}
	 * @property {Object} data - The data emitted
	 * @property {String} data.channelName - The name of the channel joined
	 * @property {Channel} data.channel - The channel joined
	 */

	/*
	 * Emits when the client parts a channel
	 * @event Client#part
	 * @type {Object}
	 * @property {Object} data - The data emitted
	 * @property {String} data.channelName - The name of the channel joined
	 * @property {Channel} data.channel - The channel joined
	 */
	addEventListeners(){
		this._connection.on('data', (data) => {

			let message = data.toString()

			//console.log(message+"\n\n")

			if(util.isPing(message)){
				this.sendCommand(`PONG ${util.pingFrom(message)}`)
			}else if(util.isMode(message, this._clientData.username)){
			}else{

				const parsedMessage = util.parseMessage(message)


				const lastCode = util.getLastCode(message)

				if(lastCode !== undefined && lastCode !== null){
					if(lastCode.code === 376){
						this.emit("login")
					}
				}

				let parts = util.splitMessage(message)

				if(parts.command === "JOIN"){
					let channel = parts.params[0].replace(/\r?\n|\r/g, "")

					let user = util.resolveUser(parts.sender)

					if(user.name === this._clientData.username){
						if(!this._channels[channel]){
							this._channels[channel] = new Channel(this._connection, channel)
						}
						this.emit("join", {channelName: channel, channel: this._channels[channel]})
					}else{
						this._channels[channel].handleJoin(parts)
					}
				}else if(parts.command === "PRIVMSG"){
					let channel = parts.params[0]
					this._channels[channel].handleMessage(parts)
				}else if(parts.command === "PART"){

					let channel = parts.params[0].replace(/\r?\n|\r/g, "")

					let user = util.resolveUser(parts.sender)

					if(user.name === this._clientData.username){
						this.emit("part", {channelName: channel, channel: this._channels[channel]})
						delete this._channels[channel]
					}else{
						this._channels[channel].handlePart(parts)
					}
				}else{
					for(let i=0;i<parts.params.length;i++){
						if(parts.params[i] === "JOIN"){
							let channel = parts.params[i+1].split(":")[0].replace(/\r?\n|\r/g, "")
							this._channels[channel] = new Channel(this._connection, channel)
							this.emit("join", {channelName: channel, channel: this._channels[channel]})
						}
					}
				}

				if(this._verbose){
					console.log(parts)
				}
			}
		})

		/**
		 * Emits when the client is disconnected
		 * @event Client#disconnected
		 * @type {Object}
		 * 
		 */
		this._connection.on('end', () => {
			this.emit('disconnected')
		})

		/**
		 * Emits when the connection gets an error
		 * @event Client#error
		 * @type {Object}
		 * @param {Error} e - The Error gotten
		 */
		this._connection.on('error', (e) => {
			this.emit('error', e)
		})
	}

	/**
	 * Sends a raw command to the server
	 * @privates
	 * @function
	 * @param {String} command - The command to send
	 * @author Mackan
	 */
	sendCommand(command){
		this._connection.write(command)
	}

	/**
	 * Connects to a server
	 * @function
	 * @param {String} address - The address of the server to connect to
	 * @param {Number} port - The port to connect to
	 * @author Mackan
	 */
	connect(address=null, port=6667){
		if(address === null || address === undefined){
			throw new InvalidError("An invalid server address was supplied.")
		}else{
			if(isNaN(port)){
				throw new RangeError("Port must be numeric.")
			}else{
				this._connection = net.createConnection(port, address, () => {
					console.log(`Connected to ${address}/${port}`)
					this.addEventListeners()
					this.emit("connected")
					this.sendCommand(`PASS ${this._clientData.pass}\n`)

					this.sendCommand(`USER ${this._clientData.username} 0 * ${this._clientData.realname}\n`)
					this.sendCommand(`NICK ${this._clientData.nick}\n`)
				})
			}
		}
	}

	/** 
	 * Disconnects from the server
	 * @function
	 * @author Mackan
	 */
	disconnect(){
		if(this._connection !== null){
			this._connection.end()
		}
	}

	quit(message){

		let command = "QUIT"

		if(message !== undefined && message !== null){
			command += ` :${message}`
		}

		this.sendCommand(command)
		this._connection.end()
	}

	sleep(time){
		var waitTill = new Date(new Date().getTime() + time * 1000);
		while(waitTill > new Date()){}
	}

	/**
	 * Joins channels
	 * @function
	 * @param {String} channel - The channel to join
	 * @author Mackan
	 */
	join(channel){
		this.sendCommand(`JOIN ${channel}\n`)
	}
}

module.exports = Client