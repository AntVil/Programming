const fs = require('fs');
const dayModule = require("./Day");
const pathModule = require("path");
const daysFolderPath = pathModule.join(__dirname, "/days");

class DayHandler {
    constructor() {
        this.DAYS = this.getDays();

        this.dayIndex = -1;

        //default day
        this.currentDay = new dayModule.Day("");
    }

    loadNextDay() {
        this.dayIndex++;
        let dayFilePath = pathModule.join(daysFolderPath, this.DAYS[this.dayIndex]);
        this.currentDay = new dayModule.Day(dayFilePath);
    }


    popEvent() {
        return this.currentDay.popEvent();
    }

    isDone() {
        return this.dayIndex >= this.DAYS.length;
    }

    dayIsDone() {
        return this.currentDay.isDone();
    }
    getDays() {
        let fileList = fs.readdirSync(daysFolderPath);

        for (let i = 0; i < fileList.length; i++) {
            fileList[i] = fileList[i].replace(/^\D+/g, '');
        }

        fileList = fileList.filter(item => item);

        for (let i = 0; i < fileList.length; i++) {
            let isString = i;
            isString = isString + ".txt";

            if (fileList[i] != isString) {
                fileList.splice(i, 1);
                fileList = fileList.filter(item => item);
            }
        }

        for (let i = 0; i < fileList.length; i++) {
            fileList[i] = "day" + fileList[i];
        }

        if (fileList.length != 0) {
            console.log("List of Day found: " + fileList);
            return fileList;
        }
        console.log("No days found please add days in the day folder.");
    }
}

exports.DayHandler = DayHandler;