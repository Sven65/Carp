const EventEmitter = require('events')
const User = require("./User")

/**

 * @class
 */
class Channel extends EventEmitter{
	constructor(connection, channelName){
		super()

		this._connection = connection
		this._channelName = channelName

		this._users = new Map()
	}

	/**
	 * The name of the channel
	 * @type {String}
	 */
	get name(){
		return this._channelName
	}

	/**
	 * The topic of the channel
	 * @type {String}
	 */
	get topic(){
		return this._topic
	}

	/**
	 * The users in the channel
	 * @type {Map}
	 */
	get users(){
		return this._users
	}

	handleTopic(message){
		this._topic = {by: message.nick, text: message.args[1]}
		this.emit('topic', this._topic)
	}

	/**
	 * Emits when a user joins the channel
	 * @event Channel#join
	 * @type {Object}
	 * @property {User} user - The user that joined
	 */
	handleJoin(message){
		const user = new User(message.nick, this._connection)

		user.set("prefix", message.prefix)
			.set("user", message.user)
			.set("host", message.host)

		this._users.set(message.nick, user)

		this.emit("join", user)
	}


	/**
	 * Emits when the channel revieves a message
	 * @event Channel#message
	 * @type {Object}
	 * @property {User} user - The user that sent the message
	 * @property {String} message - The message that was sent
	 */
	handleMessage(message){
		const user = new User(message.nick, this._connection)

		user.set("prefix", message.prefix)
			.set("user", message.user)
			.set("host", message.host)

		if(Object.keys(this._users.get(message.nick).info).length === 1){
			this._users.set(message.nick, user)
		}

		this.emit("message", user, message.args[1])
	}

	handleNames(message){
		let users = message.args[3].trim().split(/ +/)

		users.map(user => {
			let username = user.replace("@", "").replace("+", "")
			this._users.set(username, new User(username, this._connection))
		})
	}

	handleRaw(message){
		switch(message.command){
			case "JOIN":
				this.handleJoin(message)
			break
			case "PART":
				this.handlePart(message)
			break
			case "PRIVMSG":
				this.handleMessage(message)
			break
			case "TOPIC":
				this.handleTopic(message)
			break
			case "KICK":
				this.handleKick(message)
			break
			case "RPL_NAMREPLY":
				this.handleNames(message)
			break
			case "NICK":
				this.handleNick(message)
			break
		}
	}

	/**
	 * Emits when a user changes their nick
	 * @event Channel#nick
	 * @type {Object}
	 * @property {String} oldNick - The old nickname of the user
	 * @property {String} newNick - The new nickname of the user
	 * @property {User} user - The user object
	 */
	handleNick(message){
		this._users.delete(message.nick)

		const user = new User(message.args[0], this._connection)

		user.set("prefix", message.prefix)
			.set("user", message.user)
			.set("host", message.host)

		this._users.set(message.args[0], user)

		this.emit("nick", message.nick, message.args[0], user)
	}

	/**
	 * Emits when a user parts the channel
	 * @event Channel#part
	 * @type {Object}
	 * @property {User} user - The user that parted
	 * @property {String} message - The message they left with
	 */
	handlePart(message){
		message.args.shift()

		const user = new User(message.nick, this._connection)

		user.set("prefix", message.prefix)
			.set("user", message.user)
			.set("host", message.host)

		this._users.delete(message.nick)

		this.emit("part", user, message.args[0])
	}

	/**
	 * Emits when a user is kicked from the channel
	 * @event Channel#kick
	 * @type {Object}
	 * @property {User} user - The user that was kicked
	 * @property {User} by - The user who kicked
	 * @property {String} reason - The reason for the kick
	 */
	handleKick(message){
		let user = this._users.get(message.args[1])

		this._users.delete(message.nick)

		this.emit("kick", user, message.nick, message.args[2])
	}

	/**
	 * Sends a message to the channel
	 * @function
	 * @param {String} message - The message to send
	 * @author Mackan
	 */
	sendMessage(message){
		this._connection.write(`PRIVMSG ${this._channelName} :${message}\n`)
	}

	/**
	 * Sends an action message to the channel
	 * @function
	 * @param {String} message - The message to send
	 * @author Mackan
	 */
	sendAction(message){
		this._connection.write(`PRIVMSG ${this._channelName} :\u0001ACTION ${message}\u0001\n`)
	}
}

module.exports = Channel