const constantsModule = require("./constants");

class Restriction{
    constructor(description){
        description = description.toUpperCase();
        this.restrictions = description.split(constantsModule.MARKER_VARIABLE_AND);
        for(let i=0;i<this.restrictions.length;i++){
            this.restrictions[i] = this.restrictions[i].trim();
        }

        if(this.restrictions[0] === ""){
            this.restrictions = [];
        }

        /*
        this.variables = [];
        let restrictions = description.split(constantsModule.MARKER_VARIABLE_AND);
        for(let i=0;i<restrictions.length;i++){
            this.variables.push(restrictions[i].split(constantsModule.MARKER_VARIABLE_EQUALS));
        }
        */
    }

    getType(){
        return constantsModule.TYPE_RESTRICTION;
    }

    getRestrictions(){
        return this.restrictions;
    }

    getVariablesLength(){
        return this.variables.length;
    }

    getVariableName(index){

    }

    getVariableValue(index){

    }
}


exports.Restriction = Restriction;