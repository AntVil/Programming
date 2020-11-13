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
        if(this.restrictionSatisfied(story.getRestriction())){
            console.log(story.getText() + "\n");

            let consequences = story.getConsequences();
            for(let i=0;i<consequences.length;i++){
                this.handleConsequence(consequences[i]);
            }
        }
    }

    handleInteraction(interaction){
        if(this.restrictionSatisfied(interaction.getRestriction())){
            console.log(interaction.getText() + "\n");

            let options = interaction.getOptions();
            let possibleOptions = [];
            for(let i=0;i<options.length;i++){
                if(this.restrictionSatisfied(options[i].getRestriction())){
                    possibleOptions.push(options[i]);
                }
            }
            for(let i=0;i<options.length;i++){
                console.log(`[${i}] ${options[i].getText()}\n`);
            }

            let takenOption = this.inputHandler.getOptionInput(options.length);
            
            let consequences = options[takenOption].getConsequences();
            for(let i=0;i<consequences.length;i++){
                this.handleConsequence(consequences[i]);
            }
        }
    }

    handleTextInput(inputDescription, variableName){
        console.log(inputDescription);
        this.variableDictionary[variableName] = this.inputHandler.getTextInput();
        console.log("");
    }


    handleConsequence(consequence){
        this.variableDictionary[consequence.getVariableName()] = consequence.getVariableValue();
    }


    restrictionSatisfied(restriction){
        let restrictions = restriction.getRestrictions();
        for(let i=0;i<restrictions.length;i++){
            let res = restrictions[i].split(constantsModule.MARKER_VARIABLE_EQUALS);
            let variableName = res[0].trim();
            let variableValue = res[1].trim();
            if(this.variableDictionary[variableName] !== variableValue){
                return false;
            }
        }

        return true;
    }
}

let main = new Main();
main.run();
