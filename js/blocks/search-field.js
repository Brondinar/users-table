import SearchFieldView from './search-field-view';
import Application from '../application';

export default class SearchField {
  
  init() {
    if (this._view) {
      this._view.unbind();
    }

    this._view = new SearchFieldView();
    this._view.add();

    this._view.onFilterUsers = (value) => {
      Application.filterUsers(value);
    }
  }

}
