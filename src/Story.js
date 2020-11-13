const constantsModule = require("./constants");
const consequenceModule = require("./Consequence");

class Story{
    constructor(description){
        let story = description.split(constantsModule.MARKER_STORY_START);
                
        this.restriction;
        this.text;
        this.consequences = [];
        if(story.length === 1){
            this.restriction = "";

            let storyParts = story[0].split(constantsModule.MARKER_CONSEQUENCE_START);
            if(storyParts.length === 1){
                this.text = storyParts[0].trim();
            }else{
                this.text = storyParts[0].trim();
                let consequences = storyParts.splice(1, storyParts.length-1);
                for(var i=0;i<consequences.length;i++){
                    this.consequences.push(new consequenceModule.Consequence(consequences[i]));
                }
            }
        }else{
            this.restriction = story[0];

            let storyParts = story[1].split(constantsModule.MARKER_CONSEQUENCE_START);
            if(storyParts.length === 1){
                this.text = storyParts[0].trim();
            }else{
                this.text = storyParts[0].trim();
                let consequences = storyParts.splice(1, storyParts.length-1);
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
        return constantsModule.TYPE_STORY;
    }
}



exports.Story = Story;