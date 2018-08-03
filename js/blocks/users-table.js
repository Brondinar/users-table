import UsersTableView from './users-table-view';
import Application from '../application';
import {sortArrayOfObjects} from '../utils'

export default class UsersTable {
  
  constructor(users) {
    Application.users.data.forEach((user, i) => {
      user.id = i;
    });

    this._sortingData = {}
  }

  init() {
    if (this._view) {
      this._view.unbind();
    }

    this._view = new UsersTableView();
    this._view.add();
    this._bindElementsToModel();

    // Сортирует пользователей и обновляет представление
    this._view.onSortColumn = (e) => {
      if (!e.target.classList.contains('th')) return;

      let key = e.target.dataset.name;

      if (this._sortingData[key]) {
        this._sortingData[key]++;
        if (this._sortingData[key] > 2) {
          delete this._sortingData[key];
        }
      } else {
        this._sortingData = {};
        this._sortingData[key] = 1;
      }

      if (this._sortingData[key]) {
        Application.users.data = sortArrayOfObjects(Application.users.data, key, this._sortingData[key]);
      } else {
        Application.users.data = sortArrayOfObjects(Application.users.data, 'id', 1);
      }

      this._view.update(Application.users.data);
    }

    // Удаляет пользователя и обновляет представление
    this._view.onDeleteRow = (e) => {
      if (!e.target.closest('.tbody-tr')) return;
      if (e.ctrlKey || e.metaKey) {
        let id = +e.target.closest('.tbody-tr').dataset.id;
        let userIndex = Application.users.data.findIndex((user) => user.id === id);

        Application.users.data.splice(userIndex, 1);

        this.reload();
      } 
    }

  }

  reload() {
    this._view.update(Application.users.data);
  }

  // Привязывает элементы DOM (строки таблицы) к соответствующему объекту-пользователю  
  _bindElementsToModel() {
    let elements = this._view.rows;

    Application.users.data.forEach((user, i) => {
      user.element = elements[i];
    });
  }


  //---------------------- Далее - функции-обработчики событий. ---------------
  

  /**
   * Фильтрует пользователей согласно введенному запросу. Каждому объекту-пользователю,
   * не прошедшему фильтр, присваивается свойство hidden = true.
   * 
   * @param  {Array} users Массив объектов-пользователей
   * @param  {String} value Фильтр
   * @return {Array}       Отфильтрованный массив пользователей.
   */
  filterUsers(users, value) {
    let re = _getRegExp(value);

    for (let user of users) {
      if (re.test(user.name)) {
        user.hidden = false;
      } else {
        user.hidden = true;
      }
    }

    this.reload();
    return users;

    /**
     * Возвращает регулярное выражение для фильтра пользователей
     * согласно следующему паттерну:
     *  1) регистронезависимо;
     *  2) если слово начинается со знака "*", ищет подстроку, иначе - по началу строки;
     *  3) пробел в запросе означает операцию "ИЛИ".
     * 
     * @param  {string} value Запрос, введенный пользователем
     * @return {RegExp}       Регулярное выражение
     */
    function _getRegExp(value) {
      let queries = value.split(' ');
      let re = '';

      for (let query of queries) {
        if (/\w/.test(query)) {
          re += '(';
          if(!/^\*/.test(query)) re += '^';
          re += query.match(/\w+/gi).join('');
          re += ')';
        }
      }

      re = re.replace(/\)\(/g, ')|(');
      re = new RegExp(re, 'i');

      return re;
    }
  }

}
