const Discord = require('discord.js'); //discord js
const bot = new Discord.Client(); //bot

bot.commands = new Discord.Collection(); //dynamic commands
bot.minigame_collection = new Discord.Collection(); //minigames commands
const fs = require('fs'); //file stuff
var wordbase;

const cooldowns = new Discord.Collection(); //cooldowns

const MongoClient = require('mongodb').MongoClient; //database
const url = "mongodb+srv://thundofox:vpuvze12@cluster0-qfz6w.mongodb.net/test?retryWrites=true&w=majority";
var mongobase;

//minigame variables
var server_map = new Map();
var minigame_arr = [];

//const token = 'NzI5MTExOTU3MjEwMTM2NzE4.XwFtBA.b3Zk8y2ZlB-lJ7Mw9Y-AZDdloSM'; //pokebot_test

const token = 'NzMyMjkzMTE2OTQxMzAzODg5.Xw3uqg.TJknJCy-qF79N0OPEVKy0EP7Beg'; //pokebotjj2

const PREFIX = '%'; //command prefix

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js')); //dynamic commands

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}

const gameFiles = fs.readdirSync('./commands').filter(file => file.startsWith('game')); //minigames

for (const file of gameFiles) {
    const minigame = require(`./commands/${file}`);
    minigame_arr.push(minigame.description)
    bot.minigame_collection.set(minigame.description, minigame);
}

bot.on('ready', async () => {
    try{
        mongobase = await MongoClient.connect(url);
        fs.readFile('text.txt', 'utf8', function(err, data) {
            wordbase = data.split("\n");
        })
    }
    catch (err) {
        console.log(err);
    }
    console.log("BOOOM POKEBOTJJ2 IS ON")
});

bot.on('message', async message => {
    let server_id = message.guild.systemChannelID;
    if(!server_map.has(server_id))
    {
        server_map.set(server_id,{answer:"",gamemode:"none",pokemon_name:"",embed:null,message_count:0});
    }

    let serv_obj = server_map.get(server_id);
    
    if(!message.author.bot && serv_obj.gamemode == "none")
    {
        serv_obj.message_count++;
    }

    if(message.content.startsWith("%ans") && serv_obj.gamemode != "none" && serv_obj.message_count != 0)
    {
        var response = message.content.split(" ")[1];
        try {
            if(response == serv_obj.answer)
            {
                serv_obj.embed.setTitle(message.author.username + " has caught a " + serv_obj.pokemon_name)
                message.channel.send(serv_obj.embed);
                serv_obj.message_count = 0;
                serv_obj.gamemode = "none";
                const add_pokemon = bot.commands.get("add_pokemon");
                add_pokemon.execute(message.author.id,serv_obj.pokemon_name,mongobase);
            }
        } catch (error) {
            console.log(error);
        }
    }

    if(serv_obj.message_count >= 10 && serv_obj.gamemode == "none")
    {
        const spawn_pokemon = bot.commands.get("spawn_pokemon");
        var random_time = Math.ceil(Math.random()*2500) + 2500; //1-2500 + 2500 //set a random spawn time
        message.channel.send("INCOMING POKEMON SPAWNING");
        serv_obj.gamemode = minigame_arr[Math.floor(Math.random() * minigame_arr.length)]; //get a random gamemode
        minigame = bot.minigame_collection.get(serv_obj.gamemode); 
        await message.channel.send("The minigame is ***" + serv_obj.gamemode + "***")
        setTimeout(async () => {
            try {;
                var arr = await spawn_pokemon.execute(message);
                serv_obj.pokemon_name = arr[0];
                serv_obj.embed = arr[1];
                if(serv_obj.gamemode == 'unscramble the word')
                {
                    serv_obj.answer = await minigame.execute(message,wordbase); //get the answer to the minigame
                }
                else
                {
                    serv_obj.answer = await minigame.execute(); //get the answer to the minigame
                }
                console.log(serv_obj.answer);
                setTimeout(async () => {
                    if(!serv_obj.message_count == 0)
                    {
                        serv_obj.embed.setTitle("Time is up " + serv_obj.pokemon_name + " peaced out");
                        message.channel.send(serv_obj.embed);
                        serv_obj.message_count = 0; //reset message count
                        serv_obj.gamemode = "none";
                    }
                }, 30000)
            } catch (error) {
                console.log(error);
            }
        }, random_time)
    }
    
    if(!message.content.startsWith(PREFIX))
    {
        return;
    }

    let args = message.content.slice(PREFIX.length).split(" "); 

    const commandName = args[0];

    if (!bot.commands.has(commandName)) return;

	const command = bot.commands.get(commandName);

    if (!cooldowns.has(command.name)) { //cooldowns
        cooldowns.set(command.name, new Discord.Collection());
    }
    
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    
    if (timestamps.has(message.author.id)) {
        //const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        return;
        /*
	    if (now < expirationTime) {
		    const timeLeft = (expirationTime - now) / 1000;
		    return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
        */
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        //console.log(command.finished);
        if(command.finished === 0)
        {
            return;
        }
        else
        {
            command.execute(message, args, mongobase);
        }
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
    }
    
}
);

bot.login(token);
