# Carp
A JS IRC library

To connect to a server, create a client using the `Carp.Client` interface;

```js
const client = new Carp.Client({
	username: "MyBot"
})
```

Then, connect to a server;

```js
client.connect("irc.freenode.net", 6667)
```

When the client has logged in, join a channel;

```js
client.on("login", () => {
	client.join("#mychannel")
})
```

When the client joins the channel, you can get the channel and respond to messages;

```js
client.on("join", (data) => {
	const channel = data.channel

	channel.on('message', (from, message) => {
		channel.sendMessage(`${from.name} said ${message}`)
	})
})
```