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
            //this.generateBots(JSON.parse(data).accounts);
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

            bot.on('chat', function(data) {

                if(data.from.role > 2) {
                    if(data.message.indexOf('$speak') > -1) {
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
                        else if(command.search("sendChat") > -1)
                        {
                            this.sendChat(bot, message);
                        }
                    }
                }
            }.bind(this));

        }.bind(this));
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
        bot.sendChat('Woot-ing the song');
        bot.woot();
    },
    meh: function(bot) {
        bot.sendChat('Meh-ing the song');
        bot.meh();
    },
    sendChat: function(bot, msg) {
        bot.sendChat(msg);
    }
};

module.exports = swarm;