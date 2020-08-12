module.exports = {
    name: 'game_quick_maths',
	description: 'quick mafs',
	async execute(message) {
        let left = 0;
        let right = 0;
        let symbols = ['-','+','x'];
        let n = symbols.length;
        for(var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = symbols[i];
            symbols[i] = symbols[j];
            symbols[j] = tmp;
        }
        let numbers = [0,0,0,0];
        for(var i = 0; i < numbers.length; i++) {
            numbers[i] = Math.floor(Math.random() * 20) + 1; //0-19 + 1
        }
        switch(symbols[0]) //calc left
        {
            case '-':
                left = numbers[0] - numbers[1];
                break;
            case '+':
                left = numbers[0] + numbers[1];
                break;
            case 'x':
                left = numbers[0] * numbers[1];
                break;
        }
        switch(symbols[2]) //calc right
        {
            case '-':
                right = numbers[2] - numbers[3];
                break;
            case '+':
                right = numbers[2] + numbers[3];
                break;
            case 'x':
                right = numbers[2] * numbers[3];
                break;
        }
        switch(symbols[1]) //combine sides
        {
            case '-':
                answer = left - right;
                break;
            case '+':
                answer = left + right;
                break;
            case 'x':
                answer = left * right;
                break;
        }
        let msg = `(${numbers[0]} ${symbols[0]} ${numbers[1]}) ${symbols[1]} (${numbers[2]} ${symbols[2]} ${numbers[3]})`;
        await message.channel.send(msg);
        return answer;
	},
};