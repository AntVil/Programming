const constantsModule = require("./constants");

class AudioContainer{
    constructor(description) {
        this.fileName = description.trim();
    }

    getType() {
        return constantsModule.TYPE_AUDIO;
    }

    getFile() {
        return file;
    }
}

exports.AudioContainer = AudioContainer;