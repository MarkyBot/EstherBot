
'use strict';

const _ = require('lodash');
const Script = require('smooch-bot').Script;

const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        //prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('So you want to learn about Esther? Just say HELLO to get started.')
                .then(() => 'speak');
        }
    },

    speak: {
        receive: (bot, message) => {

            let upperText = message.text.trim().toUpperCase();

            function updateSilent() {
                switch (upperText) {
                    case "CONNECT ME":
                        return bot.setProp("silent", true);
                    case "DISCONNECT":
                        return bot.setProp("silent", false);
                    default:
                        return Promise.resolve();
                }
            }

            function getSilent() {
                return bot.getProp("silent");
            }
            /* getReply should allow for some variety in responses for received text messages that 
do not have an entry in the scripts.json file. */
            function getReply() {
                var messages = [ "Sorry. I'm not configured with a response to your message. Hola Hello.",
                                 "Hey, I didn't understand that. I suggest saying Hello",
                                 "You're not sending messages to an Artifical Intelligence program. Try Hello to see some other COMMANDS",
                                 "The program responds to COMMANDS only. You have to send a command that I understand. :)",
                                 "Seriously, you are wayyyyy smarter than MarkyBot. It just knows simple COMMANDS",
                                 "Yo. I do not know what you are talking about. Send me a HELLO",
                                 "There is a ton of information in MarkyBot. You have to use COMMANDS to find it.",
                                 "That's interesting. Hhhmmm... I never thought of that. Maybe try Hello",
                                 "Can you say that again?",
                                 "HODOR!...Wait, what did I just say. I'm watching too much TV.",
                                 "Yeah... that happens from time to time. Try Hello.",
                                 "That is a ton of words you just wrote there... I really don't know. Try Hello",
                                 "Try sending a command without punctuation.",
                                 "I'm not programmed to ignore punctuation. So if you're sending something other than letters... I don't understand it."
                                ];

                var arrayIndex = Math.floor( Math.random() * messages.length );


                return messages[arrayIndex];
                
            }

            function processMessage(isSilent) {
                if (isSilent) {
                    return Promise.resolve("speak");
                }

                if (!_.has(scriptRules, upperText)) {
                    return bot.say(`I didn't understand that.`).then(() => 'speak');
                }

                var response = scriptRules[upperText];
                var lines = response.split('\n');

                var p = Promise.resolve();
                _.each(lines, function(line) {
                    line = line.trim();
                    p = p.then(function() {
                        console.log(line);
                        return bot.say(line);
                    });
                })

                return p.then(() => 'speak');
            }

            return updateSilent()
                .then(getSilent)
                .then(processMessage);
        }
    }
});
