const fs = require('fs');
const pathModule = require('path');
const portAudio = require('naudiodon');
const mainModule = require("./Main");
const audioFolderPath = pathModule.join(__dirname, "/audio");

let p;
let res;

class AudioOutputHandler{
    constructor(){
        
    }

    async playFile(filename){
        p = new Promise(function(resolve, reject) { 
            res = resolve;
        });

        let ao = new portAudio.AudioIO({
            outOptions: {
                channelCount: 2,
                sampleFormat: portAudio.SampleFormat16Bit,
                sampleRate: 48000,
                deviceId: -1,
                closeOnError: true
            }
        });
    
        let rs = fs.createReadStream(`${audioFolderPath}/${filename}.wav`);
    
        rs.pipe(ao);
        ao.start();
    
        rs.on("end", function(){
            res();
        });

        await p;
    }

    onDone(){
        mainModule.main.runStep();
    }
}

exports.AudioOutputHandler = AudioOutputHandler;