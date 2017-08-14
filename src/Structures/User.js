/**
 * @typedef User
 * @type {Object}
 * @param {Object} whois - The whois data of the user
 * @param {String} whois.nick - The nick of the user
 * @param {?String} whois.away - How long the user has been away
 * @param {?String} whois.user - The users user ident
 * @param {?String} whois.host - The users host
 * @param {?String} whois.realname - The users realname
 * @param {?Array.<String>} whois.channels - The channels the user is in
 * @param {?String} whois.server - Server info
 * @param {?String} whois.serverinfo - Server info
 * @param {?String} whois.operator - Operator info
 * @param {?String} whois.account
 * @param {?String} whois.accountinfo
 * @param {Object} info - User info on join
 * @param {String} info.nick - The users nick
 * @param {?String} info.prefix - The users host
 * @param {?String} info.user - The users username
 * @param {?String} info.host - The users hostname
 */

class User{
	/**
 	 * Constructs a new user
 	 * @param {String} nick - The users nick
	 */
	constructor(nick, connection){
		this._whois = {
			nick: nick
		}

		this._info = {
			nick: nick
		}

		this._connection = connection
	}


	addWhois(key, value){
		this._whois[key] = value
	}

	/**
	 * Gets the users whois data
	 * @type {Object}
	 */
	get whois(){
		return this._whois
	}

	set(name, value){
		this._info[name] = value
		return this
	}

	/**
	 * Gets the users info
	 * @type {Object}
	 */
	get info(){
		return this._info
	}

	/**
	 * Sends a message to the user
	 * @function
	 * @param {String} message - The message to send
	 * @author Mackan
	 */
	sendMessage(message){
		this._connection.write(`PRIVMSG ${this._info.nick} :${message}\n`)
	}

	/**
	 * Sends an action message to the user
	 * @function
	 * @param {String} message - The message to send
	 * @author Mackan
	 */
	sendAction(message){
		this._connection.write(`PRIVMSG ${this._info.nick} :\u0001ACTION ${message}\u0001\n`)
	}

	/**
	 * Sends a CTCP notice to the user
	 * @function
	 * @param {String} type - The type to send
	 * @param {String} message - The message to send
	 * @author Mackan
	 */
	sendCTCP(type, message){
		this._connection.write(`NOTICE ${this._info.nick} :\u0001${type} ${message}\u0001\n`)
	}

	/**
	 * Sends a CTCP query to the user
	 * @function
	 * @param {String} type - The type to send
	 * @param {String} message - The message to send
	 * @author Mackan
	 */
	sendCTCPQuery(type, message){
		this._connection.write(`PRIVMSG ${this._info.nick} :\u0001${type} ${message}\u0001\n`)
	}
}

module.exports = User