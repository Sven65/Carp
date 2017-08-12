const CarpError = require('./CarpError')

class InvalidError extends CarpError{
	constructor(message){
		super(message || 'Invalid parameters supplied.')
	}
}

module.exports = InvalidError