'use strict';

const Script = require('smooch-bot').Script;
const scriptRules = require('./script.json');

module.exports = new Script({
    processing: {
        prompt: (bot) => bot.say('Beep boop...'),
        receive: () => 'processing'
    },

    start: {
        receive: (bot) => {
            return bot.say('Hi! I\'m Brody Bot! I can tell you all about Brody Berson.')
                .then(() => 'askName');
        }
    },

    askName: {
        prompt: (bot) => bot.say('What\'s your name?'),
        receive: (bot, message) => {
            const name = message.text;
            return bot.setProp('name', name)
                .then(() => bot.say('Great! Nice to meet you, ${name}'))
                .then(() => 'prompt');
        }
    },

    prompt: {
        receive: (bot) => {
            return bot.say('Currently, I only respond to keywords. Please reply '+
                'with one of the following: ')
                .then(() => 'commands');
        }
    },

    commands: {
        receive: (bot, message) => {
            var upperText = message.text.trim().toUpperCase();

            if (!_.has(scriptRules, upperText)) {
                    return bot.say('I didn\'t understand that – I can only respond to keywords ' +
                        '(a word I\'ve said in all caps), like HELP.')
                    .then(() => 'commands');
                }
            if (upperText == ('END' || 'BYE' || 'GOODBYE' || 'QUIT'))
            {
                return bot.say('Sorry to see you go.')
                    .then(() => 'finish');
            }else {
                var response = scriptRules[upperText];
                return bot.getProp('name')
                    .then((name) => bot.say(response))
                    .then(() => 'commands');
            }
        }
    },

    finish: {
        receive: (bot, message) => {
            return bot.getProp('name')
                .then((name) => bot.say('Sorry ${name}, Brody is still working on me. ' +
                        'Feel free to email him at brody.berson@me.com in the meantime...'))
                .then(() => 'finish');
        }
    }
});
