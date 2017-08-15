const EventEmitter = require('events')
const NetUtil = require("./NetUtil")
const net = require("net")
const fs = require("fs")
const path = require("path")

/**
 * @class
 * New DCC Client
 */
class DCC extends EventEmitter{

	/**
	 * @param {Client} client - The IRC Client
	 * @param {Object} options - Options for the DCC client
	 * @param {Array.<Number>} options.ports - The ports to use
	 * @param {String} options.localAddress - The clients local IP
	 */
	constructor(client, options={}){

		super()

		this._client = client

		this._options = options

		this._options.ports = options.ports||0
		this._options.localAddress = options.localAddress||NetUtil.getIP()[0]
	}

	/**
	 * Gets the clients public IP
	 * @function
	 * @private
	 * @returns {Promise.<String>}
	 */
	getIP(){
		return NetUtil.getPublicIP()
	}

	/**
	 * Gets a port and IP to use
	 * @function
	 * @private
	 * @returns {Promise.<Object>}
	 */
	getPortIP(){
		return new Promise((resolve, reject) => {
			let toReturn = {}

			this.getIP().then(host => {
				toReturn.host = host
				return this.getPort()
			}).then(port => {
				toReturn.port = port
				toReturn.long = NetUtil.toLong(toReturn.host)
				resolve(toReturn)
			})
		})
	}

	/**
	 * Gets a port to use
	 * @function
	 * @private
	 * @returns {Promise.<Object>}
	 */
	getPort(){
		return new Promise((resolve, reject) => {
			if(this._options.ports === 0){
				resolve(0)
			}else{
				return NetUtil.getUnusedPort({
					min: this._options.ports[0],
					max: this._options.ports[1],
					localAddress: this._options.localAddress
				})
			}
		})
	}

	/**
	 * Sends a CTCP query to a user
	 * @function
	 * @param {String} to - The user to send to
	 * @param {String} message - The message to send
	 * @author Mackan
	 */
	sendCTCPQuery(to, message){
		this._client._connection.write(`PRIVMSG ${to} :\u0001${message}\u0001\n`)
	}

	/**
	 * Sends a file to a user
	 * @function
	 * @param {String} to - The nick of the user to send the file to
	 * @param {String} filename - The filename to send
	 * @param {String} filepath - The path of the file
	 * @returns {Promise}
	 */
	sendFile(to, filename, filepath){
		return new Promise((resolve, reject) => {

			filepath = path.resolve(filepath)

			fs.stat(filepath, (err, filestat) => {

				if(err){
					reject(err)
					return
				}

				filename = filename.replace(/ /g, "_")

				this.getPortIP().then(details => {
					let start = 0

					function resumeCallback(from, args){
						if(args.filename === filename){
							start = args.position

							this.sendCTCPQuery(from, `DCC ACCEPT ${filename} ${args.port} ${args.position}`)
						}
					}

					let server = net.createServer()
					server.listen(details.port, this._options.localAddress, null, () => {
						let address = server.address()

						this.sendCTCPQuery(to, `DCC SEND ${filename} ${details.long} ${address.port} ${filestat.size}`)

						this.once('dcc-resume', resumeCallback)
					})

					server.on("connection", connection => {
						const cn = connection
						server.close()

						let readStream = fs.createReadStream(filepath, {
							start: start
						})

						readStream.pipe(cn, {end: false})

						readStream.on('end', () => {
							resolve()
						})
					})
				})
			})
		})
	}
}

module.exports = DCC