module.exports = {
    name: 'game_guess_number',
	description: 'guess the number',
	async execute(message) {
        var random_number = Math.floor(Math.random() * 25) + 1 //0-19 + 1
        await message.channel.send("Guess a number between 1 and 25");
        return random_number;
	},
};