module.exports = {

	"001": {
		name: "RPL_WELCOME",
		type: "REPLY"
	},
	"002": {
		name: "RPL_YOURHOST",
		type: "REPLY"
	},
	"003": {
		name: "RPL_CREATED",
		type: "REPLY"
	},
	"004": {
		name: "RPL_MYINFO",
		type: "REPLY"
	},
	"005": {
		name: "RPL_ISUPPORT",
		type: "REPLY"
	},

	301: {
		name: "RPL_AWAY",
		type: "REPLY"
	},

	302: {
		name: "RPL_USERHOST",
		type: "REPLY"
	},
	303: {
		name: "RPL_ISON",
		type: "REPLY"
	},

	305: {
		name: "RPL_UNAWAY",
		type: "REPLY"
	},

	306: {
		name: "RPL_NOWAWAY",
		type: "REPLY"
	},
	311: {
		name: "RPL_WHOISUSER",
		type: "REPLY"
	},
	312: {
		name: "RPL_WHOISSERVER",
		type: "REPLY"
	},
	313: {
		name: "RPL_WHOISOPERATOR",
		type: "REPLY"
	},
	314: {
		name: "RPL_WHOWASUSER",
		type: "REPLY"
	},
	317: {
		name: "RPL_WHOISIDLE",
		type: "REPLY"
	},
	318: {
		name: "RPL_ENDOFWHOIS",
		type: "REPLY"
	},
	319: {
		name: "RPL_WHOISCHANNELS",
		type: "REPLY"
	},
	369: {
		name: "RPL_ENDOFWHOWAS",
		type: "REPLY"
	},

	321: {
		name: "RPL_LISTSTART",
		type: "REPLY"
	},
	322: {
		name: "RPL_LIST",
		type: "REPLY"
	},
	323: {
		name: "RPL_LISTEND",
		type: "REPLY"
	},
	324: {
		name: "RPL_CHANNELMODEIS",
		type: "REPLY"
	},
	331: {
		name: "RPL_NOTOPIC",
		type: "REPLY"
	},
	332: {
		name: "RPL_TOPIC",
		type: "REPLY"
	},

	341: {
		name: "RPL_INVITING",
		type: "REPLY"
	},
	342: {
		name: "RPL_SUMMONING",
		type: "REPLY"
	},
	351: {
		name: "RPL_VERSION",
		type: "REPLY"
	},
	352: {
		name: "RPL_WHOREPLY",
		type: "REPLY"
	},
	315: {
		name: "RPL_ENDOFWHO",
		type: "REPLY"
	},
	353: {
		name: "RPL_NAMREPLY",
		type: "REPLY"
	},
	
	366: {
		name: "RPL_ENDOFNAMES",
		type: "REPLY"
	},
	364: {
		name: "RPL_LINKS",
		type: "REPLY"
	},
	365: {
		name: "RPL_ENDOFLINKS",
		type: "REPLY"
	},
	367: {
		name: "RPL_BANLIST",
		type: "REPLY"
	},
	368: {
		name: "RPL_ENDOFBANLIST",
		type: "REPLY"
	},
	371: {
		name: "RPL_INFO",
		type: "REPLY"
	},
	374: {
		name: "RPL_ENDOFINFO",
		type: "REPLY"
	},
	375: {
		name: "RPL_MOTDSTART",
		type: "REPLY"
	},
	376: {
		name: "RPL_ENDOFMOTD",
		type: "REPLY"
	},
	372: {
		name: "RPL_MOTD",
		type: "REPLY"
	},
	381: {
		name: "RPL_YOUREOPER",
		type: "REPLY"
	},
	382: {
		name: "RPL_REHASHING",
		type: "REPLY"
	},
	391: {
		name: "RPL_TIME",
		type: "REPLY"
	},
	392: {
		name: "RPL_USERSSTART",
		type: "REPLY"
	},
	393: {
		name: "RPL_USERS",
		type: "REPLY"
	},

	394: {
		name: "RPL_ENDOFUSERS",
		type: "REPLY"
	},
	395: {
		name: "RPL_NOUSERS",
		type: "REPLY"
	},
	

	200: {
		name: "RPL_TRACELINK",
		type: "REPLY"
	},
	201: {
		name: "RPL_TRACECONNECTING",
		type: "REPLY"
	},
	202: {
		name: "RPL_TRACEHANDSHAKE",
		type: "REPLY"
	},
	203: {
		name: "RPL_TRACEUNKNOWN",
		type: "REPLY"
	},
	

	204: {
		name: "RPL_TRACEOPERATOR",
		type: "REPLY"
	},
	205: {
		name: "RPL_TRACEUSER",
		type: "REPLY"
	},
	206: {
		name: "RPL_TRACESERVER",
		type: "REPLY"
	},
	208: {
		name: "RPL_TRACENEWTYPE",
		type: "REPLY"
	},
	261: {
		name: "RPL_TRACELOG",
		type: "REPLY"
	},
	

	211: {
		name: "RPL_STATSLINKINFO",
		type: "REPLY"
	},

	212: {
		name: "RPL_STATSCOMMANDS",
		type: "REPLY"
	},

	213: {
		name: "RPL_STATSCLINE",
		type: "REPLY"
	},
	214: {
		name: "RPL_STATSNLINE",
		type: "REPLY"
	},
	215: {
		name: "RPL_STATSILINE",
		type: "REPLY"
	},
	216: {
		name: "RPL_STATSKLINE",
		type: "REPLY"
	},
	218: {
		name: "RPL_STATSYLINE",
		type: "REPLY"
	},
	219: {
		name: "RPL_ENDOFSTATS",
		type: "REPLY"
	},
	241: {
		name: "RPL_STATSLLINE",
		type: "REPLY"
	},

	242: {
		name: "RPL_STATSUPTIME",
		type: "REPLY"
	},
	243: {
		name: "RPL_STATSOLINE",
		type: "REPLY"
	},
	244: {
		name: "RPL_STATSHLINE",
		type: "REPLY"
	},
	
	221: {
		name: "RPL_UMODEIS",
		type: "REPLY"
	},
	251: {
		name: "RPL_LUSERCLIENT",
		type: "REPLY"
	},
	252: {
		name: "RPL_LUSEROP",
		type: "REPLY"
	},

	253: {
		name: "RPL_LUSERUNKNOWN",
		type: "REPLY"
	},
	254: {
		name: "RPL_LUSERCHANNELS",
		type: "REPLY"
	},
	255: {
		name: "RPL_LUSERME",
		type: "REPLY"
	},
	256: {
		name: "RPL_ADMINME",
		type: "REPLY"
	},
	257: {
		name: "RPL_ADMINLOC1",
		type: "REPLY"
	},
	258: {
		name: "RPL_ADMINLOC2",
		type: "REPLY"
	},
	
	259: {
		name: "RPL_ADMINEMAIL",
		type: "REPLY"
	},
	


	// ERRORS

	401: {
		name: "ERR_NOSUCHNICK",
		type: "ERROR"
	},
	402: {
		name: "ERR_NOSUCHSERVER",
		type: "ERROR"
	},
	403: {
		name: "ERR_NOSUCHCHANNEL",
		type: "ERROR"
	},
	404: {
		name: "ERR_CANNOTSENDTOCHAN",
		type: "ERROR"
	},
	405: {
		name: "ERR_TOOMANYCHANNELS",
		type: "ERROR"
	},
	406: {
		name: "ERR_WASNOSUCHNICK",
		type: "ERROR"
	},
	407: {
		name: "ERR_TOOMANYTARGETS",
		type: "ERROR"
	},
	409: {
		name: "ERR_NOORIGIN",
		type: "ERROR"
	},
	411: {
		name: "ERR_NORECIPIENT",
		type: "ERROR"
	},
	412: {
		name: "ERR_NOTEXTTOSEND",
		type: "ERROR"
	},
	413: {
		name: "ERR_NOTOPLEVEL",
		type: "ERROR"
	},
	414: {
		name: "ERR_WILDTOPLEVEL",
		type: "ERROR"
	},
	421: {
		name: "ERR_UNKNOWNCOMMAND",
		type: "ERROR"
	},
	422: {
		name: "ERR_NOMOTD",
		type: "ERROR"
	},
	423: {
		name: "ERR_NOADMININFO",
		type: "ERROR"
	},
	424: {
		name: "ERR_FILEERROR",
		type: "ERROR"
	},
	431: {
		name: "ERR_NONICKNAMEGIVEN",
		type: "ERROR"
	},
	432: {
		name: "ERR_ERRONEUSNICKNAME",
		type: "ERROR"
	},
	433: {
		name: "ERR_NICKNAMEINUSE",
		type: "ERROR"
	},
	436: {
		name: "ERR_NICKCOLLISION",
		type: "ERROR"
	},
	441: {
		name: "ERR_USERNOTINCHANNEL",
		type: "ERROR"
	},
	442: {
		name: "ERR_NOTONCHANNEL",
		type: "ERROR"
	},
	443: {
		name: "ERR_USERONCHANNEL",
		type: "ERROR"
	},
	444: {
		name: "ERR_NOLOGIN",
		type: "ERROR"
	},
	445: {
		name: "ERR_SUMMONDISABLED",
		type: "ERROR"
	},
	446: {
		name: "ERR_USERSDISABLED",
		type: "ERROR"
	},
	451: {
		name: "ERR_ NOTREGISTERED",
		type: "ERROR"
	},
	461: {
		name: "ERR_NEEDMOREPARAMS",
		type: "ERROR"
	},
	462: {
		name: "ERR_ALREADYREGISTERED",
		type: "ERROR"
	},
	463: {
		name: "ERR_NOPERMFORHOST",
		type: "ERROR"
	},
	464: {
		name: "ERR_PASSWDMISMATCH",
		type: "ERROR"
	},
	465: {
		name: "ERR_YOUREBANNEDCREEP",
		type: "ERROR"
	},
	467: {
		name: "ERR_KEYSET",
		type: "ERROR"
	},
	471: {
		name: "ERR_CHANNELISFULL",
		type: "ERROR"
	},
	472: {
		name: "ERR_UNKNOWNMODE",
		type: "ERROR"
	},
	473: {
		name: "ERR_INVITEONLYCHAN",
		type: "ERROR"
	},
	474: {
		name: "ERR_BANNEDFROMCHAN",
		type: "ERROR"
	},
	475: {
		name: "ERR_BADCHANNELKEY",
		type: "ERROR"
	},
	481: {
		name: "ERR_NOPRIVILEGES",
		type: "ERROR"
	},
	482: {
		name: "ERR_CHANOPRIVSNEEDED",
		type: "ERROR"
	},
	483: {
		name: "ERR_CANTKILLSERVER",
		type: "ERROR"
	},
	491: {
		name: "ERR_NOOPERHOST",
		type: "ERROR"
	},
	501: {
		name: "ERR_UMODEUNKNOWNCHAN",
		type: "ERROR"
	},
	502: {
		name: "ERR_USERSDONTMATCH",
		type: "ERROR"
	},
	904: {
		name: "ERR_SASLFAIL",
		type: "ERROR"
	}
}