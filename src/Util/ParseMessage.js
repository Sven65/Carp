const codes = require('../Structures/Codes')

module.exports = (line) => {
	let message = {}

	let match = line.match(/^:([^ ]+) +/)

	if(match){
		message.prefix = match[1]

		line = line.replace(/^:[^ ]+ +/, '')

		match =  message.prefix.match(/^([_a-zA-Z0-9\~\[\]\\`^{}|-]*)(!([^@]+)@(.*))?$/)
	
		if(match){
			message.nick = match[1]
			message.user = match[3]
			message.host = match[4]
		}else{
			message.server = message.prefix
		}
	}

	match = line.match(/^([^ ]+) */)
	message.command = match[1]
	message.rawCommand = match[1]
	message.commandType = 'normal'

	line = line.replace(/^[^ ]+ +/, '')

	if(codes[message.rawCommand]){
		message.command = codes[message.rawCommand].name
		message.commandType = codes[message.rawCommand].type
	}

	message.args = []

	let middle, trailing

	if(line.search(/^:|\s+:/) !== -1){
		match = line.match(/(.*?)(?:^:|\s+:)(.*)/)

		middle = match[1].trimRight()
		trailing = match[2]
	}else{
		middle = line
	}

	if(middle.length){
		message.args = middle.split(/ +/)
	}

	if(typeof(trailing) !== 'undefined' && trailing.length){
		message.args.push(trailing)
	}

	return message
}