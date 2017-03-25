var builder = require('botbuilder');


//create the connector
//var connector = new builder.ConsoleConnector().listen();

var connector = new builder.ChatConnector();

//create the bot
var bot = new builder.UniversalBot(connector);

//add in the dialog and the logic
// bot.dialog('/', function(session){
//     //session.send('Hello, bot!')
//     var userMessage = session.message.text;
//     session.send('you said: ' + userMessage);
// });

//waterfall dialog, an array of functions:

bot.dialog('/', [
    function(session) {
        builder.Prompts.text(session, 'Please enter your name');
    },
    function(session, result){
        session.send('Hello, ' + result.response);
    }

]);