const fs = require('fs');
const portAudio = require('naudiodon');
const mainModule = require("./Main");

class AudioOutputHandler{
    constructor(){
        
    }

    playFile(){
        let ao = new portAudio.AudioIO({
            outOptions: {
                channelCount: 2,
                sampleFormat: portAudio.SampleFormat16Bit,
                sampleRate: 48000,
                deviceId: -1,
                closeOnError: true
            }
        });
    
        let rs = fs.createReadStream('src/audio/spacetrack.wav');
    
        rs.pipe(ao);
        ao.start();
    
        rs.on("end", this.onDone);
    }

    onDone(){
        mainModule.main.runStep();
    }
}

exports.AudioOutputHandler = AudioOutputHandler;