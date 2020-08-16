module.exports = {
	name: 'pd',
    description: 'check pokedex',
	async execute(message, args, mongobase) {
        user = message.author.id;
        page = "Page 1 \n";
        var dbo = mongobase.db("pokebotjj2");
        var myquery = { Trainer_Id:user };
        var result = await dbo.collection("Trainers").find(myquery).toArray();

        if(result.length === 0)
        {
           message.channel.send("You have not caught any pokemon yet " + "<@" + message.author + ">");
           return;
        }

        counter = 0;

        var pages = [];

        var rarity = "";

        let collection = result[0].Pokemon_Collection;

        if(args.length == 2)  
        {
            if(!(args[1] >= 1 && args[1] <= 5))
            {
                message.channel.send("Error please use correct parameters")
                return
            }
            else
            {
                collection = collection.filter(poke => poke.Tier == Number(args[1]));
                rarity = "(Tier " + args[1] + ")"
            }
        }

        message.channel.send(message.author.username + "'s Pokedex " + rarity)

        collection.forEach(element => {
            if(element.Pokedex_Number >= 1 && element.Pokedex_Number <= 9)
            {
                element.Pokedex_Number += 1000;
            }
            emo = message.client.emojis.cache.find(emoji => emoji.name === element.Pokedex_Number.toString());
            page += emo.toString() + element.Pokemon_Name //+ " | " + element.Id + " | " + " Lv." + element.Level;
            page += '\n';
            counter++;
            if(counter == 10)
            {
               counter  = 0;
               pages.push(page);
               page = "Page " + (pages.length+1) + '\n';
            }
        })
        if(pages.length != (collection.length/10 + 1))
        {
           pages.push(page);
        }

        current = 0;

        let pokedex = await message.channel.send(pages[current]);
        await pokedex.react('⬅️');
        await pokedex.react('➡️');
    
        const filter = (reaction, user) => {
            return reaction.emoji.name === '➡️' || reaction.emoji.name === '⬅️';
        };
        
        const collector = pokedex.createReactionCollector(filter, {time: 15000});
    
        collector.on('collect', async (reaction, user) => {
            if(!user.bot)
            {
                if(reaction.emoji.name === '➡️')
                {
                    current++;
                    if(current >= pages.length)
                    {
                        current = 0;
                    }
                }
                else
                {
                    current--;
                    if(current < 1)
                    {
                        current = pages.length - 1;
                    }
                }
                await pokedex.edit(pages[current]);
            }
        });
	},
};