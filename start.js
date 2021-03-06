/*
* MIT License
*
* Copyright (c) 2017-2018 DMCPlayer
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

//Load the discord.js library
const Discord = require("discord.js");
const dbl = require("discord-bot-list");
//Client = bot 
const client = new Discord.Client();

//Load the config file
const config = require("./config.json");
//config.token for bot's token
//config.prefix for bot's prefixes

const package = require("./package.json");
//Searches for the package file including info about the bot
//package.version = bot's vertions
//package.name = bot's name
//package.author = bot's author's name
var helps = require("./help.json");

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
    let GuildAdded = new Discord.RichEmbed()
        .setColor("#1cd104")
        .setAuthor("Bot Added to new guild", guild.iconURL, guild.iconURL)
        .addField("Guild Info", `**-__Name__:** ${guild.name}
        \n**-__ID__:** ${guild.id}
        \n**-__Owner__:** ${guild.owner.user.tag}
        \n**-__OwnerID__:** ${guild.ownerID}
        \n**-__Member Count__:** ${guild.memberCount}
        \n**-__Role Count__:** ${guild.roles.size}
        \n**-__Channel Count__:** ${guild.channels.size}
        \n**-__Region__:** ${guild.region}
        \n**-__Roles__:**\n${guild.roles.map(r => `\`${r.name}\``).join(" **|** ")}
        \n**__Verification level__:** ${guild.verificationLevel}`)
        .setFooter(`Guild created: ${guild.createdAt}` , guild.iconURL)
    ;
    client.guilds.find("name", "Game Talk").channels.find("name", "botguilds").send(GuildAdded);
    
});

client.on("guildDelete", guild => {
    //This event is triggered when the bot is removed from a guild.
    console.log(`Bot has been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setPresence({
        game: {
            name: `${config.prefix}help | Serving ${client.guilds.size} servers`,
        }
    });
    let GuildRemoved = new Discord.RichEmbed()
        .setColor("#c60000")
        .setAuthor("Bot Removed from guild", guild.iconURL, guild.iconURL)
        .addField("Guild Info", `**-__Name__:** ${guild.name}
        \n**-__ID__:** ${guild.id}
        \n**-__Owner__:** ${guild.owner.user.tag}
        \n**-__OwnerID__:** ${guild.ownerID}
        \n**-__Member Count__:** ${guild.memberCount}
        \n**-__Role Count__:** ${guild.roles.size}
        \n**-__Channel Count__:** ${guild.channels.size}
        \n**-__Region__:** ${guild.region}
        \n**-__Roles__:**\n${guild.roles.map(r => `\`${r.name}\``).join(" **|** ")}
        \n**__Verification level__:** ${guild.verificationLevel}`)
        .setFooter(`Guild created: ${guild.createdAt}` , guild.iconURL)
    ;
    client.guilds.find("name", "Game Talk").channels.find("name", "botguilds").send(GuildRemoved);   
});

//When a message is sent in Server Channel/Direct Message
client.on("message", function(message) {
    var Usermention;
    var sayMessage;
    var embed;
    const args = message.content.substring(config.prefix.length).split(" ");
    
    //Checks if the message author isn't a bot
    if (message.author.equals(client.user)) return;
    //Checks if the message starts with the prefix
    if (!message.content.startsWith(config.prefix)) return;

    //Checks if the message includes the bot's tag, then replies with something
    if (message.content.includes(`<@${client.user.id}>`)) {
        let responds = [
            'What do you want?',
            'lmao XDDXDXD so funny.',
            'Not that I care.',
            ':neutral_face: ',
            'Sorry, I\'m busy ignoring you.',
            'Booo',
        ];
        message.channel.send(`${responds[Math.floor(Math.random() * responds.length)]}`)
    }
    //Starting the commands right here
    switch(args[0].toLowerCase()) { 
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
           //Boring stuff to set the seconds/minutes/hours/day/bla bla..
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
            return (days+'d '+hours+'h '+minutes+'m '+seconds+'s');
            }
            var time = process.uptime();
            var uptime = (time + "").toHHMMSS();
           //Boring stuff to set the seconds/minutes/hours/day/bla bla..
 
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
                .addField("Upvote the bot in Discord bot list!", "https://discordbots.org/bot/365751135086051340", true)
            ;
            message.channel.send(embed);
        break;
        //Lists the servers the bot is serving
        case "servers":
            if (message.author.id !== "191520413107355648" || client.guilds.size > 100) return;
            else (message.channel.send(client.guilds.map(g => "**-** `" + g.name + "`").join("\n")));            
        break;
        //Just an invite link to my own server. (Join plz, we have cookies! ;D)
        case "invite": 
            message.channel.send("**Want to help the bot?**")
            message.channel.send("**:pizza: Join our server here : https://discord.gg/MYkRtGB** :sparkles:")
        break;
       //Bot Info commands
       //Bot fun commands
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
         //Give a a user some items
         case "give":
            //Defines the user to be given the items
            Usermention = message.mentions.members.first();
            //Defines the items
            let item = message.content.split(" ").splice(3).join(" ");
            //The amount of items to be given
            let number = args[2];
                if (!args[1]) {
                    return message.channel.send(`Usage: ${config.prefix}give \`<@user>\` \`<item>\` \`<amount>\` `)
                }
                if (!Usermention) {
                    return message.channel.send(`**Please mention a user to give the item**`)
                } 
                if (!item) {
                    return message.channel.send(`**Please provide an Item**`)
                }
                if (!number) {
                    return message.channel.send(`**Please provide an amount to give**`)
                } else {
                    message.channel.send(`Given \`${number}\`x **${item}** to ${Usermention}`);
                } 
         break;
       //Bot fun commands
       //Bot Utility commands
        case "avatar":
         Usermention = message.mentions.members.first();
         if (!Usermention) {
            return message.channel.send(`**Please mention a user to get their avatar**`); 
         }
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
            .setAuthor(`${Usermention.user.username}'s avatar`, Usermention.user.avatarURL)
            .setImage(Usermention.user.avatarURL);
         ;
         if (!Usermention) return message.channel.send(`**Please mention a user to get their avatar**`);
         else message.channel.send(embed);
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
            .setColor("#e85500")
            .setAuthor(`${message.guild.name}'s Statistics`, message.guild.iconURL)
            .addField("Server:", message.guild.name)
            .addField("ServerID:", message.guild.id, true)
            .addField("Owner:", message.guild.owner.displayName)
            .addField("OwnerID:", message.guild.ownerID, true)
            .addField("Member Count:", message.guild.members.size)
            .addField("Text/Voice Channels:", message.guild.channels.size, true)
            .addField("Server Region:", message.guild.region)
            .addField("Role Count:", message.guild.roles.size, true)
            .addField("Roles", message.guild.roles.map(r => "`" + r.name + "`").join("**|**"))
            .setFooter(`Created: ${message.guild.createdAt.getUTCDay()}/${message.guild.createdAt.getUTCMonth()}/${message.guild.createdAt.getUTCFullYear()}`)
         ; 
         message.channel.send(embed);
        break;
       //Bot server commands 
       //Bot User's commands
        //Displayes message.author's information (Tag/Username/Avatar/ID/etc.)
        case "profile":
            Usermention = message.mentions.members.first();
            if (!Usermention) {
                let embedown = new Discord.RichEmbed()
                    .addField(`${message.author.username}'s info`, `**-__Tag__:** ${message.author.tag}
                    \n**-__Nickname__:** ${message.guild.member(message.author).nickname}
                    \n**-__Muted__:** ${message.guild.member(message.author).mute}
                    \n**-__Roles__:** ${message.guild.member(message.author).roles.map(r => "`" + r.name + "` **|**")}
                    \n**-__ID__:** ${message.guild.member(message.author).id}
                    \n**-__Status:__** ${message.guild.member(message.author).presence.status}
                    `)
                    .setThumbnail(message.author.avatarURL)
                    .setFooter(`Joined: ${message.guild.member(message.author).joinedAt.getUTCDay()}
                    /${message.guild.member(message.author).joinedAt.getUTCMonth()}
                    /${message.guild.member(message.author).joinedAt.getUTCFullYear()}`)
                ;
                 return message.channel.send(embedown);
                }
            
            else {
                embed = new Discord.RichEmbed()
                    .addField(`${Usermention.user.username}'s info`, `**-__Tag__:** ${Usermention.user.tag}
                    \n**-__Nickname__:** ${message.guild.member(Usermention.user).nickname}
                    \n**-__Muted__:** ${message.guild.member(Usermention.user).mute}
                    \n**-__Roles__:** ${message.guild.member(Usermention.user).roles.map(r => "`" + r.name + "` **|**")}
                    \n**-__ID__:** ${message.guild.member(Usermention.user).id}
                    \n**-__Status:__** ${message.guild.member(Usermention.user).presence.status}
                    `)
                    .setThumbnail(Usermention.user.avatarURL)
                    .setFooter(`Joined: ${message.guild.member(Usermention.user).joinedAt.getUTCDay()}
                    /${message.guild.member(Usermention.user).joinedAt.getUTCMonth()}
                    /${message.guild.member(Usermention.user).joinedAt.getUTCFullYear()}`)
                ;
                message.channel.send(embed); 
            }   
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
            embed = new Discord.RichEmbed()
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
            embed = new Discord.RichEmbed()
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
        case "pat":
            if (!args[1]) return message.channel.send(`**Please mention someone for that**  :x:`);               
            else message.channel.send(`**Aww, <@${message.author.id}> patted ${args[1]}. Who's the good boi?** :hand_splayed:`)
        break;
       //Bot rp commands
       //Bot image commands
        //Cat images
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
        //Puppy images
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
        //Spooky Images
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
        //Psycho images
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
         //Defines the bug prefix
         const bugp = config.prefix+"bug";
         //Mostly useless stuff that can be just done with args.slice(1).join(" ");
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
            //Checks if there is any args
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

            embed = new Discord.RichEmbed()
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
         const solve = solveargs.splice(3).join(" ");
         embed = new Discord.RichEmbed()
            .setColor("#2eff00")
            .addField("Bug Issue Solved", "**-**Ticket Status: `" + args[2] + "`\n**-**Answer: **" + solve + "**")
            .setFooter("Ticket Solved")
            .setThumbnail(client.user.avatarURL)
         ;
         if (args[2] !== "Closed") return message.channel.send("Usage: **" + config.prefix + "solve** `<Closed/Solved>` `<answer>`");
         else {
            message.guild.member(args[1]).send(embed);
            message.channel.send("Ticket solved")
         }
        break;
       //Bot Ticket commands
       //Bot GitHub commands
        case "github":
        case "repo":
        case "repository":
           message.channel.send(":gear:**Go support my so cool (not really) author on GitHub!:gear:**")
           message.channel.send(":bulb: https://github.com/DMCPlayer/Gamebotv1.0.1 :bulb:" ); 
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
                .addField("Games", helps.games)
                .setDescription(`Current prefix: ${config.prefix}`)
                .setFooter("Made by: DMCPlayer#6346")
            ;
          if (args[1] == "minecraft") {
            message.channel.send(`<:minecraft:388990165663612928> **__Minecraft Commands__:** \`mcskin\``)
         } else message.channel.send(help);
        break;
        case "rps":
            embed = new Discord.RichEmbed()
                .addField("All the bot's rp commands", helps.rps)
            ;
            message.channel.send(embed);    
        break;
       //Bot help commands
       //Minecraft
        case "mcskin":
            const url = `https://www.minecraftskinstealer.com/skin.php?u=${args[1]}&s=700`
            embed = new Discord.RichEmbed()
                .setColor("green")
                .setTitle(`<:minecraft:388990165663612928>  ${args[1]}'s Minecraft Skin`)
                .setImage(url)
            ;

            message.channel.send(embed);
        break;
       //Minecraft 
       //Bot Test commands
       //Bot Test commands    
    } 
});

client.login(process.env.BOT_TOKEN);

//https://discordapp.com/oauth2/authorize?client_id=365751135086051340&scope=bot&permissions=2146958591
