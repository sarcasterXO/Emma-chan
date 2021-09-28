const byteSize = require('byte-size')
const emojiList = ['⏮', '◀️', '▶️', '⏭'],
timeout = 120000;
const util = require("./util");

module.exports = class Util {

static time = function (s) {
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  var days = parseInt(Math.floor(hrs / 24));
  hrs = parseInt(hrs % 24);

  var semanas = parseInt(Math.floor(days / 7));
  days = parseInt(days % 7);

  var meses = parseInt(Math.floor(semanas / 7));
  semanas = parseInt(semanas % 7);

  return (
    (meses > 0 ? pad(meses) + 'm, ' : "") +
    (semanas > 0 ? pad(semanas) + 's ' : '') +
    (days > 0 ? pad(days) + 'd ' : "") +
    (hrs > 0 ? pad(hrs) + 'h ' : "") +
    (mins > 0 ? pad(mins) + 'm ' : "") +
    (pad(secs) + 's')
  )
}

static time2 = function (s) {
  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  var days = parseInt(Math.floor(hrs / 24));
  hrs = parseInt(hrs % 24);

  var semanas = parseInt(Math.floor(days / 7));
  days = parseInt(days % 7);

  var meses = parseInt(Math.floor(semanas / 7));
  semanas = parseInt(semanas % 7);

  return (
    (meses > 0 ? pad(meses) + ':' : "") +
    (semanas > 0 ? pad(semanas) + ':' : "") +
    (days > 0 ? pad(days) + ':' : "") +
    (hrs > 0 ? pad(hrs) + ':' : "") +
    (mins > 0 ? pad(mins) + ':' : "") +
    (pad(secs))
  )
}

static bytes = function (size) {
  return (byteSize(size))
}

static get paginationEmojis() {
  return ["◀", "⛔", "▶"];
}

static async queuepaginator (bot, channel, pages) {
	let page = 0;
    let curPage;
    try {
	curPage = await channel.send([pages[page]])
    .catch((err) => {});
    } catch(err) {
       return channel.send(util.embed().setDescription(`Queue is currently empty. Try again after sometime as all the songs are not fetched yet.`))
        .then((m) => m.delete({ timeout: 10000 }))
        .catch((err) => {});
    }


	// React to embed with all emojis
	for (const emoji of emojiList) {
		await curPage.react(emoji).catch((err) => {});
	}

	// Create reactionCollector to update page in embed
	const filter = (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot;
	const reactionCollector = await curPage.createReactionCollector(filter, {time: timeout });

	// Find out what emoji was reacted on to update pages
	reactionCollector.on('collect', (reaction, user) => {
		if (!user.bot) reaction.users.remove(user.id).catch((e) => e.stack);

		switch (reaction.emoji.name) {
		case emojiList[0]:
			page = 0;
			break;
		case emojiList[1]:
			page = page > 0 ? --page : 0;
			break;
		case emojiList[2]:
			page = page + 1 < pages.length ? ++page : (pages.length - 1);
			break;
		case emojiList[3]:
			page = pages.length - 1;
			break;
		default:
			break;
		}
		curPage.edit([pages[page]])
    .catch((e) => e.stack);
	});

	// When timer runs out remove all reactions to show end of pageinator
	reactionCollector.on('end', () => curPage.reactions.removeAll().catch((e) => e.stack));
	return curPage;
};

static cleanTrackTitle (title) {
  let cleanTitle = title;
  if(title.length > 30) cleanTitle = title.slice(0, 30) + "..."
  return cleanTitle;
}

}