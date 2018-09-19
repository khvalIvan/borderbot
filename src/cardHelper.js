function createHeroCard(options) {
    let adaptiveCard = getAdaptiveCardSchema();
    adaptiveCard.content.body.push(getHeaderColumnSet(options));
    adaptiveCard.content.body.push(getColumnSet({text: 'Выезд:', weight: 'bolder'}));
    adaptiveCard.content.body.push(getColumnSet({text: `Легковые: ${options.outLCount}`}));
    adaptiveCard.content.body.push(getColumnSet({text: `Грузовые: ${options.outGCount}`}));
    adaptiveCard.content.body.push(getColumnSet({text: `Автобусы: ${options.outACount}`}));
    adaptiveCard.content.body.push(getColumnSet({text: 'Въезд:', weight: 'bolder'}));
    adaptiveCard.content.body.push(getColumnSet({text: `Грузовые: ${options.inGCount}`}));
    adaptiveCard.content.body.push(getColumnSet({text: `Автобусы: ${options.inACount}`}));
    if (options.outImageUrl || options.inImageUrl) {
        adaptiveCard.content.body.push(getImageColumnSet(options));
    }
    return adaptiveCard;
}

function getAdaptiveCardSchema() {
    adaptiveCardSchema = {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            version: '1.0',
            type: 'AdaptiveCard',
            body: []
        }
    }
    return adaptiveCardSchema;
}

function getColumnSetSchema() {
    let columnSet = {
        type: 'ColumnSet',
        columns: []
    }
    return columnSet;
}

function getHeaderColumnSet(options) {
    let columnSet = getColumnSetSchema();
    columnSet.columns.push(
        getAdaptiveCardColumn({
            text: `${options.name} (${options.country})`, 
            weight: 'bolder', 
            color: 'accent', 
            width: 'stretch'
        })
    )
    columnSet.columns.push(
        getAdaptiveCardColumn({
            text: `${options.updateDateTime}`, 
            weight: 'bolder', 
            color: 'accent', 
            horizontalAlignment: 'right'
        })
    )
    return columnSet;
}

function getImageColumnSet(options) {
    let columnSet = getColumnSetSchema();
    let addEmptyColumn = false;
    if (options.outImageUrl) {
        columnSet.columns.push(getImageColumn({
            text: 'Камера выезд:',
            imageUrl: options.outImageUrl
        }));
    } else {
        addEmptyColumn = true;
    }
    if (options.inImageUrl) {
        columnSet.columns.push(getImageColumn({
            text: 'Камера въезд:',
            imageUrl: options.inImageUrl
        }));
    } else {
        addEmptyColumn = true;
    }
    if (addEmptyColumn) {
        columnSet.columns.push({
            type: 'Column',
            items: []
        })
    }
    return columnSet;
}

function getImageColumn(options) {
    let column = getAdaptiveCardColumn({
        text: options.text,
        weight: 'bolder',
        width: 'stretch'
    });
    column.items.push({
        type: 'Image',
        url: options.imageUrl
    });
    return column;
}

function getColumnSet(options) {
    let columnSet = getColumnSetSchema();
    columnSet.columns.push(
        getAdaptiveCardColumn({
            text: options.text, 
            weight: options.weight
        })
    )
    return columnSet;
}

function getAdaptiveCardColumn(options) {
    let column = {
        type: 'Column',
        width: options.width || 'auto',
        items: [],
        horizontalAlignment: options.horizontalAlignment || 'left'
    }
    column.items.push(getAdaptiveCardTextBlock({
        text: options.text, 
        weight: options.weight, 
        color: options.color
    }))
    return column
}

function getAdaptiveCardTextBlock(options) {
    let textBlock = {
        type: 'TextBlock',
        text: options.text,
        isSubtle: false,
        weight: options.weight || 'default',
        separator: true,
        color: options.color || 'default'
    }
    return textBlock;
}

module.exports = createHeroCard;