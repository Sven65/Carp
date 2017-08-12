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

	/**
	 * Handles user joins
	 * @event Channel#join
	 *
	 * @type {object}
	 * @property {User} user - The user that joined
	 * @author Mackan
	 */
	handleJoin(parts){
		const user = new User(parts.sender)

		this.emit('join', user)
	}


	/**
	 * Handles messages
	 * @event Channel#message
	 *
	 * @type {object}
	 * @property {User} sender - The user that sent it
	 * @property {Array.<string>} - The message params
	 * @author Mackan
	 */
	handleMessage(parts){

		parts.params.shift()

		const user = new User(parts.sender)

		parts.params[0] = parts.params[0].replace(":", "")
		parts.params[parts.params.length-1] = parts.params[parts.params.length-1].replace(/\r?\n|\r/g, "")

		this.emit('message', user, parts.params)
	}

	/**
	 * Handles parting
	 * @event Channel#part
	 *
	 * @type {object}
	 * @property {User} user - The user that parted
	 * @property {String} message - The parting message
	 * @author Mackan
	 */
	handlePart(parts){

		parts.params.shift()

		const user = new User(parts.sender)

		this.emit('part', user, parts.params.join(" "))
	}

	/**
	 * Sends a message to the channel
	 * @function
	 * @param {String} message - The message to send
	 * @author Mackan
	 */
	sendMessage(message){
		//console.log(this._connection)
		this._connection.write(`PRIVMSG ${this._channelName} :${message}\n`)
	}
}

module.exports = Channel