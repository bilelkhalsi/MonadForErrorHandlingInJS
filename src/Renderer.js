import _ from 'lodash';

export default class {
  
  constructor(rootElement) {
    this.rootElement = rootElement;
  }
  
  render() {
    const compiled = _.template('<h2 style="text-align:center;"><%- value %></2>');
    this.rootElement.innerHTML = compiled( { 'value': 'New es6 project initialized with npm&babel&webpack!' });
  }
  
};