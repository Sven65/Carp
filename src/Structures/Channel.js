const EventEmitter = require('events')
const User = require("./User")


class Channel extends EventEmitter{
	constructor(connection, channelName){
		super()

		this._connection = connection
		this._channelName = channelName

		this._users = []
	}

	/**
	 * Gets the name of the channel
	 * @type {String}
	 */
	get name(){
		return this._channelName
	}

	get topic(){
		return this._topic
	}

	get users(){
		return this._users
	}

	handleTopic(message){
		this._topic = {by: message.nick, text: message.args[1]}
		this.emit('topic', this._topic)
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

		this._users[message.nick] = user

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

		if(Object.keys(this._users[message.nick].info).length === 1){
			this._users[message.nick] = user
		}

		this.emit("message", user, message.args[1])
	}

	handleNames(message){
		let users = message.args[3].trim().split(/ +/)

		users.map(user => {
			let username = user.replace("@", "").replace("+", "")
			this._users[username] = new User(username, this._connection)
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

		delete channel.users[message.nick]

		this.emit("part", user, message.args[0])
	}

	/*
	 * Emits when a user is kicked the channel
	 * @event Channel#kick
	 * @type {Object}
	 * @property {User} user - The user that was kicked
	 * @property {User} by - The user who kicked
	 * @property {String} reason - The reason for the kick
	 */
	handleKick(message){
		let channel = this._channels[channelName]

		let user = this._users[message.args[1]]

		delete channel.users[message.args[1]]

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