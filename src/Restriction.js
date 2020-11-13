const constantsModule = require("./constants");

class Restriction{
    constructor(description){
        this.variables = [];
        let restrictions = description.split(constantsModule.MARKER_VARIABLE_AND);
        for(let i=0;i<restrictions.length;i++){
            if(restrictions[i].trim().length !== 0){
                let variableParts = restrictions[i].split(constantsModule.MARKER_VARIABLE_EQUALS);
                let variable = {
                    name: variableParts[0].trim().toUpperCase(),
                    value: variableParts[1].trim().toUpperCase(),
                    getVariableName: function(){
                        return this.name;
                    },
                    getVariableValue: function(){
                        return this.value;
                    }
                }
                this.variables.push(variable);
            }
        }
        
    }

    getType(){
        return constantsModule.TYPE_RESTRICTION;
    }

    getVariables(){
        return this.variables;
    }
}


exports.Restriction = Restriction;