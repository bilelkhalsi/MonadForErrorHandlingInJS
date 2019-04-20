import _ from 'lodash';
import Processor from './csv-processor';

export default class {
  
  constructor(rootElement) {
    this.parser = new Processor();
    this.rootElement = rootElement;
  }
  
  render() {
    const header = this.parser.header();
    const content = this.parser.rows().map(row => this.parser.processRow(header, row)).join('\n');
    // const compiled = _.template('<h2 style="text-align:center;"><%- value %></2>');
    console.log(content);
    this.rootElement.innerHTML = content;
  }
  
};