const constantsModule = require("./constants");
const restrictionModule = require("./Restriction");
const consequenceModule = require("./Consequence");

class TextInput{
    constructor(description){
        let textInput = description.split(constantsModule.MARKER_TEXT_INPUT_START);
                
        this.restriction;
        this.text;
        this.variableName;
        this.consequences = [];

        if(textInput.length === 1){
            this.restriction = new restrictionModule.Restriction("");

            let textInputParts = textInput[0].split(constantsModule.MARKER_VARIABLE_START);
            this.text = textInputParts[0].trim();

            let variableParts = textInputParts[1].split(constantsModule.MARKER_CONSEQUENCE_START);
            if(variableParts.length === 1){
                this.variableName = variableParts[0].trim();
            }else{
                this.variableName = variableParts[0].trim();
                let consequences = variableParts.splice(1, variableParts.length-1);
                for(var i=0;i<consequences.length;i++){
                    this.consequences.push(new consequenceModule.Consequence(consequences[i]));
                }
            }
        }else{
            this.restriction = new restrictionModule.Restriction(textInput[0]);

            let textInputParts = textInput[1].split(constantsModule.MARKER_VARIABLE_START);
            this.text = textInputParts[0].trim();

            let variableParts = textInputParts[1].split(constantsModule.MARKER_CONSEQUENCE_START);
            if(variableParts.length === 1){
                this.variableName = variableParts[0].trim();
            }else{
                this.variableName = VariableParts[0].trim();
                let consequences = variableParts.splice(1, variableParts.length-1);
                for(var i=0;i<consequences.length;i++){
                    this.consequences.push(new consequenceModule.Consequence(consequences[i]));
                }
            }
        }
    }

    getRestriction(){
        return this.restriction;
    }

    getText(){
        return this.text;
    }

    getConsequences(){
        return this.consequences;
    }

    getType(){
        return constantsModule.TYPE_TEXT_INPUT;
    }

    getVariableName(){
        return this.variableName.toUpperCase();
    }
}


exports.TextInput = TextInput;