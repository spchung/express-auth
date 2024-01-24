class Logger{
    constructor(){
        
    }

    info(message){
        console.log(message);
    }

    error(message){
        console.log(message);
    }
}
const logger = new Logger();
module.exports = logger;