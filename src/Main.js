const dayHandlerModule = require("./DayHandler");
const inputHandlerModule = require("./InputHandler");
const textOutputHandlerModule = require("./TextOutputHandler");
const audioOutputHandlerModule = require("./AudioOutputHandler");
const constantsModule = require("./constants");
const fileReaderModule = require("fs");
const pathModule = require("path");
const unlocksPath = pathModule.join(__dirname, "unlocks.txt");



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

    async run(){
        this.textOutputHandlerandler.printText("running program");
        this.dayHandler.loadNextDay();

        while(!this.dayHandler.isDone()){
            if(!this.dayHandler.dayIsDone()){
                await this.handleStep();
            }else{
                if(this.dayHandler.hasNextDay()){
                    this.dayHandler.loadNextDay();
                }else{
                    break;
                }
            }
        }
        
        this.textOutputHandlerandler.printText("game done");
    }

    async handleStep(){
        let event = this.dayHandler.popEvent();
        if (event.getType() === constantsModule.TYPE_STORY) {
            await this.handleStory(event);
        } else if (event.getType() === constantsModule.TYPE_INTERACTION) {
            await this.handleInteraction(event);
        } else if (event.getType() === constantsModule.TYPE_TEXT_INPUT) {
            await this.handleTextInput(event);
        } else if (event.getType() === constantsModule.TYPE_AUDIO) {
            await this.handleAudio(event);
        } else {
            throw new Error(`Error: Unexpected event: '${eventType}'`);
        }
    }

    async handleStory(story) {
        if (this.restrictionSatisfied(story.getRestriction())) {
            let consequences = story.getConsequences();
            for (let i = 0; i < consequences.length; i++) {
                this.handleConsequence(consequences[i]);
            }

            this.textOutputHandlerandler.typeText(this.customVariableChanger(story.getText()), parseInt(this.variableDictionary["TYPESPEED"]));
        }
    }

    async handleInteraction(interaction) {
        if (this.restrictionSatisfied(interaction.getRestriction())) {

            this.textOutputHandlerandler.printText(this.customVariableChanger(interaction.getText()));

            let options = interaction.getOptions();
            let possibleOptions = [];
            for (let i = 0; i < options.length; i++) {
                if (this.restrictionSatisfied(options[i].getRestriction())) {
                    possibleOptions.push(options[i]);
                }
            }
            for (let i = 0; i < possibleOptions.length; i++) {
                this.textOutputHandlerandler.printText(`[${i+1}] ${possibleOptions[i].getText()}\n`);
            }

            let takenOption = this.inputHandler.getOptionInput(possibleOptions.length) - 1;

            let consequences = possibleOptions[takenOption].getConsequences();
            for (let i = 0; i < consequences.length; i++) {
                this.handleConsequence(consequences[i]);
            }
        }
    }

    async handleTextInput(textInput) {
        if (this.restrictionSatisfied(textInput.getRestriction())) {
            this.textOutputHandlerandler.printText(textInput.getText());
            this.variableDictionary[textInput.getVariableName()] = this.inputHandler.getTextInput();

            let consequences = textInput.getConsequences();
            for (let i = 0; i < consequences.length; i++) {
                this.handleConsequence(consequences[i]);
            }
        }
    }


    async handleConsequence(consequence) {
        this.variableDictionary[consequence.getVariableName()] = consequence.getVariableValue();
        if(consequence.isUnlock()){
            let json = JSON.parse(fileReaderModule.readFileSync(unlocksPath));
            json[consequence.getVariableName()] = consequence.getVariableValue();
            fileReaderModule.writeFileSync(unlocksPath, JSON.stringify(json));
        }
    }

    async handleAudio(audio) {
        if (this.restrictionSatisfied(audio.getRestriction())) {
            await this.audioOutputHandler.playFile(audio.getText());
        }
    }


    restrictionSatisfied(restriction) {
        let variables = restriction.getVariables();
        for (let i = 0; i < variables.length; i++) {
            let variable = variables[i];

            if(variable.isUnlock()){
                let json = JSON.parse(fileReaderModule.readFileSync(unlocksPath));
                if(json[variable.getVariableName()] !== variable.getVariableValue()){
                    return false;
                }
            }else if (this.variableDictionary[variable.getVariableName()] !== variable.getVariableValue()) {
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