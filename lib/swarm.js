var PlugBotAPI = require('plugapi'),
    _ = require('underscore'),
    fs = require('fs');

PlugBotAPI.prototype.setBotId = function(id) {
    this.id = id;
};
PlugBotAPI.prototype.getBotId = function() {
    return this.id;
};

var swarm = {
    bots: [],
    numBots : 1,
    command: '$',
    roomSlug: 'hip-hop-stacks',
    masterAccount: 'Klaxon',

    init: function(options) {

        if(options) {
            if(options.numBots !== undefined) {
                this.numBots = options.numBots;
            }
            if(options.command !== undefined) {
                this.command = options.command;
            }
            if(options.roomSlug !== undefined) {
                this.roomSlug = options.roomSlug;
            }
            if(options.masterAccount !== undefined) {
                this.masterAccount = options.masterAccount;
            }
        }

        var accounts = this.getAccountJson();

        this.generateBots(accounts);

        this.setupBotListeners();

        this.go();

    },
    getAccountJson: function() {
        // Read json then call generate bots with that data
        var data = fs.readFileSync('./config/accounts.json');
        return JSON.parse(data).accounts;
    },
    generateBots: function(data) {

        _(this.numBots).times(function(i) {

            console.log('creating bot #', i);
            if(data[i] == undefined) {
                console.log('bailing out of generating bots');
                return;
            }

            var bot = new PlugBotAPI({
                    email: data[i].email,
                    password: data[i].password
                });

            bot.setBotId(i);

            this.bots.push(bot);

        }.bind(this));

    },
    setupBotListeners: function() {

        _.each(this.bots, function(bot) {

            setTimeout(function() {
                this.callOutPerson(bot, 'Oral_Enterprises', 'You are a dick', 5000);
            }.bind(this), 5000);


            bot.on('chat', function(data) {

                if(data.from.username !== bot.getSelf().username) {
                    if(data.message.indexOf('pizza') > -1) {
                        this.sendChat(bot, '@Oral_Enterprises you\'re a dick');
                    }
                    if(data.message.indexOf('oral rage') > -1) {
                        this.sendChat(bot, 'fuck this shit I\'m going to mindful');
                    }
                    if(data.message.indexOf('Oral can be a dick sometimes') > -1) {
                        this.sendChat(bot, 'i prefer the word pee-NIS');
                    }

                    if(data.message.indexOf('$commands') > -1) {
                        this.sendChat(bot, '=============== Bot Commands ==============');
                        this.sendChat(bot, ' $speak {{text}}');
                        this.sendChat(bot, '');
                        this.sendChat(bot, '=============== Bot Triggers ==============');
                        this.sendChat(bot, ' pause');
                        this.sendChat(bot, ' pizza');
                    }

                    if(data.from.role > 2) {
                        if(data.message.indexOf('$speak') > -1) {
                            bot.moderateDeleteChat(data.raw.cid);
                            this.sendChat(bot, this.parseCommandForMessage(data.message));
                        }
                    }

                    if (data.message.indexOf('pause') > -1) {
                        this.sendChat(bot, 'P');
                        this.sendChat(bot, 'A');
                        this.sendChat(bot, 'U');
                        this.sendChat(bot, 'S');
                        this.sendChat(bot, 'E');
                    }

                    if(data.raw.un == this.masterAccount) {
                        var message = data.message;

                        if(message.charAt(0) == "$") {
                            var command = message.substring(1, message.length);

                            if(command == "meh") {
                                this.meh(bot);
                            }
                            else if(command == "woot") {

                                this.woot(bot);
                            }
                            //else if(data.message.indexOf('$chat') > -1) {
                            //    this.sendChat(bot, this.parseCommandForMessage(data.message));
                                //bot.moderateDeleteChat(data.raw.cid);
                            //}


                        }
                    }
                }

            }.bind(this));

        }.bind(this));
    },
    callOutPerson: function(bot, person, message, delay) {
        setTimeout(function() {

            this.callOutPerson(bot, 'Oral_Enterprises', 'You are a dick', delay);
            bot.sendChat(bot, '@' + person + ' ' + message);

        }.bind(this), delay);
    },
    parseCommandForMessage: function(_msg) {

        var msg = _msg.substr(_msg.indexOf(" ") + 1);

        return msg;
    },
    go: function() {
        _.each(this.bots, function(bot, i) {
            setTimeout(function() {
                console.log('Connecting to room with', bot.getBotId());
                bot.connect(this.roomSlug);
            }.bind(this), 5000 * i);

            bot.on('roomjoin', function(room) {
                console.log("Joined " + room);
            });
        }.bind(this));
    },
    woot: function(bot) {
        bot.woot();
    },
    meh: function(bot) {
        bot.meh();
    },
    sendChat: function(bot, msg) {
        bot.sendChat(msg);
    }
};

module.exports = swarm;