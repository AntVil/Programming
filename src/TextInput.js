const constantsModule = require("./constants");

class TextInput{
    constructor(description){
        let textInput = description.split(constantsModule.MARKER_VARIABLE_START);
        
        this.text;
        this.variableName;

        if(textInput.length === 1){
            this.text = textInput[0];
        }else{
            this.text = textInput[0];
            this.variableName = textInput[1];
        }
    }

    getRestrictions(){
        return [];
    }

    getText(){
        return this.text;
    }

    getConsequences(){
        return [];
    }

    getType(){
        return constantsModule.TYPE_TEXT_INPUT;
    }

    getVariableName(){
        return this.variableName;
    }
}


exports.TextInput = TextInput;