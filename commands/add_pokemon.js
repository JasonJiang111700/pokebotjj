var Pokedex = require('pokedex-promise-v2'); //pokedex
var P = new Pokedex();

module.exports = {
    name: 'add_pokemon',
	description: 'add_pokemon',
	async execute(trainer_id,pokemon_name,mongobase) {
		try {
			response = await P.getPokemonByName(pokemon_name); //check pokemon
			poke_name = response.name
			poke_num = response.id
			var dbo = mongobase.db("pokebotjj2");  
			var myquery = { Trainer_Id:trainer_id };
			var result = await dbo.collection("Trainers").find(myquery).toArray(); //check if new user
			if(result.length === 0)
			{
				var obj ={Trainer_Id:trainer_id,Pokemon_Collection:[]};
				await dbo.collection("Trainers").insertOne(obj, function(err, res) {
					if (err) throw err;
				});
			}
			var new_values = {$push: {Pokemon_Collection: {Pokemon_Name:poke_name, Pokedex_Number:poke_num}}};
			await dbo.collection("Trainers").updateOne(myquery, new_values);
		} catch (error) {
			console.log(error);
		}
	},
};