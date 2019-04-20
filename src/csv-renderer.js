import _ from 'lodash';
import {processRows} from './csv-processor';

export default class {
  
  constructor(rootElement) {
    this.rootElement = rootElement;
  }
  
  render() {
    const content = processRows();
    console.log(content);
    this.rootElement.innerHTML = content;
  }
  
};