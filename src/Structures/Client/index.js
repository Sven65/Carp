const net = require('net')
const {InvalidError} = require("../../Errors")
const EventEmitter = require('events')

const Channel = require("../Channel")
const User = require("../User")

const NickServ = require('../NickServ')

const Parser = require("../../Util/ParseMessage")


/**
 * New client
 * @class
 */
class Client extends EventEmitter{

	/**
	 * @param {Object} options - The options for the client
	 * @param {String} options.username - The username to use
	 * @param {String} options.hostname - The hostname to use
	 * @param {String} options.servername - The servername to use
	 * @param {String} options.realname - The realname for the client
	 * @param {String} options.pass - The pass to use
	 * @param {String} options.nick - The nick to use, defaults to username
	 * @param {Boolean} options.verbose - If verbose information should be outputted
	 * @param {Boolean} options.sasl - If the client should authenticate with SASL 
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

		this._channels = new Map()

		this._verbose = options.verbose||false

		this._nickMod = 0

		this._users = new Map()

		this._ctcp = new Map()

		this._sasl = options.sasl||false

		this._supported = {
			channel: {
				idLength: [],
				length: 200,
				limit: [],
				modes: {a: '', b: '', c: '', d: ''}
			},
			kickLength: 0,
			maxList: [],
			maxTargets: [],
			modes: 3,
			nickLength: 9,
			topicLength: 0,
			usermodes: ''
		}

		this._prefixForMode = []
		this._modeForPrefix = []

		this._nickServ = null

		this._modes = ''
	}

	/**
	 * @type {Object}
	 */
	get info(){
		return this._clientData
	}

	/**
	 * @type {Map}
	 */
	get channels(){
		return this._channels
	}

	/**
	 * @type [Map]
	 */
	get users(){
		return this._users
	}

	/**
	 * Information about what the server supports
	 * @type {Object}
	 */
	get supported(){
		return this._supported
	}

	/**
	 * @type {?NickServ}
	 */
	get NickServ(){
		return this._nickServ
	}

	/**
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

	/**
	 * Emits when the client parts a channel
	 * @event Client#part
	 * @type {Object}
	 * @property {Object} data - The data emitted
	 * @property {String} data.channelName - The name of the channel joined
	 * @property {Channel} data.channel - The channel joined
	 */

	/**
	 * Emits when the client revieves a private message
	 * @event Client#message
	 * @type {Object}
	 * @property {User} user - The user that sent the message
	 * @property {String} message - The message that was sent
	 */

	 /**
	 * Emits when a the clients nick is changed
	 * @event Client#nick
	 * @type {Object}
	 * @property {String} oldNick - The old nickname of the user
	 * @property {String} newNick - The new nickname of the user
	 */

	/**
	 * Emits when a the client recieves an invite
	 * @event Client#invite
	 * @type {Object}
	 * @property {String} channelName - The name of the channel the client was invited to
	 * @property {String} from - The nick of the user that sent the invite
	 */

	/**
	 * Emits when the client gets their modes updated
	 * @event Client#+mode
	 * @type {Object}
	 * @property {Array.<String>} modes - The modes that were addded
	 */

	/**
	 * Emits when the client gets their modes updated
	 * @event Client#-mode
	 * @type {Object}
	 * @property {Array.<String>} modes - The modes that were removed
	 */

	 _handleRPLSupport(message){
	 	message.args.map(arg => {
	 		let match = arg.match(/([A-Z]+)=(.*)/)

	 		if(match){
	 			let param = match[1]
	 			let value = match[2]

	 			switch(param){
	 				case "CHANLIMIT":
	 					value.split(",").map(val => {
	 						val = val.split(":")
	 						this._supported.channel.limit[val[0]] = parseInt(val[1])
	 					})
	 				break
	 				case "CHANMODES":
						value = value.split(",")
						let type = "abcd".split("")

						for(let i=0;i<type.length;i++){
							this._supported.channel.modes[type[i]] += value[i]
						}
					break
					case "CHANTYPES":
						this._supported.channel.types = value
					break
					case "CHANNELLEN":
						this._supported.channel.length = parseInt(value)
					break
					case "IDCHAN":
						value.split(",").each(val => {
							val = val.split(":")
							this._supported.channel.idLength[value[0]] = val[1]
						})
					break
					case "KICKLEN":
						this._supported.kickLength = value
					break
					case "MAXLIST":
						value.split(',').map(val => {
							val = val.split(':')
							this._supported.maxList[val[0]] = parseInt(val[1])
						})
					break
					case "NICKLEN":
						this._supported.nickLength = parseInt(value)
					break
					case "PREFIX":
						match = value.match(/\((.*?)\)(.*)/)
						if(match){
							match[1] = match[1].split('')
							match[2] = match[2].split('')
							while(match[1].length){
								this._modeForPrefix[match[2][0]] = match[1][0]
								this._supported.channel.modes.b += match[1][0]
								this._prefixForMode[match[1].shift()] = match[2].shift()
							}
						}
					break
					case "STATUSMSG":

					break
					case "TARGMAX":
						value.split(",").map(val => {
							val = val.split(":")
							val[1] = (!val[1])?0:parseInt(val[1])

							this._supported.maxTargets[val[0]] = val[1]
						})
					break
					case "TOPICLEN":
						this._supported.topicLength = parseInt(value)
					break
	 			}
	 		}
	 	})
	 }

	/**
	 * Adds event listeners to the connection
	 * @function
	 * @private
	 */
	addEventListeners(){

		let buffer = new Buffer('')

		this.on('raw', message => {

			if(this._verbose){
				console.log(message)
			}

			let channelName = ""

			switch(message.command){
				case "RPL_WELCOME":
					let welcomeStringWords = message.args[1].split(/\s+/);
					this._clientData.hostMask = welcomeStringWords[welcomeStringWords.length - 1]
					this._clientData.nick = message.args[0]

					this.whois(this._clientData.nick).then(args => {
						this._clientData.nick = args.nick
						this._clientData.hostMask = `${args.user}@${args.host}`
						this._clientData.user = args.user

						this.emit("ready")	

					})
				break
				case "PING":
					this.sendCommand(`PONG ${message.args[0]}\n`)
				break
				case "ERR_NICKNAMEINUSE":
					this._nickMod++
					this.sendCommand(`NICK ${this._clientData.nick}${this._nickMod}\n`)
				break
				case "ERR_ERRONEUSNICKNAME":
					this.emit("error", message)
				break
				case "JOIN":
					channelName = message.args[0]

					if(message.user === this._clientData.user){
						
						if(!this._channels.get(channelName)){
							this._channels.set(channelName, new Channel(this._connection, channelName))
						}
						this.emit("join", {channelName: channelName, channel: this._channels.get(channelName)})
					}else{
						this._channels.get(channelName).handleRaw(message)
					}
				break
				case "PART":
					channelName = message.args[0]

					if(message.user === this._clientData.user){
						
						this.emit("part", {channelName: channelName, channel: this._channels.get(channelName)})
						this._channels.delete(channelName)
					}else{
						this._channels.get(channelName).handleRaw(message)
					}
				break
				case "PRIVMSG":
					if(message.args[1][0] === '\u0001' && message.args[1].lastIndexOf('\u0001') > 0){
						this._handleCTCP(message)
						this.emit("CTCP", message)
						break
					}
					if(message.args[0] === this._clientData.nick){

						let user = new User(message.nick, this._connection)
						user.set("prefix", message.prefix)
							.set("user", message.user)
							.set("host", message.host)

						this.emit("message", user, message.args[1])
					}else{
						this._channels.get(message.args[0]).handleRaw(message)
					}
				break
				case "NOTICE":
					if(message.user === "NickServ"){
						if(this._nickServ === null){
							this._nickServ = new NickServ(this._connection, this._clientData.nick)
						}

						if(this._nickServ !== null){
							this._nickServ.handleRaw(message)
						}
					}
				break
				case "TOPIC":
					channelName = message.args[0]
						
					if(this._channels.get(channelName)){
						this._channels.get(channelName).handleRaw(message)
					}
				break
				case "KICK":
					channelName = message.args[0]

					if(this._clientData.nick === message.args[1]){
						// Client was kicked
						// channelname, by, reason, channel
						this.emit("kick", channelName, message.nick, message.args[2], this._channels[channelName])
						this._channels.delete(channelName)
					}else{
						this._channels.get(channelName).handleRaw(message)
					}
				break
				case "RPL_NAMREPLY":
					channelName = message.args[2]
					this._channels.get(channelName).handleRaw(message)
				break
				case "RPL_ENDOFNAMES":
					
				break
				case "NICK":
					if(message.nick === this._clientData.nick){
						this._clientData.nick = message.args[0]
						if(this._nickServ !== null){
							this._nickServ.nick = message.args[0]
						}
						this.emit("nick", message.nick, message.args[0])
					}else{
						this._channels.forEach(channel => {
							if(channel.users.get(message.nick) !== undefined){
								channel.handleRaw(message)
							}
						})
					}
				break
				case "INVITE":
					this.emit("invite", message.args[1], message.nick)
				break
				case "MODE":
					if(message.nick === this._clientData.nick){

						let split = message.args[1].split("")

						let action = split[0]

						split.shift()

						if(action === "+"){
							this._modes += split.join("")
						}else if(action === "-"){
							split.map(mode => {
								this._modes = this._modes.replace(mode, "")
							})
						}

						this.emit(`${action}mode`, split)
					}else{
						channelName = message.args[0]

						let channel = this._channels.get(channelName)

						if(channel !== undefined){
							channel.handleRaw(message)
						}
					}
				break
				case "RPL_ISUPPORT":
					this._handleRPLSupport(message)
				break

				// SASL \\

				case "CAP":
					if(message.args[0] === "*" && message.args[1] === "ACK" && message.args[2] === "sasl "){
						this.sendCommand("AUTHENTICATE PLAIN\n")
					}
				break
				case "AUTHENTICATE":
					if(message.args[0] === '+'){
						let userString = new Buffer(`${this._clientData.nick}\0${this._clientData.username}\n${this._clientData.pass}`).toString("base64")

						this.sendCommand(`AUTHENTICATE ${userString}\n`)
					}
				break
				case "903":
					this.sendCommand(`CAP END\n`)
				break
				case "ERR_SASLFAIL":
					this.emit("error", "SASL Authentication failed")
				break


				// WHOIS \\

				case "RPL_AWAY":
					this._addWhois(message.args[1], 'away', message.args[2], true)
				break
				case "RPL_WHOISUSER":
					this._addWhois(message.args[1], 'user', message.args[2])
					this._addWhois(message.args[1], 'host', message.args[3])
					this._addWhois(message.args[1], 'realname', message.args[5])
				break
				case "RPL_WHOISIDLE":
					this._addWhois(message.args[1], 'idle', message.args[2])
				break
				case "RPL_WHOISCHANNELS":
					this._addWhois(message.args[1], 'channels', message.args[2].trim().split(/\s+/))
				break
				case "RPL_WHOISSERVER":
					this._addWhois(message.args[1], 'server', message.args[2])
					this._addWhois(message.args[1], 'serverinfo', message.args[3])
				break
				case "RPL_WHOISOPERATOR":
					this._addWhois(message.args[1], 'operator', message.args[2])
				break
				case "330":
					this._addWhois(message.args[1], 'account', message.args[2])
					this._addWhois(message.args[1], 'accountinfo', message.args[2])
				break
				case "RPL_ENDOFWHOIS":
					this.emit('whois', this._getWHOIS(message.args[1]))
				break
			}
		})

		// Gets data from net, parses it and emits it
		this._connection.on('data', (chunk) => {

			let message = ""
			if(typeof(chunk) === 'string'){
				buffer += chunk
			}else{
				buffer = Buffer.concat([buffer, chunk])
			}

			let lines = buffer.toString().split(/\r?\n|\r/)

			if(lines.pop()){
				// if buffer is not ended with \r\n, there's more chunks.
				return
			}else{
				buffer = new Buffer('')
			}

			let s = this

			lines.forEach(function iterator(line){
				if(line.length){
					message = Parser(line)
					
					s.emit('raw', message)
				}
			})
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

	_getWHOIS(nick){
		this._users.get(nick).addWhois('nick', nick)
		let whoisData = this._users.get(nick).whois

		this._users.delete(nick)

		return whoisData
	}

	_addWhois(nick, key, value, onlyIfExists){
		if(onlyIfExists && !this._users.get(nick)){
			return
		}
		if(!this._users.get(nick)){
			this._users.set(nick, new User(nick))
		}

		this._users.get(nick).addWhois(key, value)
	}

	/**
	 * Sends a raw command to the server
	 * @private
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

					this._connection.setEncoding('utf8')

					console.log(`Connected to ${address}/${port}`)
					this.addEventListeners()

					if(this._sasl){
						this.sendCommand(`CAP REQ :sasl\n`)
					}else{
						this.sendCommand(`PASS ${this._clientData.pass}\n`)
					}
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

	/**
	 * Sends a quit command to the server
	 * @function
	 * @param {?String} message - The message to quit with
	 * @author Mackan
	 */
	quit(message){

		let command = "QUIT"

		if(message !== undefined && message !== null){
			command += ` :${message}`
		}

		this.sendCommand(command)
		this._connection.end()
	}

	/**
	 * Joins channels
	 * @function
	 * @param {...String} channel - The channel to join
	 * @author Mackan
	 */
	join(...channels){
		this.sendCommand(`JOIN ${channels.join(",")}\n`)
	}

	/**
	 * Gets the whois of a user
	 * @function
	 * @param {String} nick - The user to check
	 * @returns {Promise.<Object>}
	 * @author Mackan
	 */
	whois(nick){
		return new Promise((resolve, reject) => {
			this.once('whois', info => {
				if(info.nick.toLowerCase() === nick.toLowerCase()){
					resolve(info)
				}
			})

			this.sendCommand(`WHOIS ${nick}\n`)
		})
	}

	/*
	 * Emits when the client revieves a ctcp message
	 * @event Client#ctcp
	 * @type {Object}
	 * @property {String} from - The nick of the user that sent the message
	 * @property {String} to - Who the message is for
	 * @property {String} type - The CTCP command
	 * @property {?Array.<String>} - Arguments
	 */
	_handleCTCP(message){
		let from = message.nick
		let to = message.args[0]
		let user = new User(from, this._connection)

		let text = message.args[1]
		text = text.slice(1)
		text = text.slice(0, text.indexOf('\u0001'))
		let parts = text.split(' ')

		let type = parts[0].toUpperCase()
		parts.shift()

		if(this._ctcp.get(type)){
			if(typeof(this._ctcp.get(type)) === 'function'){
				let value = this._ctcp.get(type).call(this, parts)

				if(typeof(value) !== undefined && typeof(value) !== undefined){
					user.sendCTCP(type, value)
				}
			}else{
				user.sendCTCP(type, this._ctcp.get(type))
			}
		}

		this.emit('ctcp', from, to, type, parts)
	}

	/**
	 * Adds a CTCP response to the client
	 * @function
	 * @param {String} name - The ctcp command
	 * @param {String} value - What to respond with
	 */
	addCTCP(name, value){
		this._ctcp.set(name.toUpperCase(), value)
	}

	/**
	 * Updates the modes of the client
	 * @function
	 * @param {String} mode - What modes to update
	 */
	mode(mode){
		this.sendCommand(`MODE ${this._clientData.nick} ${mode}\n`)
	}

	/**
	 * Sends a notice to a user
	 * @function
	 * @param {String} nick - The nick of the user to send the message to
	 * @param {String} message - The message to send
	 */
	notice(nick, message){
		this.sendCommand(`NOTICE ${nick} ${message}\n`)
	}
}

module.exports = Client