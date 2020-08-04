
class BimgoRow {

    constructor(letter, min, max, inputs, activeNumberFunction, passiveNumberFunction) {
        this.passiveNumberFunction = passiveNumberFunction;
        this.activeNumberFunction = activeNumberFunction;
        this.letter = letter;
        this.inputs = inputs;
        this.numbers = [];
        this.min = min;
        this.max = max;
    }

    belongsTo(number) {
        return this.min <= number && number <= this.max;
    }

    push(number) {
        this.numbers.push(number);
        const input = this.inputs[number];
        this.activeNumberFunction(input);
    }

    getBingoNumber(number) {
        return this.letter + number;
    }

    reset() {
        this.numbers = [];

        for (const key in this.inputs) {
            if (!this.inputs.hasOwnProperty(key)) {
                continue;
            } else {
                this.passiveNumberFunction(this.inputs[key]);
            }
        }
    }

    getNumbers() {
        return this.numbers;
    }

}


class Bingo {

    constructor(
            inputsB, inputsI, inputsN, inputsG, inputsO, //inputs
            activeNumberFunction, passiveNumberFunction, //functions
            outputLetter, outputNumber1, outputNumber2) { //outputs

        this.onFinishAnimation = this.onFinishAnimation.bind(this);
        this.cookie = new CookieManager();
        this.rows = [
            new BimgoRow("B", 1, 15, inputsB, activeNumberFunction, passiveNumberFunction),
            new BimgoRow("I", 16, 30, inputsI, activeNumberFunction, passiveNumberFunction),
            new BimgoRow("N", 31, 45, inputsN, activeNumberFunction, passiveNumberFunction),
            new BimgoRow("G", 46, 60, inputsG, activeNumberFunction, passiveNumberFunction),
            new BimgoRow("O", 61, 75, inputsO, activeNumberFunction, passiveNumberFunction)
        ];
        this.rolling = false;
        this.currentNumber;
        this.currentRow;
        this.max = 75;
        this.min = 1;

        this.numbers = [];
        for (var i = 1; i < this.max + 1; i++) {
            this.numbers.push(i);
        }

        this.rollAnimation = new RollAnimation(
                outputLetter,
                outputNumber1,
                outputNumber2,
                ["B", "I", "N", "G", "O"],
                ["0", "1", "2", "3", "4", "5", "6", "7"],
                ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
                "start",
                "continue1",
                "continue2",
                "end",
                this.onFinishAnimation
                );
    }

    preload(numbers) {
        for (let i = 0; i < numbers.length; i++) {
            for (let j = 0; j < this.rows.length; j++) {
                if (this.rows[j].belongsTo(numbers[i])) {
                    this.rows[j].push(numbers[i]);
                    break;
                }
            }
        }
    }

    reset() {
        if (!this.rolling) {
            this.numbers = [];
            for (var i = 1; i < this.max + 1; i++) {
                this.numbers.push(i);
            }
            for (var i = 0; i < this.rows.length; i++) {
                this.rows[i].reset();
            }
        }
    }

    getRandomNumber(max) {
        return  Math.floor(Math.random() * (max));
    }

    getNewNumber() {
        const randomIndex = this.getRandomNumber(this.numbers.length);
        const randomNumber = this.numbers[randomIndex];
        this.numbers.splice(randomIndex, 1);
        return randomNumber;
    }

    addNumberToBingoRow(number) {
        let bingoNumber;
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i].belongsTo(number)) {
                this.currentRow = this.rows[i];
                bingoNumber = this.currentRow.getBingoNumber(number);
                break;
            }
        }
        if (bingoNumber.length == 2) {
            const letter = bingoNumber.charAt(0);
            const number2 = bingoNumber.charAt(1);
            bingoNumber = letter + "0" + number2;
        }
        return bingoNumber;
    }

    onFinishAnimation() {
        this.currentRow.push(this.currentNumber);
        this.save();
        this.rolling = false;
    }

    roll() {
        if (this.numbers.length > 0 && !this.rolling) {
            this.rolling = true;
            this.currentNumber = this.getNewNumber();
            const bingoNumber = this.addNumberToBingoRow(this.currentNumber);
            this.rollAnimation.ejecute(bingoNumber);
        }
    }

    save() {
        const numbers = this.rows[0].getNumbers()
                .concat(this.rows[1].getNumbers())
                .concat(this.rows[2].getNumbers())
                .concat(this.rows[3].getNumbers())
                .concat(this.rows[4].getNumbers());
        const numbersJson = JSON.stringify(numbers);

        this.cookie.Create("bingo", numbersJson);
    }
}

