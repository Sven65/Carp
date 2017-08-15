const EventEmitter = require('events')

class NickServ extends EventEmitter{
	constructor(connection, nick){
		super()
		this._connection = connection
		this._nick = nick
	}

	set nick(nick){
		this._nick = nick
	}

	identify(nick, pass){
		this._connection.write(`PRIVMSG NickServ :IDENTIFY ${nick===null?'':nick} ${pass}\n`)
	}


	handleRaw(message){
		if(message.command === "NOTICE"){

			let split = message.args[1].split(" ")

			if(split[1] === "ACC"){
				this.emit('acc', message.args[1].split(" "))
			}
		}
	}

	/**
	 * Gets parsable information about a users login status
	 * @function
	 * @returns {Promise.<Number>} status - The users login status
	 * 0 - Account or user does not exist
	 * 1 - Account exists but user is not logged in
	 * 2 - User is not logged in but recognized
	 * 3 - User is logged in
	 */
	acc(nick){
		return new Promise((resolve, reject) => {
			this.once('acc', info => {
				resolve(parseInt(info[2]))
			})

			this._connection.write(`PRIVMSG NickServ :ACC ${nick}\n`)
		})
	}


}

module.exports = NickServ