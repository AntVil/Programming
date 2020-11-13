const dayHandlerModule = require("./DayHandler");
const inputHandlerModule = require("./InputHandler");
const constantsModule = require("./constants");

class Main{
    constructor(){
        this.dayHandler = new dayHandlerModule.DayHandler();
        this.inputHandler = new inputHandlerModule.InputHandler();

        this.variableDictionary = {
            "N": "Username"
        };
    }

    run(){
        console.log("running program");
        console.log("loading day");
        this.dayHandler.loadNextDay();
        while(!this.dayHandler.dayIsDone()){
            this.runStep();
        }
    }

    runStep(){
        let event = this.dayHandler.popEvent();
        if(event.getType() === constantsModule.TYPE_STORY){
            this.handleStory(event);
        }else if(event.getType() === constantsModule.TYPE_INTERACTION){
            this.handleInteraction(event);
        }else if(event.getType() === constantsModule.TYPE_TEXT_INPUT){
            this.handleTextInput(event);
        }else{
            throw new Error(`Error: Unexpected event: '${eventType}'`);
        }
    }

    handleStory(story){
        if(this.restrictionSatisfied(story.getRestrictions()[0])){
            return;
        }

        console.log(story.getText() + "\n");

        for(let i=0;i<consequences.length;i++){
            let consequenceParts = consequences[i].split("=");
            let consequenceVariable = (consequenceParts[0] || "").trim().toUpperCase();
            let consequenceValue = (consequenceParts[1] || "").trim().toUpperCase();
            this.variableDictionary[consequenceVariable] = consequenceValue;
        }
    }

    handleInteraction(interaction){
        if(this.restrictionSatisfied(interaction.getRestrictions()[0])){
            return;
        }
        
        console.log(interaction.getText() + "\n");

        let options = interaction.getOptions();
        for(let i=0;i<options.length;i++){
            console.log(`[${i}] ${options[i].getText()}\n`);
        }

        let takenOption = this.inputHandler.getOptionInput(options.length);
        let consequences = options[takenOption].getConsequences();
        
        /*
        for(let i=0;i<consequences.length;i++){
            let consequenceParts = consequences[i].split("=");
            let consequenceVariable = (consequenceParts[0] || "").trim().toUpperCase();
            let consequenceValue = (consequenceParts[1] || "").trim().toUpperCase();
            this.variableDictionary[consequenceVariable] = consequenceValue;
        }
        */
    }

    handleTextInput(inputDescription, variableName){
        console.log(inputDescription);
        this.variableDictionary[variableName] = this.inputHandler.getTextInput();
        console.log("");
    }

    restrictionSatisfied(restriction){
        if(restriction === ""){
            return false;
        }
        let restrictionParts = restriction.split("=");
        let restrictionVariable = (restrictionParts[0] || "").trim().toUpperCase();
        let restrictionValue = (restrictionParts[1] || "").trim().toUpperCase();
        return this.variableDictionary[restrictionVariable] !== restrictionValue;
    }
}

let main = new Main();
main.run();
