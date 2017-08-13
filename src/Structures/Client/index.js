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

		this._verbose = true
	}

	/**
	 * Adds event listeners to the connection
	 * @function
	 * @private
	 */

	/*
	 * Emits when the client is logged in (ready)
	 * @event Client#ready
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

			/* var buffer = new Buffer('');

			    function handleData(chunk) {
			        self.conn.cyclingPingTimer.notifyOfActivity();

			        if (typeof (chunk) === 'string') {
			            buffer += chunk;
			        } else {
			            buffer = Buffer.concat([buffer, chunk]);
			        }

			        var lines = self.convertEncoding(buffer).toString().split(lineDelimiter);

			        if (lines.pop()) {
			            // if buffer is not ended with \r\n, there's more chunks.
			            return;
			        } else {
			            // else, initialize the buffer.
			            buffer = new Buffer('');
			        }

			        lines.forEach(function iterator(line) {
			            if (line.length) {
			                var message = parseMessage(line, self.opt.stripColors);

			                try {
			                    self.emit('raw', message);
			                } catch (err) {
			                    if (!self.conn.requestedDisconnect) {
			                        throw err;
			                    }
			                }
			            }
			        });
			    }
			*/



			let message = data//.toString()

			console.log(message+"\n\n")

			if(util.isPing(message)){
				this.sendCommand(`PONG ${util.pingFrom(message)}`)
			}else if(util.isMode(message, this._clientData.username)){
			}else{

				const parsedMessage = util.parseMessage(message)


				const lastCode = util.getLastCode(message)

				

				if(lastCode !== undefined && lastCode !== null){

					switch(lastCode.code){
						case 376:
							this.emit('ready')
						break
						case 451:
							this.emit('error', 451, 'You have not registered')
						break
					}
				}


				let parts = util.splitMessage(message)

				let newLines = util.newLineSplit(message)

				if(this._verbose){
					//console.log(newLines)
				}

				if(parts.command === "NOTICE"){
					if(parts.params.join(" ").replace(/\r?\n|\r/g, "").toLowerCase() === "* :*** no ident response"){
						this.sendIdent()
						//this.emit("ready")
					}


				}

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

	sendIdent(){
		this.sendCommand(`PASS ${this._clientData.pass}`)//\nNICK ${this._clientData.nick}\nUSER ${this._clientData.username} 0 * ${this._clientData.realname}\n`)
		//this.sendCommand(`NICK ${this._clientData.nick}\n`)
		//this.sendCommand(`USER ${this._clientData.username} 0 * ${this._clientData.realname}\n`)
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

					this._connection.setEncoding('utf8')

					console.log(`Connected to ${address}/${port}`)
					this.addEventListeners()

					this.sendCommand(`PASS ${this._clientData.pass}\n`)
					this.sendCommand(`NICK ${this._clientData.nick}\n`)

					this.sendCommand(`USER ${this._clientData.username} 0 * ${this._clientData.realname}\n`)

					this.emit("connected")
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
	join(...channels){
		this.sendCommand(`JOIN ${channels.join(",")}\n`)
	}
}

module.exports = Client