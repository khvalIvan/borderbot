const gpkRequest = require('./gpkRequest');
var stringSimilarity = require('string-similarity');
var config = require('../config.json');

function createBotLogic(convoState) {
    return async (context) => {
        if (context.activity.type === 'conversationUpdate' && context.activity.membersAdded[0].name === 'Bot') {
            await context.sendActivity('Для получения информации об очереди на границах РБ введите название пропускного пункта\nИнформация обновляется каждый четный час круглосуточно');
        } else if (context.activity.type === 'message' && context.activity.recipient.name === 'Bot') {
            let messageText = context.activity.text.trim().toLowerCase();
            let borderPointsList = config.points.map(element => element.name);
            let bestMatch = stringSimilarity.findBestMatch(messageText, borderPointsList).bestMatch.target;
            let requestedBorderPoint = config.points.find(element => element.name === bestMatch);
            const requestResult = await gpkRequest(requestedBorderPoint);
            await context.sendActivity({attachments: [requestResult]});
        }
    }
}

module.exports = createBotLogic;