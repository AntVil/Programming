const interactionModule = require("./Interaction");
const fileReaderModule = require("fs");

class Day{
    constructor(filePath){
        let dayMarkup = this.loadDay(filePath);
        this.agenda = [];

        try{
            this.fillAgenda(dayMarkup);
        }catch(error){
            console.log(error);
        }

        //testing if agenda is filled correctly
        for(let i=0;i<this.agenda.length;i++){
            console.log(this.agenda[i][1]);
        }
    }

    /**
     * This method takes the path to a file and returns it's contents.
     * If the file is not present it returns a default String!
     * @param {String} filePath String specifing the path to a file.
     * @returns {String} Contents of file.
     */
    loadDay(filePath){
        try{
            return fileReaderModule.readFileSync(filePath, "utf-8");
        }catch(error){
            return "$File not found. This is default text.$";
        }
        
    }

    /**
     * This method takes a String with markup, converts it and adds it to the end of the agenda.
     * @param {String}  dayMarkup A String with valid Markup.
     * 
     * @returns {boolean} Encountered major error while parsing (doesn't catch all errors!).
     */
    fillAgenda(dayMarkup){
        const MARKER_COMMENT = "%";
        const MARKER_RESTRICTION = "@";
        const MARKER_STORY = "$";
        const MARKER_STYLE_CHANGE = "[";
        const MARKER_STYLE_RED = "r";
        const MARKER_STYLE_GREEN = "g";
        const MARKER_STYLE_BLUE = "b";
        const MARKER_STYLE_UNDERLINE = "_";
        const MARKER_STYLE_BOLD = "+";
        const MARKER_STYLE_END = "]";
        const MARKER_INTERACTION_START = "{";
        const MARKER_INTERACTION_END = "}";
        const MARKER_OPTION_START = "<";
        const MARKER_OPTION_END = ">";
        const MARKER_OPTION_CONSEQUENCE = "#";

        const STATE0 = 0;
        const COMMENT = 1;

        const RESTRICTION = 2;

        const STORY = 3;
        const STORY_STYLE_CHANGE = 4;
        const STORY_STYLED = 5;

        const INTERACTION = 7;
        const INTERACTION_STYLE_CHANGE = 8;
        const INTERACTION_STYLED = 9;

        const OPTION = 11;
        const OPTION_STYLE_CHANGE = 12;
        const OPTION_STYLED = 13;

        const OPTION_CONSEQUENCE = 14;

        let state = STATE0;
        let eventText = "";
        let atLine = 0;
        for(var i=0;i<dayMarkup.length;i++){
            let character = dayMarkup.charAt(i);
            if(state === STATE0){
                if(character === MARKER_COMMENT){
                    state = COMMENT;
                }else if(character === MARKER_RESTRICTION){
                    state = RESTRICTION;
                }else if(character === MARKER_STORY){
                    state = STORY;
                }else if(character === MARKER_INTERACTION_START){
                    state = INTERACTION;
                }
            }else if(state === COMMENT){
                if(character === MARKER_COMMENT){
                    state = STATE0;
                }
            }else if(state === RESTRICTION){
                if(character === MARKER_STORY){
                    this.addToAgenda("STORY_RESTRICTION", eventText);
                    eventText = "";
                    state = STORY;
                }else if(character === MARKER_INTERACTION_START){
                    this.addToAgenda("INTERACTION_RESTRICTION", eventText);
                    eventText = "";
                    state = INTERACTION;
                }else if(character === MARKER_OPTION_START){
                    this.addToAgenda("OPTION_RESTRICTION", eventText);
                    eventText = "";
                    state = OPTION;
                }else{
                    eventText += character;
                }
            }else if(state === STORY){
                if(character === MARKER_STYLE_CHANGE){
                    state = STORY_STYLE_CHANGE;
                }else if(character === MARKER_STORY){
                    this.addToAgenda("STORY", eventText);
                    eventText = "";
                    state = STATE0;
                }else{
                    eventText += character;
                }
            }else if(state === STORY_STYLE_CHANGE){
                if(character === MARKER_STYLE_RED){
                    eventText += "\x1b[31m";
                    state = STORY_STYLED;
                }else if(character === MARKER_STYLE_GREEN){
                    eventText += "\x1b[32m";
                    state = STORY_STYLED;
                }else if(character === MARKER_STYLE_BLUE){
                    eventText += "\x1b[34m";
                    state = STORY_STYLED;
                }else if(character === MARKER_STYLE_UNDERLINE){
                    eventText += "\x1b[4m";
                    state = STORY_STYLED;
                }else if(character === MARKER_STYLE_BOLD){
                    eventText += "\x1b[1m";
                    state = STORY_STYLED;
                }else{
                    throw `Error: invalid style character. (line: ${atLine})`
                }
            }else if(state === STORY_STYLED){
                if(character === MARKER_STYLE_END){
                    eventText += "\x1b[0m";
                    state = STORY;
                }else{
                    eventText += character;
                }
            }else if(state === INTERACTION){
                if(character === MARKER_STYLE_CHANGE){
                    state = INTERACTION_STYLE_CHANGE;
                }else if(character === MARKER_RESTRICTION){
                    this.addToAgenda("INTERACTION", eventText);
                    eventText = "";
                    state = RESTRICTION;
                }else if(character === MARKER_OPTION_START){
                    this.addToAgenda("INTERACTION", eventText);
                    eventText = "";
                    state = OPTION;
                }else if(character === MARKER_INTERACTION_END){
                    this.addToAgenda("INTERACTION", eventText);
                    eventText = "";
                    state = STATE0;
                }else{
                    eventText += character;
                }
            }else if(state === INTERACTION_STYLE_CHANGE){
                if(character === MARKER_STYLE_RED){
                    eventText += "\x1b[31m";
                    state = INTERACTION_STYLED;
                }else if(character === MARKER_STYLE_GREEN){
                    eventText += "\x1b[32m";
                    state = INTERACTION_STYLED;
                }else if(character === MARKER_STYLE_BLUE){
                    eventText += "\x1b[34m";
                    state = INTERACTION_STYLED;
                }else if(character === MARKER_STYLE_UNDERLINE){
                    eventText += "\x1b[4m";
                    state = INTERACTION_STYLED;
                }else if(character === MARKER_STYLE_BOLD){
                    eventText += "\x1b[1m";
                    state = INTERACTION_STYLED;
                }else{
                    throw `Error: invalid style character (line: ${atLine})`;
                }
            }else if(state === INTERACTION_STYLED){
                if(character === MARKER_STYLE_END){
                    eventText += "\x1b[0m";
                    state = INTERACTION;
                }else{
                    eventText += character;
                }
            }else if(state === OPTION){
                if(character === MARKER_STYLE_CHANGE){
                    state = OPTION_STYLE_CHANGE;
                }else if(character === MARKER_OPTION_CONSEQUENCE){
                    this.addToAgenda("OPTION", eventText);
                    eventText = "";
                    state = OPTION_CONSEQUENCE;
                }else if(character === MARKER_OPTION_END){
                    this.addToAgenda("OPTION", eventText);
                    eventText = "";
                    state = INTERACTION;
                }else{
                    eventText += character;
                }
            }else if(state === OPTION_STYLE_CHANGE){
                if(character === MARKER_STYLE_RED){
                    eventText += "\x1b[31m";
                    state = OPTION_STYLED;
                }else if(character === MARKER_STYLE_GREEN){
                    eventText += "\x1b[32m";
                    state = OPTION_STYLED;
                }else if(character === MARKER_STYLE_BLUE){
                    eventText += "\x1b[34m";
                    state = OPTION_STYLED;
                }else if(character === MARKER_STYLE_UNDERLINE){
                    eventText += "\x1b[4m";
                    state = OPTION_STYLED;
                }else if(character === MARKER_STYLE_BOLD){
                    eventText += "\x1b[1m";
                    state = OPTION_STYLED;
                }else{
                    throw `Error: invalid style character (line: ${atLine})`;
                }
            }else if(state === OPTION_STYLED){
                if(character === MARKER_STYLE_END){
                    eventText += "\x1b[0m";
                    state = OPTION;
                }else{
                    eventText += character;
                }
            }else if(state === OPTION_CONSEQUENCE){
                if(character === MARKER_OPTION_END){
                    this.addToAgenda("OPTION_CONSEQUENCE", eventText);
                    eventText = "";
                    state = INTERACTION;
                }else if(character === MARKER_OPTION_CONSEQUENCE){
                    this.addToAgenda("OPTION_CONSEQUENCE", eventText);
                    eventText = "";
                    state = OPTION_CONSEQUENCE;
                }else{
                    eventText += character;
                }
            }
        }

        return state === STATE0;
    }

    /**
     * This method adds a specified event to the end of this days agenda if it's not empty.
     * @param {String} eventType written in caps (convention).
     * @param {String} eventText text needed for event (won't be added when text is only whitespaces).
     */
    addToAgenda(eventType, eventText){
        eventText = eventText.trim();
        
        if(eventText !== ""){
            this.agenda.push([eventType, eventText]);
        }
    }
}

exports.Day = Day;