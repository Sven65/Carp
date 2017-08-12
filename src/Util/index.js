const User = require("../Structures/User")


module.exports = {
	parseMessage(message){
		let match = message.match(/:.*\d(\s)?(\*?)/)

		if(match){

			let codeMatch = match[0].match(/\s\d{3}\s/)

			let errorMessageMatch = message.match(/\*.*/)

			if(codeMatch){

				let toReturn = {
					code: parseInt(codeMatch[0])
				}

				if(errorMessageMatch){
					toReturn.message = errorMessageMatch[0]
				}

				return toReturn
			}else{
				return null
			}
		}else{
			return null
		}
	},

	splitMessage(message, format=true){

		let split = message.split(" ")

		if(!format){
			return split
		}else{
			return {
				sender: split[0],
				command: split[1],
				params: split.slice(2)
			}
		}
	},

	getLastCode(message){
		let matches = message.match(/:.*\d(\s)?(\*?)/g)

		if(matches){
			let codeMatch = matches[matches.length-1].match(/\s\d{3}\s/)

			if(codeMatch){

				let errorMessageMatch = message.match(/\*.*/)

				let toReturn = {
					code: parseInt(codeMatch[0])
				}

				if(errorMessageMatch){
					toReturn.message = errorMessageMatch[0]
				}

				return toReturn
			}else{
				return null
			}
		}
	},

	isPing(message){
		return /PING\s:.*/.test(message)
	},

	pingFrom(message){
		return message.match(/:.*/)[0]
	},

	isMode(message, username){
		return new RegExp(`:${username}\sMODE\s${username}\s:\+i`, "g").test(message)
	},

	resolveUser(userString){
		return new User(userString)
	}
}