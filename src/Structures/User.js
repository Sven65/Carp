class User{
	/**
 	 * Constructs a new user
 	 * @param {String} userString - The users datastring
	 */
	constructor(userString){
		let userData = userString.split("!")

		this._name = userData[0].replace(":", "")

		this._hostname = userData[1]
	}

	/**
 	 * Gets the users name
 	 * @type {String}
	 */
	get name(){
		return this._name
	}

	/**
	 * Gets the users hostname
	 * @type String
	 */
	get hostname(){
		return this._hostname
	}
}

module.exports = User