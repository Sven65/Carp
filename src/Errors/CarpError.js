class CarpError extends Error{
	constructor(message, name=null){
		super(message)

		this.message = message
		this.name = name||this.constructor.name

		Error.captureStackTrace(this, this.constructor)
	}
}

module.exports = CarpError