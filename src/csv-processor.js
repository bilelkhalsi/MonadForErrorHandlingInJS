import _ from 'lodash';
import { Right, Left, Either } from './api';

const API_CSV_HEADERS = "timestamp,content,viewed,href";
const API_CSV_BODY = "\
2018-10-27T05:33:34+00:00,@madhatter invited you to tea,unread,https://example.com/invite/tea/3801;\
2018-10-jj,@queenofhearts mentioned you in 'Croquet Tournament' discussion,viewed,https://example.com/discussions/croquet/1168;\
2018-10-25T03:50:08+00:00,@cheshirecat sent you a grin,unread,https://example.com/interactions/grin/88\
";

const rowToMessage = _.template(`
    <li class="Message Message--<%= viewed %>">
        <a href="<%= href %>" class="Message-link"><%= content %></a>
        <time datetime="<%= timestamp %>"><%= datestr %></time>
    </li>
`);

const showError = _.template(`<li class="Error"><%= message %></li>`);

/**
* This method process all the csv rows
*/
export function processRows() {
    return rows().map(processRow).join('\n');
}

/**
* This method process a single row 
* @param {*} headerFields an array of header fields
* @param {*} row a csv row.
*/
export function processRow(row) {
    const rowObjWithDate = Either.right(row)
        .map(rowFields)
        .flatMap(zipRowHighOrderFn(header))
        .flatMap(addDateStr);
    return either(showError, rowToMessage, rowObjWithDate);
}


/**
 * Csv header getter.
 */
function header() {
    return API_CSV_HEADERS.split(',').filter(h => !!h);
}

/**
* Csv body rows getter.
*/
function rows() {
    return API_CSV_BODY.split(';').filter(r => !!r);
}

/**
 * Return an array of row fields.
 * @param csv row 
 */
function rowFields(row) {
    return row.split(',');
}

/**
 * High order function that take header supplier and return row fields.
 * @param {*} headerSupplier header supplier
 */
function zipRowHighOrderFn(headerSupplier = () => []) {
    return rowFields => headerSupplier().length !== rowFields.length ?
        Either.left(new Error('Row has an unexpected number of fields'))
        : Either.right(_.zipObject(headerSupplier(), rowFields));
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

