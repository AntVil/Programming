const constantsModule = require("./constants");
const restrictionModule = require("./Restriction");

class Interaction{
    constructor(description){
        let interaction = description.split(constantsModule.MARKER_INTERACTION_START);
                
        this.restriction;
        this.text;
        if(interaction.length === 1){
            this.restriction = new restrictionModule.Restriction("");
            this.text = interaction[0];
        }else{
            this.restriction = new restrictionModule.Restriction(interaction[0]);
            this.text = new restrictionModule.Restriction(interaction[1]);
        }

        this.options = [];
    }

    addOption(option){
        this.options.push(option);
    }

    getRestriction(){
        return this.restriction;
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