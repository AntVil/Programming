const constantsModule = require("./constants");
const consequenceModule = require("./Consequence");

class Option{
    constructor(description){
        let option = description.split(constantsModule.MARKER_OPTION_START);
                
        this.restriction;
        this.text;
        this.consequences = [];
        if(option.length === 1){
            this.restriction = "";

            let optionParts = option[0].split(constantsModule.MARKER_CONSEQUENCE_START);
            if(optionParts.length === 1){
                this.text = optionParts[0];
            }else{
                this.text = optionParts[0];
                let consequences = optionParts.splice(1, optionParts.length-1);
                for(var i=0;i<consequences.length;i++){
                    this.consequences.push(new consequenceModule.Consequence(consequences[i]));
                }
            }
        }else{
            this.restriction = option[0];

            let optionParts = option[1].split(constantsModule.MARKER_CONSEQUENCE_START);
            if(optionParts.length === 1){
                this.text = optionParts[0];
            }else{
                this.text = optionParts[0];
                let consequences = optionParts.splice(1, optionParts.length-1);
                for(var i=0;i<consequences.length;i++){
                    this.consequences.push(new consequenceModule.Consequence(consequences[i]));
                }
            }
        }
    }

    getRestrictions(){
        return [this.restriction];
    }

    getText(){
        return this.text;
    }

    getConsequences(){
        return this.consequences;
    }

    getType(){
        return constantsModule.TYPE_OPTION;
    }
}



exports.Option = Option;