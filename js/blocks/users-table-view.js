import AbstractView from '../abstract-view';
import {getNormalDate, getElementPosition} from '../utils';
import Application from '../application';

export default class UsersTableView extends AbstractView {

  get template() {
    if (!this._theadTemp) {
      this._theadTemp = `<div class="thead-tr">
                          <div class="th th_type_user" data-name="name" data-type="string">Пользователь</div>
                          <div class="th th_type_rating" data-name="rating" data-type="number">Рейтинг</div>
                          <div class="th th_type_stories" data-name="stories" data-type="number">Постов</div>
                          <div class="th th_type_comments" data-name="comments" data-type="number">Комментов</div>
                          <div class="th th_type_date" data-name="date" data-type="string">Зарегистрировался</div>
                        </div>`;
    }

    let rows = this._buildRows(Application.users.data);

    let template = `<div class="users-table">
                      <div class="thead">${this._theadTemp}</div>
                      <div class="tbody">${rows.join('')}</div>
                    </div>`

    return template;

  }

  get rows() {
    return this.element.querySelectorAll('.tbody-tr');
  }


  update(users) {
    this._tbody.innerHTML = '';

    for (let user of users) {
      if (!user.element || user.hidden) continue;
      
      this._tbody.appendChild(user.element);
    }
  }

  bind() {
    this._thead = this.element.querySelector('.thead');
    this._tbody = this.element.querySelector('.tbody');

    this._onSortColumnHandler = (e) => this.onSortColumn(e);

    this._onHighlightColumnHandler = (e) => this.onHighlighColumn(e);

    this._onDeleteRowHandler = (e) => this.onDeleteRow(e);
    this._onDragRowHandler = (e) => this.onDragRow(e);

    if (this._thead) {
      this._thead.addEventListener('mouseover', this._onHighlightColumnHandler);
      this._thead.addEventListener('mouseout', this._onHighlightColumnHandler);
      this._thead.addEventListener('click', this._onSortColumnHandler);
    }

    if (this._tbody) {
      this._tbody.addEventListener('click', this._onDeleteRowHandler);
      this._tbody.addEventListener('mousedown', this._onDragRowHandler);
    }
  }

  unbind() {
    if (this._thead) {
      this._thead.removeEventListener('mouseover', this._onHighlightColumnHandler);
      this._thead.removeEventListener('mouseout', this._onHighlightColumnHandler);
      this._thead.removeEventListener('click', this._onSortColumnHandler);
    }

    if (this._tbody) {
      this._tbody.removeEventListener('click', this._onDeleteRowHandler);
      this._tbody.removeEventListener('click', this._onDragRowHandler);
    }
  }

  // "Подсвечивает" столбец таблицы при наведении на заголовок
  onHighlighColumn(e) {
    let target = e.target;

    if (!target.classList.contains('th')) return;

    let column = getElementPosition(target);
    let rows = this._tbody.querySelectorAll('.tbody-tr');

    for (let row of rows) {
      row.children[column].classList.toggle('td_highlight');
    }

    target.classList.toggle('th_highlight');
  }

  // Обрабатывает событие - перетаскивание строк.
  onDragRow(e) {
    if (!e.target.closest('.drag-drop')) return;

    // сохраняем контекст
    let thisObject = this;
    let elem = e.target.closest('.tbody-tr');

    elem.classList.add('tbody-tr_draggable');
    document.querySelector('body').classList.add('grabbing');

    this._tbody.addEventListener('mousemove', _onMouseMove);
    this._tbody.addEventListener('mouseup', _onMouseUp);

    return false;

    function _onMouseMove(e) {

      this.addEventListener('mouseout', _onMouseOut);

      return false;
    }

    function _onMouseOut(e) {
      if (e.relatedTarget.closest('.tbody-tr')) {
        let secondElem = e.relatedTarget.closest('.tbody-tr');

        if (getElementPosition(secondElem) > getElementPosition(elem)) {
          this.insertBefore(secondElem, elem);
        } else {
          this.insertBefore(elem, secondElem);
        }
      }
    }

    function _onMouseUp(e) {
      document.querySelector('body').classList.remove('grabbing');
      elem.classList.remove('tbody-tr_draggable');
      thisObject._sendRows();
      
      this.removeEventListener('mousemove', _onMouseMove);
      this.removeEventListener('mouseout', _onMouseOut);
      this.removeEventListener('mouseup', _onMouseUp);
    }
  }

  onSortColumn() { }

  onDeleteRow() { }

  _buildRows(users) {
    let rows = [];

    for (let user of users) {

      let normalDate = getNormalDate(user.date);

      let tr = `<div class="tbody-tr tbody-tr_border-bottom" data-id="${user.id}">
                  <div class="td td_type_user" data-value="${user.name}">
                    <span class="td__content td__avatar td_type_user__content">
                      <img class="td_type_user__img" src="${user.avatar}">
                    </span>
                    <span class="td__content td__username td_type_user__content">${user.name}</span>
                  </div>
                  <div class="td td_type_rating" data-value="${user.rating}">
                    <span class="td__content td__rating">${user.rating}</span>
                  </div>
                  <div class="td td_type_stories" data-value="${user.stories}">
                    <span class="td__content td__stories">${user.stories}</span>
                  </div>
                  <div class="td td_type_comments" data-value="${user.comments}">
                    <span class="td__content td__comments">${user.comments}</span></div>
                  <div class="td td_type_date" data-value="${user.date}">
                    <span class="td__content td__normalDate">${normalDate}</span>
                    <div class="drag-drop"><span class="drag-drop__span"></span></div>
                  </div>
                </div>`;

      rows.push(tr);
    }

    return rows;
  }

  // Отправляет строки таблицы в Application
  _sendRows() {
    Application.reloadElements('users', this.element.querySelectorAll('.tbody-tr'));
  }
  
}
