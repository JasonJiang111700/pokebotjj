module.exports = {
    name: 'game_scramble',
	description: 'unscramble the word',
	async execute(msg,wordbase) {
        var index = Math.floor(Math.random() * wordbase.length); //select a random word from the array
        var original = wordbase[index];
        var shuffle = wordbase[index].split("");
        let n = shuffle.length;
        for(var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = shuffle[i];
            shuffle[i] = shuffle[j];
            shuffle[j] = tmp;
        }
        await msg.channel.send("Unscramble: " + shuffle.join(""));
        return original;
	},
};