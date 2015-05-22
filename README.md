Plug Dj Swarm
===

"Botnet" for plugdj 
*** Multiple bots active at one time is still a work in progress ***

How to use
===

Setup Bot Account Credentials
---
First we need to setup the account data, lets do this by creating a file in our root project directory config/accounts.json
This file will contain our bot's account information. We can add as many or as little accounts as we want. It will look something like this:

```javascript
{
    "accounts": [
        {
          "email": "my-email@gmail.com",
          "password": "mySuperSecretPassword!"
        }
    ]
}
```

Configure Swarm To Your Room
---
Now that we have our account information plugged in, its time to kick it off in our script

* NameOfYourUser is you accounts username
* slugOfRoom is the url slug of the room ( The part after https://plug.dj/ in the url ) ex. 'hip-hop-stacks' 

```javascript
var swarm = require('./lib/swarm');

swarm.init({
    roomSlug: 'slugOfRoom',
    masterAccount: 'NameOfYourUser',
});


swarm.init();
```

As of right now the available commands for the masterAccount are: 
* $woot
* $meh
* $sendChat

Extending
---
You can customize the swarm by passing in a few options

```
var swarm = require('./lib/swarm');

swarm.init({
    roomSlug: 'slugOfRoom',
    masterAccount: 'NameOfYourUser',
    numBots : 1,
    command: '$',
});

swarm.init();
```
