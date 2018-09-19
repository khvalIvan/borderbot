const request = require('request');
const cheerio = require('cheerio');
const config = require('../config.json');
const cardHelper = require('./cardHelper');

function getQueueCount($, borderPointId, type) {
    const queueCount = $(`td[id=${borderPointId}_${type}]`).text().replace(/\n/g, '').trim();
    return queueCount;
}

async function getGPKQueue(borderPoint) {
    const endpoint = 'http://gpk.gov.by/maps/ochered.php';
  
    return new Promise((resolve) => {
      request(endpoint, (err, response, body) => {
        if (err) {
          console.log(err);
        } else {
            let requestResult = 'Service is not available';
            if (body) {
                var $ = cheerio.load(body);
                const outLCount = getQueueCount($, borderPoint.id, 'out_l');
                const outGCount = getQueueCount($, borderPoint.id, 'out_g');
                const outACount = getQueueCount($, borderPoint.id, 'out_a');
                const inGCount = getQueueCount($, borderPoint.id, 'in_g');
                const inACount = getQueueCount($, borderPoint.id, 'in_a');
                const updateDateTime = $(".ochered-info-1").first().text();
                options = {
                    "name": borderPoint.name,
                    "country": borderPoint.country,
                    "updateDateTime": updateDateTime,
                    "outImageUrl": borderPoint.outImageUrl,
                    "inImageUrl": borderPoint.inImageUrl,
                    "outLCount": outLCount,
                    "outGCount": outGCount,
                    "outACount": outACount,
                    "inGCount": inGCount,
                    "inACount": inACount
                }
                requestResult = cardHelper(options);
            }
            resolve(requestResult);
        }
      });
    });
}

module.exports = getGPKQueue;