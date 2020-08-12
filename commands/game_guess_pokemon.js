const Discord = require('discord.js'); //discord js
var Pokedex = require('pokedex-promise-v2'); //pokedex
var P = new Pokedex();

module.exports = {
    name: 'game_quick_maths',
	description: "who's that pokemon",
	async execute(message) {
        var random_number = Math.floor(Math.random() * 493) + 1 //0-24 + 1
        var response = await P.getPokemonByName(random_number);
        var poke_name = response.name
        var no_dash = poke_name.split("-");
        no_dash = no_dash.join("");
        var embed = new Discord.MessageEmbed()
                            .setTitle(`Who am I?`)
                            .setImage(`https://play.pokemonshowdown.com/sprites/xyani/${no_dash}.gif`);
        await message.channel.send(embed);
        return poke_name;
	},
};