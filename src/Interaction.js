const constantsModule = require("./constants");

class Interaction{
    constructor(description){
        let interaction = description.split(constantsModule.MARKER_INTERACTION_START);
                
        this.restriction;
        this.text;
        if(interaction.length === 1){
            this.restriction = "";
            this.text = interaction[0];
        }else{
            this.restriction = interaction[0];
            this.text = interaction[1];
        }

        this.options = [];
    }

    addOption(option){
        this.options.push(option);
    }

    getRestrictions(){
        return [this.restriction];
    }

    getText(){
        return this.text;
    }

    getConsequences(){
        return [];
    }

    getType(){
        return constantsModule.TYPE_INTERACTION;
    }

    getOptions(){
        return this.options;
    }
}



exports.Interaction = Interaction;