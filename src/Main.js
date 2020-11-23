const dayHandlerModule = require("./DayHandler");
const inputHandlerModule = require("./InputHandler");
const textOutputHandlerModule = require("./TextOutputHandler");
const audioOutputHandlerModule = require("./AudioOutputHandler");
const constantsModule = require("./constants");



class Main{
    constructor() {
        this.dayHandler = new dayHandlerModule.DayHandler();
        this.inputHandler = new inputHandlerModule.InputHandler();
        this.textOutputHandlerandler = new textOutputHandlerModule.TextOutputHandler();
        this.audioOutputHandler = new audioOutputHandlerModule.AudioOutputHandler();

        this.variableDictionary = {
            "N": "Username",
            "TYPESPEED": "55"
        };
    }

    run(){
        this.textOutputHandlerandler.printText("running program");
        this.dayHandler.loadNextDay();
        this.runStep();
    }

    runStep(){
        if(!this.dayHandler.isDone()){
            if(!this.dayHandler.dayIsDone()){
                this.handleStep();
            }else{
                this.dayHandler.loadNextDay();
                this.runStep();
            }
        }else{
            this.textOutputHandlerandler.printText("game done");
        }
    }

    handleStep(){
        let event = this.dayHandler.popEvent();
        if (event.getType() === constantsModule.TYPE_STORY) {
            this.handleStory(event);
            this.runStep();
        } else if (event.getType() === constantsModule.TYPE_INTERACTION) {
            this.handleInteraction(event);
            this.runStep();
        } else if (event.getType() === constantsModule.TYPE_TEXT_INPUT) {
            this.handleTextInput(event);
            this.runStep();
        } else if (event.getType() === constantsModule.TYPE_AUDIO) {
            this.handleAudio(event);
        } else {
            throw new Error(`Error: Unexpected event: '${eventType}'`);
        }
    }

    handleStory(story) {
        if (this.restrictionSatisfied(story.getRestriction())) {
            let consequences = story.getConsequences();
            for (let i = 0; i < consequences.length; i++) {
                this.handleConsequence(consequences[i]);
            }

            this.textOutputHandlerandler.typeText(this.customVariableChanger(story.getText()), parseInt(this.variableDictionary["TYPESPEED"]));
        }
    }

    handleInteraction(interaction) {
        if (this.restrictionSatisfied(interaction.getRestriction())) {

            this.textOutputHandlerandler.printText(this.customVariableChanger(interaction.getText()));

            let options = interaction.getOptions();
            let possibleOptions = [];
            for (let i = 0; i < options.length; i++) {
                if (this.restrictionSatisfied(options[i].getRestriction())) {
                    possibleOptions.push(options[i]);
                }
            }
            for (let i = 0; i < options.length; i++) {
                this.textOutputHandlerandler.printText(`[${i+1}] ${options[i].getText()}\n`);
            }

            let takenOption = this.inputHandler.getOptionInput(options.length) - 1;

            let consequences = options[takenOption].getConsequences();
            for (let i = 0; i < consequences.length; i++) {
                this.handleConsequence(consequences[i]);
            }
        }
    }

    handleTextInput(textInput) {
        this.textOutputHandlerandler.printText(textInput.getText());
        this.variableDictionary[textInput.getVariableName()] = this.inputHandler.getTextInput();
    }


    handleConsequence(consequence) {
        this.variableDictionary[consequence.getVariableName()] = consequence.getVariableValue();
    }

    handleAudio(audio) {
        if (this.restrictionSatisfied(audio.getRestriction())) {
            this.audioOutputHandler.playFile(audio.getText());
        }else{
            this.runStep();
        }
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
        let changer = input + "\n";
        while (changer.includes("~N") === true) {
            changer = changer.replace("~N", this.variableDictionary.N);
        }
        return changer;
    }
}


exports.main = new Main();