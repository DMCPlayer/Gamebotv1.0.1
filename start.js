//Load the discord.js library
const Discord = require("discord.js");
const dbl = require("discord-bot-list");

//Client = bot 
const client = new Discord.Client();

//Load the config file
const config = require("./config.json");
//config.prefix for bot's prefixes

const package = require("./package.json")
//Searches for the package file including info about the bot
//package.version = bot's vertions
//package.name = bot's name
//package.author = bot's author's name
var helps = require("./help.json")

//When the bot startsup this is sent in the console
client.on("ready", () => {
    console.log(`Bot running on ${client.guilds.size} servers & ${client.channels.size} channels, serving ${client.users.size} users`)
    //This sets the Bot's game status
    client.user.setPresence({
        game: {
            name: `${config.prefix}help | Serving ${client.guilds.size} servers`,
        }
    });
});

client.on("guildCreate", guild => {
    //This event is triggered when the bot joins a new guild
    console.log(`Joined server: ${guild.name}\nID: ${guild.id}\nMemberCount: ${guild.memberCount}`)
    client.user.setPresence({
        game: {
            name: `${config.prefix}help | Serving ${client.guilds.size} servers`,
        }
    });
});

client.on("guildDelete", guild => {
    //This event is triggered when the bot is removed from a guild.
    console.log(`Bot has been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setPresence({
        game: {
            name: `${config.prefix}help | Serving ${client.guilds.size} servers`,
        }
    });
});

//When a message is sent in Server Channel/Direct Message
client.on("message", function(message) {
    var sayMessage;
    var embed;
    const args = message.content.substring(config.prefix.length).split(" ");

    //Checks if the message author isn't a bot
    if (message.author.equals(client.user)) return;
    //Checks if the message starts with the prefix
    if (!message.content.startsWith(config.prefix)) return;
    
    //Starting the commands right here
    switch(args[0]) {
       //Bot Info commands 
        //A Ping command to show bots Latency
        case "ping":
            message.channel.send(`**Ping!** \`${Math.round(client.ping)}\`ms :ping_pong:`)
        break;
        //Command to display bot's guilds/channels/users/developers/contributors/uptime/etc.
        case "stats":
            //Differenct embed(hex) colors
           const colors = [
               "#ff1000",
               "#ff4c00",
               "#ffdd00",
               "#15ff00",
               "#00ffe9",
               "#000cff",
               "#ff00e1",
           ]; 
           //Boing stuff to set the seconds/minutes/hours/day/bla bla..
            String.prototype.toHHMMSS = function () {
            //Defines the days, hours, minutes, seconds     
            var sec_num = parseInt(this, 10); // don't forget the second param
            var days = Math.floor(sec_num / 86400);
            var hours   = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);
            //Adds another digit to them if they are more than 2 digits
            if (days    < 10) {days    = "0"+days;} 
            if (hours   < 10) {hours   = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            var time    = days+'d '+hours+'h '+minutes+'m '+seconds+'s';
            return time;
            }
            var time = process.uptime();
            var uptime = (time + "").toHHMMSS();
           //Boing stuff to set the seconds/minutes/hours/day/bla bla..
 
            //The sent embed including all possible information
            embed = new Discord.RichEmbed()
                .setColor(colors[Math.floor(Math.random() * colors.length)])
                .setAuthor(`${client.user.username}'s stats`, client.user.avatarURL)
                .addField("Server Count", `\`${client.guilds.size}\``, true)
                .addField("Channel Count", `**${client.channels.size}**`, true)
                .addField("Users", `\`${client.users.size}\``, true)
                .addField("Uptime", `**${uptime}**`, true)
                .addField("Developer", `DMCPlayer#6346`, true)
                .addField("Contributors", `**-**\`LightWayUp\`\n**-**\`Vanished\``)
                .addField("Version", package.version)
            ;
            //Send the embed in a message 
            message.channel.send(embed);
        break;
        //Sends an embed to upvote the bot on https://discordbots.org
        case "upvote":
            embed = new Discord.RichEmbed()
                .addField("Upvote the bot in Discord bot list!", "https://discordbots.org/bot/365751135086051340", true);
            message.channel.send(embed);
        break;
        //Command used to evaluate a functions (eg. gb;eval client.guilds.size, returns number of guilds the bot is in)
        case "eval":
            //sayMessage is the message sent by the author excluding the command and prefix
            sayMessage = args.slice(0).join(" ")
            embed = new Discord.RichEmbed()
                .setColor("#d84704")
                .setAuthor("Evaluating", client.user.avatarURL)
                .addField(":inbox_tray: Input:", "```" + sayMessage + "```")
                .addField(":outbox_tray: Output:", "```" + eval(args[1]) + "```")
            ;
            //Checks if the author's id equals the bot's owner id. Me. hi.
            if (message.author.id !== "191520413107355648") return;
            else {
                message.channel.send(embed);
            }            
        break;
        //Lists the servers the bot is serving
        case "servers":
            if (message.author.id !== "191520413107355648" || client.guilds.size > 100) return;
            else (message.channel.send(client.guilds.map(g => "`" + g.name + "`").join(` **|** `)));      
        break;
        //Just an invite link to my own server. (Join plz, we have cookies! ;D)
        case "invite": 
            message.channel.send("**Want to help the bot?**")
            message.channel.send("**:pizza: Join our server here : https://discord.gg/MYkRtGB** :sparkles:")
        break;
       //Bot Info commands
       //Bot fun commands
         //Command that ships two random people or the message's author with a random person
         case "ship":
          let ship = "me";
          if (ship) {
              return message.channel.send(`I ship **${message.author.username}** with **${message.guild.members.random().user.username}**`)
          }  
          else {
            return message.channel.send(`I ship **${message.guild.members.random().user.username}** with **${message.guild.members.random().user.username}**`)
            
          }
         break;
         //Roll a dice, test your luck!
         case "dice":
          message.channel.send(`**Dice landed on \`${[Math.floor(Math.random() * 5) + 1]}\`**`)
         break;
         //A russianroulette command with death messages aswell as funny ones
         case "rr": case "russianroulette":
            let rr = [
             "**Bang! You're dead son**",
             "**Miniguns never miss** :wink:",
             "**Rip out of ammo, lemme reload real quick**",
             "**Bang! Oh wait, that's a toy gun... JIMMY!**"
            ];
            message.channel.send(rr[Math.floor(Math.random() * rr.length)]);
         break;
         //( ͡° ͜ʖ ͡°)
         case "lenny":
            if (message.guild.member(client.user).hasPermission(`MANAGE_MESSAGES`)) {
                message.delete();
                message.channel.send(`**( ͡° ͜ʖ ͡°)**`);
            } else (message.channel.send("**( ͡° ͜ʖ ͡°)**"));
         break;
         /*Let the bot send your message splicing the prefix and command, deletes it if it 
         has MANAGE_MESSAGES permission*/
         case "say":
            sayMessage = args.splice(1).join(" ");
            if (message.guild.member(client.user).hasPermission(`MANAGE_MESSAGES`)) {
                message.delete();
                message.channel.send(sayMessage);
            }else message.channel.send(sayMessage);   
         break;
         //Lets the bot choose between multiple stuff
         case "choose":
            const e = `${config.prefix}choose`
            //Defines the stuff to choose between, splited by ", "
            let choices = message.content.substring(e.length).split(", ");
            //Checks if there is args[1]
            if (!args[1]) return message.channel.send("**Usage:** ---choose `<option1>`, `<option2>`, `<option3>` **etc.**")
            else return message.channel.send(`<:wheel:381819316070252554> **Chosen:** \`${choices[Math.floor(Math.random() * choices.length)]}\` <:wheel:381819316070252554>`)
         break;
         //An 8ball command, Test your fortune!
         case "8ball":
            //Answers sent if the args are less than 1
            let a = [
                "**Mmmm, can't read that try again :wink:**",
                "**boi, u gotta ask a question**:question:",
                "**let me think. no..**",
                "**Error: too dumb to be read**:clipboard:",
                "**I can't read air**"
            ];
            //Forunte answers
            let b = [
                "Yes",
                "No",
                "Maybe",
                "I'm not google, how am I supposed to know?",
                "idc",
                "leave me alone",
                "42",
                "14-13",
                "ew, i have a gf!"
            ];
            //Checking if there is args[1]
            if (!args[1]) message.channel.send(a[Math.floor(Math.random() * a.length)])
            //Checking if the messages ends with a question mark
            if (!message.content.endsWith("?")) message.channel.send("**Questions end with a question mark, nub.**")
            else (message.channel.send(b[Math.floor(Math.random() * b.length)]))
         break;
       //Bot fun commands
       //Bot Utility commands
        case "avatarme":
         const colors1 = [
            "#ff1000",
            "#ff4c00",
            "#ffdd00",
            "#15ff00",
            "#00ffe9",
            "#000cff",
            "#ff00e1",
            ]; 
         embed = new Discord.RichEmbed()
            .setColor(colors1[Math.floor(Math.random() * colors1.length)])
            .setAuthor(`${message.author.username}'s avatar`, message.author.avatarURL, message.author.avatarURL)
            .setImage(message.author.avatarURL)
         ;
         message.channel.send(embed);
        break;
       //Bot Utility commands
       //Bot server commands
        //Lists the guild's custom emojis in an embed
        case "emojis":
            embed = new Discord.RichEmbed()
                .setAuthor(message.guild.name + "'s Emojis", message.guild.iconURL)
                .addField("Custom Emojis:",message.guild.emojis.map(e => "<:" + e.name  + ":" + e.id + "> ").join(" "))
                .setFooter("Requested by" + message.author.tag)
            ;
            //Checks if there is even any custom emoji for the guild
            if (message.guild.emojis.size == 0) return message.channel.send("This server has no Custom Emojis");
            else message.channel.send(embed);
        break;
        //Gives information about the channel the user is in (Name/ID/Type/etc.)
        case "channel":
            embed = new Discord.RichEmbed()
                .setTitle(message.channel.name + "channel's info")
                .setFooter("Made bye: DMCPlayer#6346")
                .addField("Channel Name:", ` **${message.channel.name}**`)                
                .addField("Channel ID:", ` \`${message.channel.id}\``)
                .addField("Channel type:", `**${message.channel.type}** channel`)
            ;
            message.channel.send(embed);
        break;
        //Gives information about the guild (Icon/Name/MemberCount/Roles Count/Channels Count/ID)
        case "server":  
         embed = new Discord.RichEmbed()
            .setColor("#00ff3f")
            .setAuthor("Server Info", message.guild.iconURL)
            .setThumbnail(message.guild.iconURL)
            .addField("Member Count", `**${message.guild.memberCount}**`, true)
            .addField("Server Name", `  \`${message.guild.name}\`  `, true)
            .addField("Roles Count", message.guild.roles.size, true)
            .addField("Channels", `**${message.guild.channels.size}**`, true )
            .addField("Server ID", `\`${message.guild.id}\``, true)
         ; 
         message.channel.send(embed);
        break;
       //Bot server commands 
       //Bot User's commands
        //Displayes message.author's information (Tag/Username/Avatar/ID/etc.)
        case "profile":
            embed = new Discord.RichEmbed()
                .setTitle(`${message.author.username} 's profile`)
                .setThumbnail(message.author.avatarURL)
                .setFooter("Made by:" + " DMCPlayer#6346")
                .addField("Username", `** ${message.author.username}**`, true)
                .addField("Tag", message.author.tag, true)
                .addField("Last message", message.author.lastMessage, true)
                .addField("User ID", message.author.id, true)
            message.channel.send(embed)    
        break;
       //Bot User's commands
       //Bot Moderation commands
        //Creates a textchannel with a name of user's prefrence
        case "textch":
            if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS")) return message.channel.send("**Bot doesn't have** `MANAGE_CHANNELS` **permission**");
            if (!message.guild.member(message.author).hasPermission("MANAGE_CHANNELS")) return message.channel.send("**Sorry, you don't have the required (`MANAGE_CHANNELS`) permission**");
            if (!args[1]) return "**Usage**: ---textch `<name>`";    
            if (args[2] !== "text") {
            message.guild.createChannel(args[1], "text");
            var embed = new Discord.RichEmbed()
                .addField("Discord channel created", "Name: **" + args[1] + "**\nType: `text`")
            ;
            message.channel.send(embed);

            } else if (args[2] !=="text" || args[2] !== "voice"){
                return message.channel.send("**Usage**: ---textch `<name>`");
            }   
        break;
        //Creates a voicechannel with a name of user's prefrence
        case "voicech":
            //Searches if the bot itself has the permission to manage channels
            if (!message.guild.member(client.user).hasPermission("MANAGE_CHANNELS")) return message.channel.send("**Bot doesn't have** `MANAGE_CHANNELS` **permission**");
            //Check's if the message excuter has the permission to Manage chanels
            if (!message.guild.member(message.author).hasPermission("MANAGE_CHANNELS")) return message.channel.send("**Sorry, you don't have the required (`MANAGE_CHANNELS`) permission**");
            //If the name isn't specified, it returns Usage
            if (!args[1]) return message.channel.send("**Usage**: ---voicech `<name>`");    
            if (args[2] !== "text") {
            message.guild.createChannel(args[1], "voice");
            var embed = new Discord.RichEmbed()
                .addField("Discord channel created", "**-**Name: **" + args[1] + "**\n**-**Type: `voice`")
                .setThumbnail(message.guild.icon)
            ;
            message.channel.send(embed);
   
            } else if (args[2] !=="text" || args[2] !== "voice"){
                return message.channel.send("**Usage**: ---voicech `<name>`");
            }   
        break;
       //Bot Moderation commands
       //Bot rp commands
        case "cry":
            message.channel.send(`**Aww nuu! <@${message.author.id}> is crying  :cry: **`);
        break;
        case "hate":
            if (!args[1]) return message.channel.send(`**Please mention someone for that**  :x:`);
            else message.channel.send(`**OwO <@${message.author.id}> hates ${args[1]} , wonder why? :thinking**`);
        break;
        case "hug":
            if (!args[1]) return message.channel.send(`**Please mention someone for that**  :x:`);       
            else message.channel.send(`**Aww, <@${message.author.id}> hugged ${args[1]}**  :hugging:`);
        break;
        case "kill":
            if (!args[1]) return message.channel.send(`**Please mention someone for that**  :x:`);        
            else message.channel.send(`**MURDER! <@${message.author.id}> killed ${args[1]} :dagger:**`);
        break;
        case "kiss":
            if (!args[1]) return message.channel.send(`**Please mention someone for that**  :x:`);              
            else message.channel.send(`**Ewwww! <@${message.author.id}> kissed ${args[1]}  :kiss:**`);
        break;
        case "love":
            if (!args[1]) return message.channel.send(`**Please mention someone for that**  :x:`);                
            else message.channel.send(`**I smell love, <@${message.author.id} loves ${args[1]}**`);
        break;
        case "marry":
            if (!args[1]) return message.channel.send(`**Please mention someone for that**  :x:`);        
            else message.channel.send(`:open_mouth: **<@${message.author.id}> is now married to ${args[1]}**`);
        break;
        case "propose":
            if (!args[1]) return message.channel.send(`**Please mention someone for that**  :x:`);                
            else message.channel.send(`**Owww, <@${message.author.id}> proposed to ${args[1]}!**  :wedding: `)
        break;
        case "sad":
            message.channel.send(`**Ow, <@${message.author.id}> is now sad**  :frowning:`)
        break;
        case "slap":
            if (!args[1]) return message.channel.send(`**Please mention someone for that**  :x:`);        
            message.channel.send(`**Daaang! <@${message.author.id}> slapped ${args[1]} hard**  :wave:`)
        break;
        case "stab":
            if (!args[1]) return message.channel.send(`**Please mention someone for that**  :x:`);               
            else message.channel.send(`**Wow! <@${message.author.id}> stabbed ${args[1]}, R.I.P**`)
        break;
       //Bot rp commands
       //Bot image commands
        case "kitten":
        case "cat":
        case "koneko":
            var koneko = [
                "https://i.imgur.com/4clqUdj.jpg",
                "https://i.imgur.com/0tz6L9K.jpg",
                "https://i.imgur.com/mJziGsl.jpg",
                "https://i.imgur.com/KJzNSmO.jpg",
                "https://i.imgur.com/b7r1f.jpg",
                "https://i.imgur.com/JDfqNH0.jpg",
                "https://i.imgur.com/QClRneF.jpg",
                "https://i.imgur.com/4AzaxsJ.gif",
                "https://i.imgur.com/NkjDdrP.gif",
                "https://i.imgur.com/5ndRgyy.jpg",
                "https://i.imgur.com/7wq0Ogz.jpg",
                "https://i.imgur.com/RYsFl6b.jpg",
                "https://i.imgur.com/8LrBy9k.gif",
                "https://i.imgur.com/asrFi81.jpg",
                "https://i.imgur.com/HNWRnQV.jpg",
                "https://i.imgur.com/UjM4XLE.gif",
                "https://i.imgur.com/TpxFUXB.gif",
                "https://i.imgur.com/kFLw1vC.jpg",
                "https://i.imgur.com/rUerwj9.gif",
                "https://i.imgur.com/sKL0BKs.gif",
                "https://i.imgur.com/OfVBvJt.gif",
                "https://i.imgur.com/WmjFrRa.jpg",
                "https://i.imgur.com/Ab4AUEX.jpg",
                "https://i.imgur.com/FkhdK1l.jpg",
                "https://i.imgur.com/qegSC9u.jpg",
                "https://i.imgur.com/PVuy0rI.jpg",
                "https://i.imgur.com/YL92xGf.jpg",
                "https://i.imgur.com/WGi7exB.jpg",
                "https://i.imgur.com/VPep5Lv.jpg",
                "https://i.imgur.com/gHnH5J2.jpg",
                "https://i.imgur.com/w7vLy4K.gif",
                "https://i.imgur.com/mtvkIkl.jpg",
                "https://i.imgur.com/JzUNHVo.jpg",
                "https://i.imgur.com/awDWWzu.jpg",
                "https://i.imgur.com/ViGUhUB.jpg",
                "https://i.imgur.com/2a10XYt.jpg",
                "https://i.imgur.com/HDfIWbn.jpg",
                "https://i.imgur.com/krhnAyC.jpg",
                "https://i.imgur.com/VyqKC6q.jpg",
                "https://i.imgur.com/HWJssMH.jpg",
                "https://i.imgur.com/paqfFLJ.jpg"
            ];
            embed = new Discord.RichEmbed()
                .setTitle("**Cute kitties!**")
                .setDescription("Have some cute kitties <@" + message.author.id + ">")
                .setImage(koneko[Math.floor(Math.random() * koneko.length)]) 
                .setFooter("Powered by: imgur.com")
            ;
           message.channel.send(embed);
           break;
        case "puppy":    
        case "dog":
        case "papi-":
            var papi = [
                "https://i.imgur.com/IxX0Vbe.jpg",
                "https://i.imgur.com/GFTKyyj.jpg",
                "https://i.imgur.com/malK0pj.jpg",
                "https://i.imgur.com/EnF9duK.jpg",
                "https://i.imgur.com/75Jr3.jpg",
                "https://i.imgur.com/szes5n4.jpg",
                "https://i.imgur.com/e0RLfC0.jpg",
                "https://i.imgur.com/jjC15yO.jpg",
                "https://i.imgur.com/fW6Tmnx.jpg",
                "https://i.imgur.com/8IEhgdr.jpg",
                "https://i.imgur.com/tNIYUrj.jpg",
                "https://i.imgur.com/IRvKZ9B.jpg",
                "https://i.imgur.com/DZdlc6j.jpg",
                "https://i.imgur.com/agrL4ts.jpg",
                "https://i.imgur.com/R7odcZQ.jpg",
                "https://i.imgur.com/BTTcR8G.jpg",
                "https://i.imgur.com/AQT4GPl.jpg",
                "https://i.imgur.com/r4Gus4b.jpg",
                "https://i.imgur.com/XVoz4On.jpg",
                "https://i.imgur.com/GHSu19w.jpg",
                "https://i.imgur.com/Nkf2MaB.jpg"
            ];
   
            embed = new Discord.RichEmbed()
                .setTitle("**Puppies!!**")
                .setDescription("Have some cute puppies <@" + message.author.id + ">")
                .setImage(papi[Math.floor(Math.random() * papi.length)])
                .setFooter("Powered by: imgur.com")
            ;

         message.channel.send(embed);
        break;
        case "spooky":
            var spooky = [
                "https://i.imgur.com/kEUl298.jpg",
                "https://i.imgur.com/CJMlDnf.jpg",
                "https://i.imgur.com/FhdQzkx.jpg",
                "https://i.imgur.com/Xy8lk74.jpg",
                "https://i.imgur.com/9k1FtXx.jpg",
                "https://i.imgur.com/gXirW0L.jpg",
                "https://i.imgur.com/zgILZ1i.jpg",
                "https://i.imgur.com/NQBjsce.jpg",
                "https://i.imgur.com/Kp1fFv9.gif",
                "https://i.imgur.com/9Q7fbWc.gif",
                "https://i.imgur.com/Xj4OOVl.gif",
                "https://i.imgur.com/tSpPQFS.jpg?1",
                "https://i.imgur.com/1oMdgHJ.gif",
           ];
           embed = new Discord.RichEmbed()
                .setTitle("Spooky! :ghost:")
                .setDescription("This looks spoooky! <@" + message.author.id + ">")
                .setImage(spooky[Math.floor(Math.random() * spooky.length)])
                .setFooter("Powered by: imgur.com")
            ;
            message.channel.send(embed);
        break;
        case "psycho":
           var psycho = [
               "http://s3.narvii.com/image/q6pmhaulolzjzpmzrmg5o3cfjecxwwsx_hq.jpg",
               "https://i.ytimg.com/vi/YgcuYoUqUFo/maxresdefault.jpg",
               "http://pm1.narvii.com/5619/1a5c607354acf11721901120c6bf1f2c5cba1901_hq.jpg",
               "http://pm1.narvii.com/5763/ebdb014e3dd98b82a695b0736d845a449df80383_hq.jpg",
               "http://pm1.narvii.com/5703/29fb3751005758227472ec474d022a11f290473b_hq.jpg",
               "https://i.pinimg.com/736x/90/91/e5/9091e5ff571ac510eceee9b415a05de5--anime-uniform-dark-anime.jpg",
               "http://data.whicdn.com/images/179059733/large.jpg",
               "http://img3.wikia.nocookie.net/__cb20140410151038/kingdomhearts3dddd/images/a/a0/Creepypasta-creepypasta-35541942-500-517.gif",
               "https://cdn169.picsart.com/221944635018202.jpg?r1024x1024",
               "https://static.zerochan.net/Katsura.Kotonoha.full.772543.jpg",
           ];
   
           embed = new Discord.RichEmbed()
               .setTitle("Someone here is a psycho :eyes: :dagger:")
               .setDescription("Hello, wanna play a game?")
               .setImage(psycho[Math.floor(Math.random() * psycho.length)])
            ;
         message.channel.send(embed);
        break; 
       //Bot image commands
       //Bot Ticket commands
        case "bug":
            const bugp = config.prefix+"bug";
            const bugargs = message.content.substring(bugp.length).split(" ");
            const bug = bugargs.join(" ");

            embed = new Discord.RichEmbed()
                .setColor("#08a800")
                .addField(`Bug Report # ${message.id}`, `**-**User:\`${message.author.tag}\`\n**-**UserID: \`${message.author.id}\`\n**-**Message ID: ${message.id}\n**-**Bug Info: ** ${bug}**\n---------------------------------------------------------------------------------------------`)
                .addField("Side Information", `**-**Guild: **${message.guild.name}**\n**-**Sent on: \`${message.createdAt}\`\n**-**Channel: **${message.channel.name}**\n**-**Nickname: \`${message.member.nickname}\``)
                .setAuthor(message.author.tag, message.author.avatarURL)
            ;
            var sideinfo = new Discord.RichEmbed()
                .setColor("#d17600")
            ;
         if (!bug.includes(args[1])) message.channel.send("Usage: **---bug** `<message>`");

         else {
            client.guilds.find("name", "Game Talk").channels.find("name", "bugs").send(embed);
            message.channel.send(`**Bug ticket # \`${message.id}\` Submitted by** <@${message.author.id}> :white_check_mark: `)
         }
        break;
        case "suggest":
            const suggestionp = config.prefix+"suggest";
            const suggestargs = message.content.substring(suggestionp.length).split(" ");
            const suggestion = suggestargs.join(" ");

            var embed = new Discord.RichEmbed()
                .setColor("#08a800")
                .addField("Bot Suggestion", `**-**User:\`${message.author.tag}\`\n**-**UserID: \`${message.author.id}\`\n**-**Message ID: ${message.id}\n**-**Suggestion: **${suggestion}**\n---------------------------------------------------------------------------------------------`)
                .addField("Side Information", `**-**Guild: **${message.guild.name}**\n**-**Sent on: \` ${message.createdAt} \`\n**-**Channel: **${message.channel.name}**\n**-**Nickname:\`${message.member.nickname}\``)
                .setAuthor(message.author.tag, message.author.avatarURL)
            ;
            if (!suggestion.includes(args[1])) message.channel.send("Usage: **---suggest** `<message>`");

            else {
                client.guilds.find("name", "Game Talk").channels.find("name", "suggestions").send(embed);
                message.channel.send(`**Suggestion ticket Submitted by** <@${message.author.id}> :white_check_mark: `)
            }
        break;
        case "solve":
         let solvep = config.prefix+"solve";
         const solveargs = message.content.substring(solvep.length).split(" ");
         const solve = solveargs.join(" ");
         embed = new Discord.RichEmbed()
            .setColor("#2eff00")
            .addField("Bug Issue Solved", "**-**Ticket Status: `" + args[2] + "`\n**-**Answer: **" + sayMessage + "**")
            .setFooter("Ticket Solved")
            .setThumbnail(client.user.avatarURL)
         ;
         if (args[2] !== "Closed") return message.channel.send("Usage: **" + PREFIX + "solve** `<Closed/Solved>` `<answer>`");
         else message.guild.member(args[1]).send(embed);
        break;
       //Bot Ticket commands
       //Bot GitHub commands
        case "github":
        case "repo":
        case "repository":
           message.channel.send(":gear:**Go support my so cool (not really) author on GitHub!:gear:**")
           message.channel.send(":bulb: https://github.com/DMCPlayer/Gamebot :bulb:" ); 
        break;
       //Bot GitHub commands
       //Bot help commands
        case "help":
            let helpc = [
                "#ff1000",
                "#ff4c00",
                "#ffdd00",
                "#15ff00",
                "#00ffe9",
                "#000cff",
                "#ff00e1",
            ]; 
            let help = new Discord.RichEmbed()
            .setColor(helpc[Math.floor(Math.random() * helpc.length)])
            .addField(helps.title, helps.Line)
            .addField("Info Commmands", helps.infoCommands)
            .addField("GitHub", helps.gitHub)
            .addField("Utilities", helps.utilities)
            .addField("Moderation", helps.moderation)
            .addField("Fun", helps.fun)
            .addField("Images", helps.images)
            .addField("Rps", helps.rps)
            .addField("Tickets", helps.tickets)
            .setDescription(`Current prefix: ${config.prefix}`)
            .setFooter("Made by: DMCPlayer#6346");
         message.channel.send(help);
        break;
       //Bot help commands  
    } 
});

client.login(process.env.BOT_TOKEN);

//https://discordapp.com/oauth2/authorize?client_id=365751135086051340&scope=bot&permissions=2146958591
