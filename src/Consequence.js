const constantsModule = require("./constants");

class Consequence{
    constructor(description){
        let consequence = description.split(constantsModule.MARKER_VARIABLE_EQUALS);
        this.variableName = (consequence[0] || "").trim().toUpperCase();
        this.variableValue = (consequence[1] || "").trim().toUpperCase();
    }

    getType(){
        return constantsModule.TYPE_CONSEQUENCE;
    }

    getVariableName(){
        return this.variableName;
    }

    getVariableValue(){
        return this.variableValue;
    }

    isUnlock(){
        return this.variableName.startsWith(constantsModule.MARKER_UNLOCK_START);
    }
}


exports.Consequence = Consequence;