const constantsModule = require("./constants");
const restrictionModule = require("./Restriction");

class TextInput{
    constructor(description){
        let textInput = description.split(constantsModule.MARKER_TEXT_INPUT_START);
                
        this.restriction;
        this.text;
        this.variableName;
        if(textInput.length === 1){
            this.restriction = new restrictionModule.Restriction("");

            let textInputParts = textInput[0].split(constantsModule.MARKER_VARIABLE_START);
            this.text = textInputParts[0];
            this.variableName = textInputParts[1];
        }else{
            this.restriction = new restrictionModule.Restriction(textInput[0]);

            let textInputParts = textInput[1].split(constantsModule.MARKER_VARIABLE_START);
            this.text = textInputParts[0];
            this.variableName = textInputParts[1];
        }
    }

    getRestrictions(){
        return this.restriction;
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
        return this.variableName.toUpperCase();
    }
}


exports.TextInput = TextInput;