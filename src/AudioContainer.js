const constantsModule = require("./constants");
const restrictionModule = require("./Restriction");

class AudioContainer{
    constructor(description) {
        let audio = description.split(constantsModule.MARKER_AUDIO_START);
                
        this.restriction;
        this.fileName;
        
        if(audio.length === 1){
            this.restriction = new restrictionModule.Restriction("");
            this.fileName = audio[0].trim();
        }else{
            this.restriction = new restrictionModule.Restriction(audio[0]);
            this.fileName = audio[1].trim();
        }
    }

    getRestriction(){
        return this.restriction;
    }

    getText(){
        return this.fileName;
    }

    getConsequences(){
        return [];
    }

    getType(){
        return constantsModule.TYPE_AUDIO;
    }
}

exports.AudioContainer = AudioContainer;