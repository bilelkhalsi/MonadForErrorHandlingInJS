import _ from 'lodash';
import { Left, Right, Either } from './api';

// For left side (sad path).
const showError = _.template(`<li class="Error"><%= message %></li>`);
// For right side (happy path).
const rowToMessage = _.template(`
    <li class="Message Message--<%= viewed %>">
        <a href="<%= href %>" class="Message-link"><%= content %></a>
        <time datetime="<%= timestamp %>"><%= datestr %></time>
    </li>
`);

/**
 * Transform CSV string to list of a html list (<ul/>). 
 * @param {string} csvData CSV string.
 */
export function csvToMessages(csvData) {
    const csvRows = splitCSVToRows(csvData);
    const headerFields = csvRows.map(_.head).map(rowFields);
    const dataRows = csvRows.map(_.tail);
    const eitherFun = headerFields.map(processRows);
    const messagesArray = dataRows.ap(eitherFun);
    return either(showError, showMessages, messagesArray);
}


/**
 * Group list of <li> in <ul> element.
 * @param {Array<string>} messages array of html <li/> 
 */
function showMessages(messages) {
    return `<ul class="Messages">${messages.join('\n')}</ul>`;
}


function splitCSVToRows(csvData) {
    // There should alawys be a header row. so if thereès no new ligne character, something is wrong.
    return (csvData.indexOf('\n') < 0)
        ? Either.left('No header row found in CSV data')
        : Either.right(csvData.split('\n'));
}

/**
* This method process all the csv rows
*/
function processRows(headerFields = []) {
    return dataRows => dataRows.map(row => processRow(headerFields, row));
}

/**
* This method process a single row 
* @param {*} headerFields an array of header fields
* @param {*} row a csv row.
*/
function processRow(headerFields, row) {
    const rowWithDate = Either.right(row)
        .map(rowFields)
        .flatMap(zipRowHighOrderFn(headerFields))
        .flatMap(addDateStr);
    return either(showError, rowToMessage, rowWithDate);
}

/**
 * Return an array of row fields.
 * @param csv row 
 */
function rowFields(row) {
    return row.split(',');
}

/**
 * High order function that take header fields and return row fields.
 * @param {*} headerFields header fields
 */
function zipRowHighOrderFn(headerFields) {
    return rowFields => headerFields.length !== rowFields.length
        ? Either.left(new Error('Row has an unexpected number of fields'))
        : Either.right(_.zipObject(headerFields, rowFields));
}


/**
 * This method format timestamp to human readable date.
 * @param {*} messageObj row object
 */
function addDateStr(messageObj) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'
    ];
    const d = new Date(messageObj.timestamp);
    if (isNaN(d)) {
        return Either.left(new Error('Unable to parse date stamp in message object'));
    }
    const datestr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    return Either.right({ datestr, ...messageObj });
}

function either(leftFun, rightFun, e) {
    console.log(e.toString());
    return (e instanceof Left) ? leftFun(e._value) : rightFun(e._value);
}

