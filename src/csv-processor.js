
import _ from 'lodash';

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
 * Suppose we have a csv file to parse.
 */
export default class {


    constructor() {
        this.headers
    }

    /**
     * Csv header getter.
     */
    header() {
        return API_CSV_HEADERS.split(',').filter(h=>!!h);
    }

    /**
     * Csv body rows getter.
     */
    rows() {
        return API_CSV_BODY.split(';').filter(r =>!!r);
    }

    /**
     * Return an array of row fields.
     * @param csv row 
     */
    _rowFields(row) {
        return row.split(',');
    }

    /**
     * Return an object {header: value}.
     * @param {*} headerFields an array of header fields.
     * @param {*} rowFields an array of row fields.
     */
    _zipRow(headerFields, rowFields) {
        if (headerFields.length !== rowFields.length) {
            return null;
        }
        return _.zipObject(headerFields, rowFields);
    }


    /**
     * This method process a single row 
     * @param {*} headerFields an array of header fields
     * @param {*} row a csv row.
     */
    processRow(headerFields, row) {
        const fields = this._rowFields(row);
        const rowObj = this._zipRow(headerFields, fields);
        if (rowObj === null) {
            return showError(new Error('Encountered a row with an unexpected number of items'));
        }
        const rowObjWithDate = this._addDateStr(rowObj);
        if (rowObjWithDate === null) {
            return showError(new Error('Unable to parse date in row object'));
        }
        return rowToMessage(rowObjWithDate);
    }

    /**
     * This method format timestamp to human readable date.
     * @param {*} messageObj row object
     */
    _addDateStr(messageObj) {
        const errMsg = 'Unable to parse date stamp in message object';
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];
        const d = new Date(messageObj.timestamp);
        if (isNaN(d)) {
            return null;
        }

        const datestr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
        return { datestr, ...messageObj };
    }


}