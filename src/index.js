const dayHandlerModule = require("./DayHandler");
//const inputHandlerModule = require("./InputHander");

class Main{
    constructor(){
        this.dayHandler = new dayHandlerModule.DayHandler();
        //this.inputHandler = new inputHandlerModule.InputHandler;
        this.variableDictionary = {};
    }

    run(){
        console.log("running program");
        console.log("loading day");
        this.dayHandler.loadNextDay();
        //while(!this.dayHandler.dayIsDone()){
        //    this.runStep();
        //}
    }

    runStep(){
        let eventType = this.dayHandler.getEventType();
        
        if(eventType === "STORY"){
            let story = this.dayHandler.popEventData();
            
        }else if(eventType === "INTERACTION"){
            let restriction = this.dayHandler.popEventData();
        }else if(eventType === "TEXT_INPUT"){
            let requestText = this.dayHandler.popEventData();
            if(this.dayHandler.getEventType() === "VARIABLE_DECLARATION"){
                console.log(requestText);
                let variableName = this.dayHandler.popEventData();
                let userInput = "Username";//this.inputHandler.getTextInput();
                this.variableDictionary[variableName] = userInput;
                console.log(`took user input: '${userInput}'`);
            }else{
                throw new Error(`Error: Unexpected event: '${eventType}'`);
            }
        }else{
            throw new Error(`Error: Unexpected event: '${eventType}'`);
        }
    }
}

let main = new Main();
main.run();
/*
else if(eventType === "OPTION_RESTRICTION"){
            
}else if(eventType === "OPTION"){
    console.log(option);
}else if(eventType === "OPTION_CONSEQUENCE"){
    
}*/