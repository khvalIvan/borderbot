const gpkRequest = require('./gpkRequest');
var stringSimilarity = require('string-similarity');
var config = require('../config.json');

function createBotLogic(convoState) {
    return async (context) => {
        if (context.activity.type === 'conversationUpdate' && context.activity.membersAdded[0].name === 'Bot') {
            await context.sendActivity('Для получения информации об очереди на границах РБ введите название пропускного пункта\nВнимание!\n' + 
            'Информация об очередях обновляется каждый четный час круглосуточно\n' +
            'Онлайн трансляция с камер транслируется с задержкой в 3-5 минут');
        } else if (context.activity.type === 'message' && context.activity.recipient.name === 'Bot') {
            let requestResult;
            let messageText = context.activity.text.trim().toLowerCase();
            let contriesList = [...new Set(config.points.map(item => item.country))];
            let bestCountryMatch = stringSimilarity.findBestMatch(messageText, contriesList).bestMatch;
            if (bestCountryMatch.rating > 0.33) {
                // TODO: придумать что сделать с страной
            } else {
                let borderPointsList = config.points.map(element => element.name);
                let bestMatch = stringSimilarity.findBestMatch(messageText, borderPointsList).bestMatch.target;
                let requestedBorderPoint = config.points.find(element => element.name === bestMatch);
                requestResult = await gpkRequest(requestedBorderPoint);
            }
            await context.sendActivity({attachments: [requestResult]});
        }
    }
}

module.exports = createBotLogic;