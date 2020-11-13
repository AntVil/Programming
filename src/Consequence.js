const constantsModule = require("./constants");

class Consequence{
    constructor(description){
        console.log(`'${description}'`);
        //consequence = description.split(constantsModule.)
    }

    getRestrictions(){
        return [];
    }

    getText(){
        return "";
    }

    getConsequences(){
        return [];
    }

    getType(){
        return constantsModule.TYPE_CONSEQUENCE;
    }
}


exports.Consequence = Consequence;