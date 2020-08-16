const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://thundofox:vpuvze12@cluster0-qfz6w.mongodb.net/test?retryWrites=true&w=majority";

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

MongoClient.connect(url, async function(err, mongobase) {
  if (err){
    throw err;
  }
  var dbo = mongobase.db("pokebotjj2");

  try {
    all_users = await dbo.collection("Trainers").find({}).toArray();
    for(i = 0; i < all_users.length;i++)
    {
      let result = all_users[i];
      pokemon = result.Pokemon_Collection;
      for(j = 0; j < pokemon.length; j++)
      {
        for(k = 0; k < 5; k++)
        {
          if(Matrix[k].includes(pokemon[j].Pokedex_Number))
          {
            pokemon[j].Tier = k+1;
            break;
          }
        }
      }
      let newquery = {Trainer_Id: result.Trainer_Id};
      let newvalues = {$set:{}}
      newvalues.$set = result
      await dbo.collection("Trainers").updateOne(newquery, newvalues);
    }
    //console.log(result);
    /*
    for(j = 0; j < all_users.length; j++)
    {
      var result = all_users[j];
      console.log(result);
    }
    */
    /*
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
    */
  } catch (error) {
    console.log(error);
  }

});
