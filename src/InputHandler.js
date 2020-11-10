const readline = require('readline-sync');

class InputHandler {
    constructor() {

    }
    getOptionInput(options) {
        let viableNumber = false;
        do {
            const optionInput = readline.questionInt();
            if (typeof optionInput === "number" && optionInput < options && optionInput >= 0) {
                viableNumber = true;
                return optionInput;
            }
        } while (viableNumber != true);

    }

    getTextInput() {
        let viableString = false;
        const textInput = readline.question().trim();
        do {
            if (typeof textInput === "string" && textInput.length > 0) {
                viableString = true;
                return textInput;
            }
        } while (viableString != true);
    }
    getNumberInput() {
        let viableNumber = false;
        do {
            const optionInput = readline.questionInt();
            if (typeof optionInput === "number") {
                viableNumber = true;
                return optionInput;
            }
        } while (viableNumber != true);
    }
}

exports.InputHandler = InputHandler;