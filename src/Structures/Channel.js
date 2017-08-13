const EventEmitter = require('events')
const User = require("./User")


class Channel extends EventEmitter{
	constructor(connection, channelName){
		super()

		this._connection = connection
		this._channelName = channelName
	}

	/**
	 * Gets the name of the channel
	 * @type {String}
	 */
	get name(){
		return this._channelName
	}

	/*
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

		this.emit("join", user)
	}


	/*
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

		this.emit("message", user, message.args[1])
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
		}
	}

	/*
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

		this.emit("part", user, message.args[0])
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
}

module.exports = Channel