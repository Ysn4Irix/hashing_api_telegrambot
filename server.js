require('dotenv').config();
const TelegramBot = require("node-telegram-bot-api");
const request = require("request");

const token = process.env.TELEGRAM_TOKEN;

const bot = new TelegramBot(token, {
    polling: true
});

bot.onText(/\/hashme (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const input = match[1];

    if (input !== "" && input.length <= 20) {
        bot.sendMessage(chatId, "Hashing Wait ...").then(() => {
            request(`https://hashme.herokuapp.com/hash/${input}`, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    const parser = JSON.parse(body);
                    bot.sendMessage(chatId, "➖➖➖➖➖➖ Results ➖➖➖➖➖➖ \n" +
                        "<b>MD5 : </b>" + parser.md5 + "\n" +
                        "<b>SHA1 : </b>" + parser.sha1 + "\n" +
                        "<b>SHA256 : </b>" + parser.sha256 + "\n" +
                        "<b>SHA512 : </b>" + parser.sha512, {
                            parse_mode: "HTML"
                        });
                } else {
                    bot.sendMessage(chatId, "Sorry!! We can't process your request at this time try again later");
                }
            });
        })

    } else {
        bot.sendMessage(chatId, "Sorry!! Max length is 20 characters");
    }
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const chatUser = msg.from.username;
    const Hi = "hi";
    if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
        bot.sendMessage(chatId, `Hello 👋 <b>${chatUser}</b>`, {
            parse_mode: "HTML"
        });
    }

    const Bye = "bye";
    if (msg.text.toString().toLowerCase().includes(Bye)) {
        bot.sendMessage(chatId, `Hope to see you around again <b>${chatUser}</b>, Bye 🖖`, {
            parse_mode: "HTML"
        });
    }
});

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to <strong>HashME</strong> send /hashme follow by your text", {
        parse_mode: "HTML"
    });
});