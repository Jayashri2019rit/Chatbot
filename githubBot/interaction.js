var builder = require('botbuilder');
var restify = require('restify');
var githubClient = require('./github-client.js');

var connector = new builder.ChatConnector();
var bot = new builder.UniversalBot(connector);

var dialog = new builder.IntentDialog();
dialog.matches(/^search/i, [
    function (session, args, next) {
        if (session.message.text.toLocaleLowerCase() == 'search'){
            // TODO: Promt user for text

            builder.Prompts.text(session, 'Who do you want to search for?')
        } else {
            //substring(7) anything typed in after the search
            var query = session.message.text.substring(7);
            next({ response: query });
        }
    },
    function (session, result, next) {
        var query = result.response;
        if (!query) {
                session.endDialog('Request cancelled');
        } else {
            githubClient.executeSearch(query, function (profiles) {
                var totalCount = profiles.total_count;
                if (totalCount == 0) {
                    session.endDialog('Sorry, no results found.');
                } else if (totalCount > 10) {
                    session.endDialog('More than 10 results were found. Please provide a more restrictive query.');
                } else {
                    session.dialogData.property = null;
                    // convert the results into an array of login names
                    var usernames = profiles.items.map(function (item) { return item.login });
                    
                    // TODO: Prompt user with list
                    builder.Prompts.choice(session, 'What profile did you want to load?', usernames);
                }

             });
         }
    }, function(session, result, next) {
        // TODO: Display final request
        session.send(result.response.entity);

    }
]);

bot.dialog('/', dialog);

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.post('/api/messages', connector.listen());