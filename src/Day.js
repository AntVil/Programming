const constantsModule = require("./constants");
const storyModule = require("./Story");
const interactionModule = require("./Interaction");
const optionModule = require("./Option");
const textInputModule = require("./TextInput");
const audioContainerModule = require("./AudioContainer");
const fileReaderModule = require("fs");

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
            //console.log(this.agenda[i]);
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

        const STORY_CONSEQUENCE = 6;

        const INTERACTION = 7;
        const INTERACTION_STYLE_CHANGE = 8;
        const INTERACTION_STYLED = 9;

        const OPTION = 10;
        const OPTION_STYLE_CHANGE = 11;
        const OPTION_STYLED = 12;

        const OPTION_CONSEQUENCE = 13;

        const TEXT_INPUT = 14;
        const TEXT_INPUT_STYLE_CHANGE = 15;
        const TEXT_INPUT_STYLED = 16;

        const VARIABLE_START = 17;

        const AUDIO = 18;

        let state = STATE0;
        let eventText = "";
        let atLine = 0;
        for (var i = 0; i < dayMarkup.length; i++) {
            let character = dayMarkup.charAt(i);
            if (state === STATE0) {
                if (character === constantsModule.MARKER_COMMENT) {
                    state = COMMENT;
                } else if (character === constantsModule.MARKER_RESTRICTION_START) {
                    state = RESTRICTION;
                } else if (character === constantsModule.MARKER_STORY_START) {
                    state = STORY;
                } else if (character === constantsModule.MARKER_INTERACTION_START) {
                    state = INTERACTION;
                } else if (character === constantsModule.MARKER_TEXT_INPUT_START) {
                    state = TEXT_INPUT;
                } else if (character === constantsModule.MARKER_AUDIO_START) {
                    state = AUDIO;
                }
            } else if (state === COMMENT) {
                if (character === constantsModule.MARKER_COMMENT) {
                    state = STATE0;
                }
            } else if (state === RESTRICTION) {
                if (character === constantsModule.MARKER_STORY_START) {
                    state = STORY;
                    eventText += character;
                } else if (character === constantsModule.MARKER_INTERACTION_START) {
                    state = INTERACTION;
                    eventText += character;
                } else if (character === constantsModule.MARKER_OPTION_START) {
                    state = OPTION;
                    eventText += character;
                } else if(character === constantsModule.MARKER_TEXT_INPUT_START){
                    state = TEXT_INPUT;
                    eventText += character;
                } else if(character === constantsModule.MARKER_AUDIO_START){
                    state = AUDIO;
                    eventText += character;
                } else {
                    eventText += character;
                }
            } else if (state === STORY) {
                if (character === constantsModule.MARKER_STYLE_CHANGE) {
                    state = STORY_STYLE_CHANGE;
                } else if (character === constantsModule.MARKER_STORY_END) {
                    this.addToAgenda(constantsModule.TYPE_STORY, eventText);
                    eventText = "";
                    state = STATE0;
                } else if(character === constantsModule.MARKER_CONSEQUENCE_START){
                    state = STORY_CONSEQUENCE;
                    eventText += character;
                }else {
                    eventText += character;
                }
            } else if (state === STORY_STYLE_CHANGE) {
                if (character === constantsModule.MARKER_STYLE_RED) {
                    eventText += "\x1b[31m";
                    state = STORY_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_GREEN) {
                    eventText += "\x1b[32m";
                    state = STORY_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_BLUE) {
                    eventText += "\x1b[34m";
                    state = STORY_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_UNDERLINE) {
                    eventText += "\x1b[4m";
                    state = STORY_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_BOLD) {
                    eventText += "\x1b[1m";
                    state = STORY_STYLED;
                } else {
                    throw new Error(`Error: invalid style character. (line: ${atLine})`);
                }
            } else if (state === STORY_STYLED) {
                if (character === constantsModule.MARKER_STYLE_END) {
                    eventText += "\x1b[0m";
                    state = STORY;
                } else {
                    eventText += character;
                }
            } else if(state === STORY_CONSEQUENCE){
                if (character === constantsModule.MARKER_STORY_END) {
                    this.addToAgenda(constantsModule.TYPE_STORY, eventText);
                    eventText = "";
                    state = STATE0;
                } else {
                    eventText += character;
                }
            }else if (state === INTERACTION) {
                if (character === constantsModule.MARKER_STYLE_CHANGE) {
                    state = INTERACTION_STYLE_CHANGE;
                } else if (character === constantsModule.MARKER_RESTRICTION_START) {
                    this.addToAgenda(constantsModule.TYPE_INTERACTION, eventText);
                    eventText = "";
                    state = RESTRICTION;
                } else if (character === constantsModule.MARKER_OPTION_START) {
                    this.addToAgenda(constantsModule.TYPE_INTERACTION, eventText);
                    eventText = "";
                    state = OPTION;
                } else if (character === constantsModule.MARKER_INTERACTION_END) {
                    this.addToAgenda(constantsModule.TYPE_INTERACTION, eventText);
                    eventText = "";
                    state = STATE0;
                } else {
                    eventText += character;
                }
            } else if (state === INTERACTION_STYLE_CHANGE) {
                if (character === constantsModule.MARKER_STYLE_RED) {
                    eventText += "\x1b[31m";
                    state = INTERACTION_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_GREEN) {
                    eventText += "\x1b[32m";
                    state = INTERACTION_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_BLUE) {
                    eventText += "\x1b[34m";
                    state = INTERACTION_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_UNDERLINE) {
                    eventText += "\x1b[4m";
                    state = INTERACTION_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_BOLD) {
                    eventText += "\x1b[1m";
                    state = INTERACTION_STYLED;
                } else {
                    throw new Error(`Error: invalid style character (line: ${atLine})`);
                }
            } else if (state === INTERACTION_STYLED) {
                if (character === constantsModule.MARKER_STYLE_END) {
                    eventText += "\x1b[0m";
                    state = INTERACTION;
                } else {
                    eventText += character;
                }
            } else if (state === OPTION) {
                if (character === constantsModule.MARKER_STYLE_CHANGE) {
                    state = OPTION_STYLE_CHANGE;
                } else if (character === constantsModule.MARKER_CONSEQUENCE_START) {
                    state = OPTION_CONSEQUENCE;
                    eventText += character;
                } else if (character === constantsModule.MARKER_OPTION_END) {
                    this.addToAgenda(constantsModule.TYPE_OPTION, eventText);
                    eventText = "";
                    state = INTERACTION;
                } else {
                    eventText += character;
                }
            } else if (state === OPTION_STYLE_CHANGE) {
                if (character === constantsModule.MARKER_STYLE_RED) {
                    eventText += "\x1b[31m";
                    state = OPTION_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_GREEN) {
                    eventText += "\x1b[32m";
                    state = OPTION_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_BLUE) {
                    eventText += "\x1b[34m";
                    state = OPTION_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_UNDERLINE) {
                    eventText += "\x1b[4m";
                    state = OPTION_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_BOLD) {
                    eventText += "\x1b[1m";
                    state = OPTION_STYLED;
                } else {
                    throw new Error(`Error: invalid style character (line: ${atLine})`);
                }
            } else if (state === OPTION_STYLED) {
                if (character === constantsModule.MARKER_STYLE_END) {
                    eventText += "\x1b[0m";
                    state = OPTION;
                } else {
                    eventText += character;
                }
            } else if (state === OPTION_CONSEQUENCE) {
                if (character === constantsModule.MARKER_OPTION_END) {
                    this.addToAgenda(constantsModule.TYPE_OPTION, eventText);
                    eventText = "";
                    state = INTERACTION;
                } else {
                    eventText += character;
                }
            } else if (state === TEXT_INPUT) {
                if (character === constantsModule.MARKER_VARIABLE_START) {
                    state = VARIABLE_START;
                    eventText += character;
                } else if(character === constantsModule.MARKER_STYLE_CHANGE){
                    state = TEXT_INPUT_STYLE_CHANGE;
                } else {
                    eventText += character;
                }
            } else if (state === TEXT_INPUT_STYLE_CHANGE) {
                if (character === constantsModule.MARKER_STYLE_RED) {
                    eventText += "\x1b[31m";
                    state = TEXT_INPUT_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_GREEN) {
                    eventText += "\x1b[32m";
                    state = TEXT_INPUT_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_BLUE) {
                    eventText += "\x1b[34m";
                    state = TEXT_INPUT_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_UNDERLINE) {
                    eventText += "\x1b[4m";
                    state = TEXT_INPUT_STYLED;
                } else if (character === constantsModule.MARKER_STYLE_BOLD) {
                    eventText += "\x1b[1m";
                    state = TEXT_INPUT_STYLED;
                } else {
                    throw new Error(`Error: invalid style character. (line: ${atLine})`);
                }
            } else if (state === TEXT_INPUT_STYLED) {
                if (character === constantsModule.MARKER_STYLE_END) {
                    eventText += "\x1b[0m";
                    state = TEXT_INPUT;
                } else {
                    eventText += character;
                }
            } else if (state === VARIABLE_START) {
                if (character === constantsModule.MARKER_TEXT_INPUT_END) {
                    this.addToAgenda(constantsModule.TYPE_TEXT_INPUT, eventText);
                    eventText = "";
                    state = STATE0;
                } else {
                    eventText += character;
                }
            } else if(state === AUDIO){
                if(character === constantsModule.MARKER_AUDIO_END){
                    this.addToAgenda(constantsModule.TYPE_AUDIO, eventText);
                    eventText = "";
                    state = STATE0;
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
    addToAgenda(eventType, eventText) {
        eventText = eventText.trim();
        if (eventText !== "") {
            if (eventType === constantsModule.TYPE_STORY) {
                this.agenda.push(new storyModule.Story(eventText));
            }else if(eventType === constantsModule.TYPE_INTERACTION){
                this.agenda.push(new interactionModule.Interaction(eventText));
            }else if(eventType === constantsModule.TYPE_OPTION){
                let lastAgendaEvent = this.agenda[this.agenda.length-1];
                if(lastAgendaEvent.getType() === constantsModule.TYPE_INTERACTION){
                    lastAgendaEvent.addOption(new optionModule.Option(eventText));
                }else{
                    throw new Error("Error: Unexpected option without interaction!");
                }
            }else if(eventType === constantsModule.TYPE_TEXT_INPUT){
                this.agenda.push(new textInputModule.TextInput(eventText));
            }else if(eventType === constantsModule.TYPE_AUDIO){
                this.agenda.push(new audioContainerModule.AudioContainer(eventText));
            }else{
                throw new Error("Error: Unexpected event!");
            }
        }
    }

    popEvent(){
        return this.agenda.shift();
    }

    isDone() {
        return this.agenda.length === 0;
    }
}

exports.Day = Day;