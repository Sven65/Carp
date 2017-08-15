const os = require('os')
const http = require('http')
const net = require('net')

module.exports = {
	/**
	 * Gets the local IP's
	 * @function
	 * @returns {Array.<String>}
	 */
	getIP: function(){
		const interfaces = os.networkInterfaces()
		let addresses = []
		for(let k in interfaces){
			for(let k2 in interfaces[k]){
				let address = interfaces[k][k2]
				if(address.family === 'IPv4' && !address.internal){
					addresses.push(address.address)
				}
			}
		}
		return addresses
	},

	/**
	 * Gets the public IPv4
	 * @function
	 * @returns {Promise.<String>}
	 */
	getPublicIP: function(){
		return new Promise((resolve, reject) => {
			http.get('http://ipv4bot.whatismyipaddress.com', function(res){
				res.setEncoding('utf8')
				res.on('data', function(chunk){
					resolve(chunk)
				})
			})
		})
	},

	getRandomInt: function(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	/**
	 * Gets an unused port
	 * @function
	 * @returns {Promise.<Number>}
	 */
	getUnusedPort: function(options){
		return new Promise((resolve, reject) => {
			let min = options.min
			let max = options.max
			let localAddress = options.localAddress

			let port = this.getRandomInt(min, max)
			let server = net.createServer()

			server.listen(port, localAddress, () => {
				server.once("close", () => {
					resolve(port)
				})
				server.close()
			})

			server.on("error", () => {
				return this.getUnusedPort(options)
			})
		})
	},

	/**
	 * Converts an IP to a long
	 * @function
	 * @param {String} ip - The IP to convert
	 * @returns {Number}
	 */
	toLong: function(ip){
		let ipl = 0
		ip.split('.').map(octet => {
			ipl <<= 8
			ipl += parseInt(octet)
		})
		return(ipl >>> 0)
	},

	/**
	 * Converts a long to an IP
	 * @function
	 * @param {Number} ipl - The long to convert
	 * @returns {String}
	 */
	fromLong: function(ipl){
		return ((ipl >>> 24) + '.' +
				(ipl >> 16 & 255) + '.' +
				(ipl >> 8 & 255) + '.' +
				(ipl & 255) )
	}
}