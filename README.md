# Carp

An IRC Library for Node.js

Install using `npm install carpjs`

## Example usage


```javascript
const Carp = require("carpjs")
const Client = new Carp.Client({
	username: "MyClient"
})

Client.on("ready", () => {
	console.log("Logged in!")

	Client.join("#myChannel") // Joins the channel "#myChannel"
})

Client.on("join", joinData => { // When the client joins a channel, catch the event
	let channelJoined = joinData.channel // Get the channel that was joined

	channelJoined.on("message", (from, message) => { // When the channel gets a message, catch the event
		if(message === "ping"){ // If the message is "ping"
			channelJoined.sendMessage(`${from.info.nick} Ping!`) // Send a message to the channel with the users nick and "Ping!"
		}
	})
})

Client.connect("irc.freenode.net") // Connect to the freenode IRC server
```
