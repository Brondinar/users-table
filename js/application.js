import AbstractModel from './abstract-model';
import SearchField from './blocks/search-field';
import UsersTable from './blocks/users-table';
import DataStore from './data-store';
import {getObjectFromArray} from './utils';

class Application {

  constructor() {
    this._model = new class extends AbstractModel {
      get urlRead() {
        return 'https://pikabu.ru/page/interview/frontend/users.php';
      }

      get urlReadOptions() {
        return {'headers': {'X-CSRF-Token': 'interview'}}
      }
    }();
  }

  init() {
    this._model.load()
      .then(
        response => {
          this.users = new DataStore(response);
          this._searchField = new SearchField();
          this._usersTable = new UsersTable();

          this._searchField.init();
          this._usersTable.init();
        })

      .catch(error => {
        console.log(error);
      });
  }

  filterUsers(value) {
    this.users.data = this._usersTable.filterUsers(this.users.data, value);
  }

  /**
   * Получает новый порядок элементов от представлений и обновляет массив данных
   * 
   * @param  {String}    dataName Наименование массива данных в Application
   * @param  {NODE List} elements Коллекция элементов
   * @return {null}
   */
  reloadElements(dataName, elements) {
    let newData = [];

    if (dataName === 'users') {
      elements.forEach((element, i) => {
        let id = +element.dataset.id;
        let user = getObjectFromArray(this.users.data, 'id', id);
        newData.push(user);
      });

      this.users.data = newData;
    } else {
      throw new Error('dataName is not exist');
    }
  }
}

const app = new Application();
export default app;