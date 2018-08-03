import {addBlock, removeBlock} from './view-manager';

export default class AbstractView {

  get template() {
    throw new Error('This is abstract method');
  }

  get element() {
    if (!this._element) {
      this._element = this._render();
      this.bind();
    }

    return this._element;
  }

  add() {
    addBlock(this);
  }

  update() {

  }

  bind() {

  }

  unbind() {

  }

  _render() {
    return this._createElement(this.template);
  }

  _createElement(template) {
    let elem = document.createElement('div');

    elem.innerHTML = template;

    return elem;
  }

}
