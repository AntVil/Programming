const dayModule = require("./Day");
const pathModule = require("path");
const daysFolderPath = pathModule.join(__dirname, "/days");

class DayHandler{
    constructor(){
        this.DAYS = [
            "day0.txt",
            "day1.txt"
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


    popEvent(){
        return this.currentDay.popEvent();
    }

    dayIsDone(){
        return this.currentDay.isDone();
    }
}

exports.DayHandler = DayHandler;