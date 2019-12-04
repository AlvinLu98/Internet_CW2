const EvenEmitter = require('events');

//Create class
class MyEmitter extends EvenEmitter {}

//Init object
const myEmitter1 = new MyEmitter();

//Create event listener
myEmitter1.on('event', () => console.log('Event fired! '))

//Init event
myEmitter1.emit('event');