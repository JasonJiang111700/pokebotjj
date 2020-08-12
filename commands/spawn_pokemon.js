const Discord = require('discord.js'); //discord js

var Pokedex = require('pokedex-promise-v2'); //pokedex
var P = new Pokedex();

gen1_tier1 = [10,13,16,19,21,23,27,29,32,41,43,46,48,50,52,54,56,58,60,63,66,69,72,74,86,88,90,98,100,102,104,109,118,129];
gen1_tier2 = [1,4,7,11,14,17,20,22,24,25,28,30,33,35,37,39,42,44,61,67,70,75,77,79,81,84,91,92,95,96,108,111,114,116,119,120,132,133,138,140,147];
gen1_tier3 = [2,5,8,12,15,18,26,36,38,40,45,47,49,51,53,55,57,59,64,73,78,80,82,83,85,87,89,93,97,99,101,103,105,106,107,110,112,113,115,117,121,122,123,124,125,126,127,128,134,135,136,137,148]; 
gen1_tier4 = [3,6,9,31,34,62,65,68,71,76,94,130,131,139,141,142,143,149]; 
gen1_tier5 = [144,145,146,150,151]; 

gen2_tier1 = [161,163,165,167,172,173,174,179,187,194,198,204,206,209,218,220,223];
gen2_tier2 = [152,155,158,162,166,168,170,175,177,180,183,188,190,191,193,200,201,203,207,211,215,216,219,222,225,228,231,234,235,236,238,239,240,246];
gen2_tier3 = [153,156,159,164,171,176,178,186,189,192,195,196,197,202,210,213,217,221,224,226,227,229,232,233,237,241,247]
gen2_tier4 = [154,157,160,169,181,182,184,185,199,205,208,212,214,230,242,248];
gen2_tier5 = [243,244,245,249,250,251];

tier1 = gen1_tier1.concat(gen2_tier1);
tier2 = gen1_tier2.concat(gen2_tier2);
tier3 = gen1_tier3.concat(gen2_tier3);
tier4 = gen1_tier4.concat(gen2_tier4);
tier5 = gen1_tier5.concat(gen2_tier5);

Matrix = [tier1,tier2,tier3,tier4,tier5];
//probability = [50,30,14,5,1]; 

module.exports = {
    name: 'spawn_pokemon',
	description: 'spawn_pokemon',
	async execute(message) {
        var random_pokemon;
        var color;
        var random_num = Math.floor(Math.random()*100) + 1; //0-99 + 1
        if(random_num <= 50)
        {
            random_pokemon = Matrix[0][Math.floor(Math.random() * Matrix[0].length)]; //green
            color = 3066993;
        }
        else if(random_num > 50 && random_num <= 80)
        {
            random_pokemon = Matrix[1][Math.floor(Math.random() * Matrix[1].length)]; //lum pink
            color = 16580705
        }
        else if(random_num > 80 && random_num <= 94)
        {
            random_pokemon = Matrix[2][Math.floor(Math.random() * Matrix[2].length)]; //blue
            color = 3447003;
        }
        else if(random_num > 95 && random_num <= 99)
        {
            random_pokemon = Matrix[3][Math.floor(Math.random() * Matrix[3].length)]; //dark purple
            color = 7419530
        }
        else
        {
            random_pokemon = Matrix[4][Math.floor(Math.random() * Matrix[4].length)]; //orange
            color = 15105570
        }
        //console.log(random_num);
        //console.log(color);
        var no_dash = poke_name.split("-");
        no_dash = poke_name.join("");
        try {
            var response = await P.getPokemonByName(random_pokemon);
            var poke_name = response.name
            var embed = new Discord.MessageEmbed()
                            .setTitle(`A wild ${poke_name} has appeared`)
                            .setImage(`https://play.pokemonshowdown.com/sprites/xyani/${no_dash}.gif`)
                            .setColor(color);
            await message.channel.send(embed);
            return [poke_name,embed];
        } catch (error) {
            console.log(error);
        }
	},
};