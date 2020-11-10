const dayHandlerModule = require("./DayHandler");
//const inputHandlerModule = require("./InputHander");

class Main{
    constructor(){
        this.dayHandler = new dayHandlerModule.DayHandler();
        //this.inputHandler = new inputHandlerModule.InputHandler;
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
        let eventType = this.dayHandler.getEventType();
        
        if(eventType === "STORY"){
            let story = this.dayHandler.popEventData();
            this.handleStory(story.RESTRICTION, story.TEXT);
        }else if(eventType === "INTERACTION"){
            let interaction = this.dayHandler.popEventData();
            let options = this.dayHandler.popOptions();
            this.handleInteraction(interaction.RESTRICTION, interaction.TEXT, options);
        }else if(eventType === "TEXT_INPUT"){
            let input = this.dayHandler.popEventData();
            this.handleTextInput(input.TEXT, input.VARIABLE_NAME);
        }else{
            throw new Error(`Error: Unexpected event: '${eventType}'`);
        }
    }

    handleStory(restriction, storyText){
        if(this.validRestriction(restriction)){
            return;
        }

        console.log(storyText + "\n");
    }

    handleInteraction(restriction, interactionText, options){
        if(this.validRestriction(restriction)){
            return;
        }
        
        console.log(interactionText + "\n");

        for(let i=0;i<options.length;i++){
            console.log(`[${i}]\n` + options[i].TEXT + "\n");
        }

        let takenOption = 1;//this.inputHandler.getTextInput();
        let consequences = options[takenOption].CONSEQUENCES;
        for(let i=0;i<consequences.length;i++){
            let consequenceParts = consequences[i].split("=");
            let consequenceVariable = (consequenceParts[0] || "").trim().toUpperCase();
            let consequenceValue = (consequenceParts[1] || "").trim().toUpperCase();
            this.variableDictionary[consequenceVariable] = consequenceValue;
        }
    }

    handleTextInput(inputDescription, variableName){
        console.log(inputDescription);
        this.variableDictionary[variableName] = "User-input";//this.inputHandler.getTextInput();
        console.log("");
    }

    validRestriction(restriction){
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
