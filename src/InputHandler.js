const readline = require("readline-sync");

class InputHandler{
    constructor(){
        
    }

    getOptionInput(options) {
        let viableNumber = false;
        let optionInput;
        do {
            optionInput = readline.questionInt();
            if (typeof optionInput === "number" && optionInput <= options && optionInput >= 1) {
                viableNumber = true;
            }
        } while (viableNumber != true);
        return optionInput;
    }

    getTextInput() {
        let viableString = false;
        let textInput;
        do {
            textInput = readline.question().trim();
            if (typeof textInput === "string" && textInput.length > 0) {
                viableString = true;
            }
        } while (viableString != true);
        return textInput;
    }

    getNumberInput() {
        let viableNumber = false;
        let optionInput;
        do {
            optionInput = readline.questionInt();
            if (typeof optionInput === "number") {
                viableNumber = true;
            }
        } while (viableNumber != true);
        return optionInput;
    }
}

exports.InputHandler = InputHandler;