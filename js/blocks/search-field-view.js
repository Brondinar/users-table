import AbstractView from '../abstract-view';

export default class SearchFieldView extends AbstractView {

  get template() {
    return `<div class="search-field">
              <input class="search-field__input" type="text" placeholder="поиск">
              <div class="search-field__button"><span></span></div>
            </div>`;
  }

  bind() {
    this._inputField = this.element.querySelector('.search-field__input');
    this._clearButton = this.element.querySelector('.search-field__button');
    this._onFilterUsersHandler = () => this.onFilterUsers(this._inputField.value);
    this._onClearInputHandler = () => this.onClearInput();

    if (this._inputField) {
      this._inputField.addEventListener('input', this._onFilterUsersHandler);
    }

    if (this._clearButton) {
      this._clearButton.addEventListener('click', this._onClearInputHandler);
    }
  }

  unbind() {
    if (this._inputField) {
      this._inputField.removeEventListener('input', this._onFilerUsersHandler);
    }

    if (this._clearButton) {
      this._clearButton.removeEventListener('click', this._onClearInputHandler);
    }
  }

  onFilterUsers() { }

  // Очищает пользовательский ввод
  onClearInput() {
    this._inputField.value = '';
    let event = new Event('input');
    this._inputField.dispatchEvent(event);
  }
  
}
