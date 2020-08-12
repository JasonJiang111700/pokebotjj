const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://thundofox:vpuvze12@cluster0-qfz6w.mongodb.net/test?retryWrites=true&w=majority";

var Pokedex = require('pokedex-promise-v2'); //pokedex
var P = new Pokedex();

const tier1 = [10,13,16,19,21,23,27,41,63,129]; //tier1 info
const tier2 = [1001,1004,1007,11,14,17,20,22,24,25,30,34,35,37,39,42,44,132,133,138,140,147]; //tier2 info
const tier3 = [1002,1005,1008,12,15,18,26,36,38,40,45,47,49,64,123,125,131,134,135,136,148]; //tier3 info
const tier4 = [1003,1006,1009,31,35,65,126,130,139,142,143,149]; //tier4 info
const tier5 = [144,145,146,150]; //tier5 info
const Matrix = [tier1,tier2,tier3,tier4,tier5];

var Pokedex = require("pokedex-promise-v2")
var P = new Pokedex();

MongoClient.connect(url, async function(err, mongobase) {
  if (err){
    throw err;
  }
  var dbo = mongobase.db("discordbot");

  try {
    all_users = await dbo.collection("Trainers").find({}).toArray();
    for(j = 0; j < all_users.length; j++)
    {
      var result = all_users[j];
      for(i = 0; i < result.Pokemon_Collection.length;i++)
      {
        response = await P.getPokemonByName(result.Pokemon_Collection[i].Pokemon_Name) // with Promise
        //ability_arr = response.abilities;
        //r = Math.floor(Math.random() * ability_arr.length); //random ability
        //console.log(pokemon);
        var newvalues = {$set:{}};
        newvalues.$set[`Pokemon_Collection.${i}.Exp`] = 0;
        //console.log(result.Pokemon_Collection[i].Id);
        var newquery = {Trainer_Id: result.Trainer_Id}//"Pokemon_Collection.0.Id":result.Pokemon_Collection[i].Id}
        new_result = await dbo.collection("Trainers").updateOne(newquery, newvalues);
        //console.log(result);
      }
    }
  } catch (error) {
    console.log(error);
  }

});
