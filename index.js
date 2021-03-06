const Discord = require('discord.js'); //discord js
const bot = new Discord.Client(); //bot

bot.commands = new Discord.Collection(); //dynamic commands
bot.minigame_collection = new Discord.Collection(); //minigames commands
const fs = require('fs'); //file stuff
const game_quick_maths = require('./commands/game_quick_maths');
var wordbase;

const cooldowns = new Discord.Collection(); //cooldowns

const MongoClient = require('mongodb').MongoClient; //database
const url = "mongodb+srv://thundofox:vpuvze12@cluster0-qfz6w.mongodb.net/test?retryWrites=true&w=majority";
var mongobase;

//minigame variables
var server_map = new Map();
var minigame_arr = [];

//const token = ; //pokebot_test

const token; //pokebotjj

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
    /*
    message.guild.members.fetch().then(fetchedMembers => {
        //console.log(fetchedMembers);
        totalOnline = fetchedMembers.filter(member => member.user.username == "brianazhang");
        
        console.log(totalOnline);
        // We now have a collection with all online member objects in the totalOnline variable
        //message.channel.send(`There are currently ${totalOnline.size} members online in this guild!`);
    });
    */
    
    /*
    if(!message.author.bot)
    {
        message.channel.send("<@328362904435032066> b-b-b-aka the answer was 23726. Please try again to confirm you are not a bot.")
        message.channel.send({files:["https://cdn.discordapp.com/attachments/732683310773567518/741100406964355145/1591729595796.png"]});
    }
    */
    
    //console.log(message);
    //message.channel.send("<@brianazhang> please enter the numbers to confirm you are not a bot")
    //message.channel.send({files:["https://cdn.discordapp.com/attachments/732683310773567518/741431557801115718/1251755487564.png"]});
    /*
    if(!message.author.bot && message.guild.systemChannelID == 729112234302898259) //testing
    {
        x = bot.minigame_collection.get("trivia"); 
        x.execute(message);
        return;
    }
    */

    let server_id = message.guild.systemChannelID;
    if(!server_map.has(server_id))
    {
        server_map.set(server_id,{answer:"",gamemode:"none",pokemon_name:"",embed:null,message_count:0,caught:false,spawn_time:0,
        trivia_answers:[],disabled_gamemodes:[]});
    }

    let serv_obj = server_map.get(server_id);
    
    if(!message.author.bot && serv_obj.gamemode == "none")
    {
        serv_obj.message_count++;
    }

    if(message.content.startsWith("%ans") && serv_obj.pokemon_name != "" && serv_obj.gamemode != "none" && !serv_obj.caught)
    {
        var response = message.content.split(" ")[1];
        if(serv_obj.gamemode == "trivia")
        {
            if(serv_obj.trivia_answers.includes(message.author))
            {
                return;
            }
            serv_obj.trivia_answers.push(message.author);
        }
        try {
            if(response == serv_obj.answer)
            {
                serv_obj.embed.setTitle(message.author.username + " has caught a " + serv_obj.pokemon_name)
                message.channel.send(serv_obj.embed);
                const add_pokemon = bot.commands.get("add_pokemon");
                add_pokemon.execute(message.author.id,serv_obj.pokemon_name,mongobase);
                serv_obj.caught = true;
                message.channel.send("Seconds left until next pokemon can spawn: " + Math.ceil(15 - (Date.now() - serv_obj.spawn_time)/1000));
            }
        } catch (error) {
            console.log(error);
        }
    }

    if(serv_obj.message_count >= 10 && serv_obj.gamemode == "none")
    {
        const spawn_pokemon = bot.commands.get("spawn_pokemon");
        var random_time = Math.ceil(Math.random()*2500) + 2500; //1-2500 + 2500 //set a random spawn time
        serv_obj.gamemode = minigame_arr[Math.floor(Math.random() * minigame_arr.length)]; //get a random gamemode
        minigame = bot.minigame_collection.get(serv_obj.gamemode); 
        serv_obj.caught = false; //set caught equal to false
        await message.channel.send("INCOMING POKEMON SPAWNING\n" +
                                   "The minigame is ***" + serv_obj.gamemode + "***")
        if(serv_obj.gamemode == 'unscramble the word')
        {
            serv_obj.answer = await minigame.execute(message,wordbase); //get the answer to the minigame
        }
        else
        {
            serv_obj.answer = await minigame.execute(message); //get the answer to the minigame
        }
        console.log(serv_obj.answer);
        setTimeout(async () => {
            try {
                var arr = await spawn_pokemon.execute(message);
                serv_obj.spawn_time = Date.now();
                serv_obj.pokemon_name = arr[0];
                serv_obj.embed = arr[1];
                setTimeout(async () => {
                    if(!serv_obj.caught)
                    {
                        message.channel.send("Time is up the answer was " + serv_obj.answer);
                        serv_obj.embed.setTitle(serv_obj.pokemon_name + " peaced out");
                        message.channel.send(serv_obj.embed);
                    }
                    serv_obj.message_count = 0; //reset message count
                    serv_obj.gamemode = "none";
                    serv_obj.caught = false;
                    serv_obj.trivia_answers = [];
                    serv_obj.pokemon_name = "";
                }, 15000)
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
        command.execute(message, args, mongobase);
	} catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command!');
    }
    
}
);

bot.login(token);
