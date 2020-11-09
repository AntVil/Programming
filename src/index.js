const dayHandlerModule = require("./DayHandler");

class Main{
    constructor(){
        this.dayHandler = new dayHandlerModule.DayHandler();
    }

    run(){
        console.log("running program");
        console.log("loading day");
        this.dayHandler.loadNextDay();
    }
}

let main = new Main();
main.run();