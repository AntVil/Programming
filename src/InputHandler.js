const readline = require("readline-sync");

class InputHandler {
    constructor() {

    }

    getOptionInput(options) {
        let optionInput;
        do {
            optionInput = readline.questionInt();
        } while (typeof optionInput !== "number" || optionInput > options || optionInput < 1);
        return optionInput;
    }

    getTextInput() {
        let textInput;
        do {
            textInput = readline.question().trim();
        } while (typeof textInput !== "string" || textInput.length <= 0);
        return textInput;
    }

    getNumberInput() {
        let numberInput;
        do {
            numberInput = readline.questionInt();
        } while (typeof numberInput !== "number");
        return numberInput;
    }
}

exports.InputHandler = InputHandler;