module.exports = {
    name: 'game_guess_number',
	description: 'guess the number',
	async execute() {
        var random_number = Math.floor(Math.random() * 25) + 1 //0-19 + 1
        return random_number;
	},
};