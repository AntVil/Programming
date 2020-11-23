
const fs = require('fs');
const portAudio = require('naudiodon');



class AudioHandler {
    constructor(file) {
        this.audioIO = new portAudio.AudioIO({
            outOptions: {
                channelCount: 2,
                sampleFormat: portAudio.SampleFormat16Bit,
                sampleRate: 48000,
                deviceId: -1,
                closeOnError: true
            }
        });

        this.rs = fs.createReadStream('./src/audio/spacetrack.wav');
        this.rs.pipe(this.audioIO);
        this.audioIO.start();

        //by me xD
        this.rs.once("close", function(){
            this.audioIO.abort();
            audioHandler = new AudioHandler();
        })
    }
}



audioHandler = new AudioHandler();
