const dayHandlerModule = require("./DayHandler");
const inputHandlerModule = require("./InputHandler");
const constantsModule = require("./constants");

class Main {
    constructor() {
        this.dayHandler = new dayHandlerModule.DayHandler();
        this.inputHandler = new inputHandlerModule.InputHandler();

        this.variableDictionary = {
            "N": "Username"
        };
    }

    run() {
        console.log("running program");
        console.log("loading day");
        this.dayHandler.loadNextDay();
        while (!this.dayHandler.dayIsDone()) {
            this.runStep();
        }
        this.dayHandler.loadNextDay();
        while (!this.dayHandler.dayIsDone()) {
            this.runStep();
        }
    }

    runStep() {
        let event = this.dayHandler.popEvent();
        if (event.getType() === constantsModule.TYPE_STORY) {
            this.handleStory(event);
        } else if (event.getType() === constantsModule.TYPE_INTERACTION) {
            this.handleInteraction(event);
        } else if (event.getType() === constantsModule.TYPE_TEXT_INPUT) {
            this.handleTextInput(event);
        } else {
            throw new Error(`Error: Unexpected event: '${eventType}'`);
        }
    }

    handleStory(story) {
        if (this.restrictionSatisfied(story.getRestriction())) {

             this.typeWriter(this.customVariableChanger(story.getText()));

            let consequences = story.getConsequences();
            for (let i = 0; i < consequences.length; i++) {
                this.handleConsequence(consequences[i]);
            }
        }
    }

    handleInteraction(interaction) {
        if (this.restrictionSatisfied(interaction.getRestriction())) {

            console.log(this.customVariableChanger(interaction.getText()));

            let options = interaction.getOptions();
            let possibleOptions = [];
            for (let i = 0; i < options.length; i++) {
                if (this.restrictionSatisfied(options[i].getRestriction())) {
                    possibleOptions.push(options[i]);
                }
            }
            for (let i = 0; i < options.length; i++) {
                console.log(`[${i}] ${options[i].getText()}\n`);
            }

            let takenOption = this.inputHandler.getOptionInput(options.length);

            let consequences = options[takenOption].getConsequences();
            for (let i = 0; i < consequences.length; i++) {
                this.handleConsequence(consequences[i]);
            }
        }
    }

    handleTextInput(textInput) {
        console.log(textInput.getText());
        this.variableDictionary[textInput.getVariableName()] = this.inputHandler.getTextInput();
        console.log("");
        console.log(this.variableDictionary);
    }


    handleConsequence(consequence) {
        this.variableDictionary[consequence.getVariableName()] = consequence.getVariableValue();
    }


    restrictionSatisfied(restriction) {
        let variables = restriction.getVariables();
        for (let i = 0; i < variables.length; i++) {
            let variable = variables[i];
            if (this.variableDictionary[variable.getVariableName()] !== variable.getVariableValue()) {
                return false;
            }
        }

        return true;
    }
    customVariableChanger(input) {
        let changer = input +  "\n";
        while (changer.includes("~N") === true) {
            changer = changer.replace("~N", this.variableDictionary.N);
        }
        return changer;
    }
    typeWriter(input) {
        let index = 0 ;
        while(index < input.length){
            process.stdout.write(input.charAt(index))
            this.sleep(50);
            ++index;
        }
    }
    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }
}

let main = new Main();
main.run();
