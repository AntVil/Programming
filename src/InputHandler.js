const readline = require('readline-sync');

class InputHander {
    constructor() {

    }
    getOptionInput(options) {
        let viableNumber = false;
        do {
            const optionInput = readline.questionInt();
            if (typeof optionInput === "number" && optionInput <= options) {
                viableNumber = true;
                return optionInput;
            }
        } while (viableNumber != true);

    }

    getTextInput() {
        let viableString = flase;
        const textInput = readline.question();
        do {
            if (typeof textInput === "string") {
                viableString = true;
                return textInput;
            }
        } while (viableString != true);
    }
}



exports.InputHander = InputHander;