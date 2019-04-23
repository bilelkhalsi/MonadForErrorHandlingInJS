import _ from 'lodash';
import { csvToMessages } from './csv-processor';

const API_CSV_BODY = "timestamp,content,viewed,href\n\
2018-10-27T05:33:34+00:00,@madhatter invited you to tea,unread,https://example.com/invite/tea/3801\n\
2018-10-jj,@queenofhearts mentioned you in 'Croquet Tournament' discussion,viewed,https://example.com/discussions/croquet/1168\n\
2018-10-25T03:50:08+00:00,@cheshirecat sent you a grin,unread,https://example.com/interactions/grin/88\
";

export default class {

  constructor(rootElement) {
    this.rootElement = rootElement;
  }

  render() {
    const content = csvToMessages(API_CSV_BODY);
    console.log('HTML generated from CSV data : ', content);
    this.rootElement.innerHTML = content;
  }

};