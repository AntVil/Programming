const interactionModule = require("./Interaction");
const fileReaderModule = require("fs");

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
const MARKER_TEXT_INPUT = "|";
const MARKER_VARIABLE_DECLARATION = "~";

class Day {
    constructor(filePath) {
        let dayMarkup = this.loadDay(filePath);
        this.atEvent = 0;
        this.agenda = [];

        try {
            this.fillAgenda(dayMarkup);
        } catch (error) {
            console.log(error);
        }

        for(let i=0;i<this.agenda.length;i++){
            console.log(this.agenda[i]);
        }
    }

    /**
     * This method takes the path to a file and returns it's contents.
     * If the file is not present it returns a default String!
     * @param {String} filePath String specifing the path to a file.
     * @returns {String} Contents of file.
     */
    loadDay(filePath) {
        try {
            return fileReaderModule.readFileSync(filePath, "utf-8");
        } catch (error) {
            return "$File not found. This is default text.$";
        }
    }

    /**
     * This method takes a String with markup, converts it and adds it to the end of the agenda.
     * @param {String}  dayMarkup A String with valid Markup.
     * 
     * @returns {boolean} Encountered major error while parsing (doesn't catch all errors!).
     */
    fillAgenda(dayMarkup) {
        const STATE0 = 0;
        const COMMENT = 1;

        const RESTRICTION = 2;

        const STORY = 3;
        const STORY_STYLE_CHANGE = 4;
        const STORY_STYLED = 5;

        const INTERACTION = 6;
        const INTERACTION_STYLE_CHANGE = 7;
        const INTERACTION_STYLED = 8;

        const OPTION = 9;
        const OPTION_STYLE_CHANGE = 10;
        const OPTION_STYLED = 11;

        const OPTION_CONSEQUENCE = 12;

        const TEXT_INPUT = 13;

        const VARIABLE_DECLARATION = 14;

        let state = STATE0;
        let eventText = "";
        let atLine = 0;
        for (var i = 0; i < dayMarkup.length; i++) {
            let character = dayMarkup.charAt(i);
            if (state === STATE0) {
                if (character === MARKER_COMMENT) {
                    state = COMMENT;
                } else if (character === MARKER_RESTRICTION) {
                    state = RESTRICTION;
                } else if (character === MARKER_STORY) {
                    state = STORY;
                } else if (character === MARKER_INTERACTION_START) {
                    state = INTERACTION;
                } else if (character === MARKER_TEXT_INPUT) {
                    state = TEXT_INPUT;
                }
            } else if (state === COMMENT) {
                if (character === MARKER_COMMENT) {
                    state = STATE0;
                }
            } else if (state === RESTRICTION) {
                if (character === MARKER_STORY) {
                    state = STORY;
                    eventText += character;
                } else if (character === MARKER_INTERACTION_START) {
                    state = INTERACTION;
                    eventText += character;
                } else if (character === MARKER_OPTION_START) {
                    state = OPTION;
                    eventText += character;
                } else {
                    eventText += character;
                }
            } else if (state === STORY) {
                if (character === MARKER_STYLE_CHANGE) {
                    state = STORY_STYLE_CHANGE;
                } else if (character === MARKER_STORY) {
                    this.addToAgenda("STORY", eventText);
                    eventText = "";
                    state = STATE0;
                } else {
                    eventText += character;
                }
            } else if (state === STORY_STYLE_CHANGE) {
                if (character === MARKER_STYLE_RED) {
                    eventText += "\x1b[31m";
                    state = STORY_STYLED;
                } else if (character === MARKER_STYLE_GREEN) {
                    eventText += "\x1b[32m";
                    state = STORY_STYLED;
                } else if (character === MARKER_STYLE_BLUE) {
                    eventText += "\x1b[34m";
                    state = STORY_STYLED;
                } else if (character === MARKER_STYLE_UNDERLINE) {
                    eventText += "\x1b[4m";
                    state = STORY_STYLED;
                } else if (character === MARKER_STYLE_BOLD) {
                    eventText += "\x1b[1m";
                    state = STORY_STYLED;
                } else {
                    throw new Error(`Error: invalid style character. (line: ${atLine})`);
                }
            } else if (state === STORY_STYLED) {
                if (character === MARKER_STYLE_END) {
                    eventText += "\x1b[0m";
                    state = STORY;
                } else {
                    eventText += character;
                }
            } else if (state === INTERACTION) {
                if (character === MARKER_STYLE_CHANGE) {
                    state = INTERACTION_STYLE_CHANGE;
                } else if (character === MARKER_RESTRICTION) {
                    this.addToAgenda("INTERACTION", eventText);
                    eventText = "";
                    state = RESTRICTION;
                } else if (character === MARKER_OPTION_START) {
                    this.addToAgenda("INTERACTION", eventText);
                    eventText = "";
                    state = OPTION;
                } else if (character === MARKER_INTERACTION_END) {
                    this.addToAgenda("INTERACTION", eventText);
                    eventText = "";
                    state = STATE0;
                } else {
                    eventText += character;
                }
            } else if (state === INTERACTION_STYLE_CHANGE) {
                if (character === MARKER_STYLE_RED) {
                    eventText += "\x1b[31m";
                    state = INTERACTION_STYLED;
                } else if (character === MARKER_STYLE_GREEN) {
                    eventText += "\x1b[32m";
                    state = INTERACTION_STYLED;
                } else if (character === MARKER_STYLE_BLUE) {
                    eventText += "\x1b[34m";
                    state = INTERACTION_STYLED;
                } else if (character === MARKER_STYLE_UNDERLINE) {
                    eventText += "\x1b[4m";
                    state = INTERACTION_STYLED;
                } else if (character === MARKER_STYLE_BOLD) {
                    eventText += "\x1b[1m";
                    state = INTERACTION_STYLED;
                } else {
                    throw new Error(`Error: invalid style character (line: ${atLine})`);
                }
            } else if (state === INTERACTION_STYLED) {
                if (character === MARKER_STYLE_END) {
                    eventText += "\x1b[0m";
                    state = INTERACTION;
                } else {
                    eventText += character;
                }
            } else if (state === OPTION) {
                if (character === MARKER_STYLE_CHANGE) {
                    state = OPTION_STYLE_CHANGE;
                } else if (character === MARKER_OPTION_CONSEQUENCE) {
                    state = OPTION_CONSEQUENCE;
                    eventText += character;
                } else if (character === MARKER_OPTION_END) {
                    this.addToAgenda("OPTION", eventText);
                    eventText = "";
                    state = INTERACTION;
                } else {
                    eventText += character;
                }
            } else if (state === OPTION_STYLE_CHANGE) {
                if (character === MARKER_STYLE_RED) {
                    eventText += "\x1b[31m";
                    state = OPTION_STYLED;
                } else if (character === MARKER_STYLE_GREEN) {
                    eventText += "\x1b[32m";
                    state = OPTION_STYLED;
                } else if (character === MARKER_STYLE_BLUE) {
                    eventText += "\x1b[34m";
                    state = OPTION_STYLED;
                } else if (character === MARKER_STYLE_UNDERLINE) {
                    eventText += "\x1b[4m";
                    state = OPTION_STYLED;
                } else if (character === MARKER_STYLE_BOLD) {
                    eventText += "\x1b[1m";
                    state = OPTION_STYLED;
                } else {
                    throw new Error(`Error: invalid style character (line: ${atLine})`);
                }
            } else if (state === OPTION_STYLED) {
                if (character === MARKER_STYLE_END) {
                    eventText += "\x1b[0m";
                    state = OPTION;
                } else {
                    eventText += character;
                }
            } else if (state === OPTION_CONSEQUENCE) {
                if (character === MARKER_OPTION_END) {
                    this.addToAgenda("OPTION", eventText);
                    eventText = "";
                    state = INTERACTION;
                } else {
                    eventText += character;
                }
            } else if (state === TEXT_INPUT) {
                if (character === MARKER_VARIABLE_DECLARATION) {
                    state = VARIABLE_DECLARATION;
                    eventText += character;
                } else {
                    eventText += character;
                }
            } else if (state = VARIABLE_DECLARATION) {
                if (character === MARKER_TEXT_INPUT) {
                    this.addToAgenda("TEXT_INPUT", eventText);
                    eventText = "";
                    state = STATE0;
                } else {
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
    addToAgenda(eventType, eventText) {
        eventText = eventText.trim();
        if (eventText !== "") {
            
            if (eventType === "STORY") {
                let story = eventText.split(MARKER_STORY);
                
                let restriction;
                let text;
                if(story.length === 1){
                    restriction = "";
                    text = story[0];
                }else{
                    restriction = story[0];
                    text = story[1];
                }
                
                this.agenda.push([eventType, {
                    RESTRICTION: restriction,
                    TEXT: text.trim()
                }]);
            }else if(eventType === "INTERACTION"){
                let interaction = eventText.split(MARKER_INTERACTION_START);
                
                let restriction;
                let text;
                if(interaction.length === 1){
                    restriction = "";
                    text = interaction[0];
                }else{
                    restriction = interaction[0];
                    text = interaction[1];
                }
                
                this.agenda.push([eventType, {
                    RESTRICTION: restriction,
                    TEXT: text.trim()
                }]);
            }else if(eventType === "OPTION"){
                let option = eventText.split(MARKER_OPTION_START);
                
                let restriction;
                let text;
                let consequences;
                if(option.length === 1){
                    restriction = "";

                    let optionParts = option[0].split(MARKER_OPTION_CONSEQUENCE);
                    if(optionParts.length === 1){
                        text = optionParts[0];
                        consequences = [];
                    }else{
                        text = optionParts[0];
                        consequences = optionParts.splice(1, optionParts.length-1);
                    }
                }else{
                    restriction = option[0];

                    let optionParts = option[1].split(MARKER_OPTION_CONSEQUENCE);
                    if(optionParts.length === 1){
                        text = optionParts[0];
                        consequences = [];
                    }else{
                        text = optionParts[0];
                        consequences = optionParts.splice(1, optionParts.length-1);
                    }
                }
                
                this.agenda.push([eventType, {
                    RESTRICTION: restriction,
                    TEXT: text.trim(),
                    CONSEQUENCES: consequences
                }]);
            }else if(eventType === "TEXT_INPUT"){
                let textInput = eventText.split(MARKER_VARIABLE_DECLARATION);
                let text;
                let variableName;

                if(textInput.length === 1){
                    text = textInput[0];
                }else{
                    text = textInput[0];
                    variableName = textInput[1];
                }

                this.agenda.push([eventType, {
                    TEXT: text.trim(),
                    VARIABLE_NAME: variableName
                }]);
            }else{
                this.agenda.push([eventType, eventText]);
            }
        }
    }

    getEventType() {
        return this.agenda[this.atEvent][0];
    }

    popEventData() {
        return this.agenda[this.atEvent++][1];
    }

    isDone() {
        return this.atEvent >= this.agenda.length - 1;
    }
}

exports.Day = Day;