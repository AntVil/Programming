const dayModule = require("./Day");
const pathModule = require("path");
const daysFolderPath = pathModule.join(__dirname, "/days");

class DayHandler{
    constructor(){
        this.DAYS = [
            "dayTemplate.txt"
        ];

        this.dayIndex = -1;

        //default day
        this.currentDay = new dayModule.Day("");
    }

    loadNextDay(){
        this.dayIndex++;
        let dayFilePath = pathModule.join(daysFolderPath, this.DAYS[this.dayIndex]);
        this.currentDay = new dayModule.Day(dayFilePath);
    }

    getEventType(){
        return this.currentDay.getEventType();
    }

    popOptions(){
        let options = [];
        while(!this.dayIsDone()){
            if(this.getEventType() === "OPTION"){
                options.push(this.popEventData());
            }else{
                break;
            }
        }
        return options;
    }

    popEventData(){
        return this.currentDay.popEventData();
    }

    dayIsDone(){
        return this.currentDay.isDone();
    }
}

exports.DayHandler = DayHandler;