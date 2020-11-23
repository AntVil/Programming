class TextOutputHandler{
    constructor(){
        
    }

    typeText(text, wait){
        let index = 0;
        while (index < text.length) {
            process.stdout.write(text.charAt(index))
            this.sleep(wait);
            ++index;
        }
    }

    printText(text){
        console.log(text);
    }

    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }
}

exports.TextOutputHandler = TextOutputHandler;