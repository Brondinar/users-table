/**
 * Возвращает позицию заданного элемента относительно его родителя
 * 
 * @param  {HTMLElement} element Элемент, позицию которого требуется найти
 * @return {number}              Позиция элемента
 */
export function getElementPosition (element) {
  let i = 0;

  while (element = element.previousElementSibling) {
    i++;
  }

  return i;
}

/**
 * Преобразовывает дату из строчного в следующий формат: %hour:%minute %day.%month.%year (12:30 21.04.2014)
 * @param  {string} date Дата в строчном формате
 * @return {string}      Дата в заданном формате
 */
export function getNormalDate(date) {
  let nDate = new Date(date);
  let t = nDate.toLocaleString('ru', {'hour': 'numeric', 'minute': 'numeric'});
  let d = nDate.toLocaleString('ru', {'day': 'numeric', 'month': 'numeric', 'year': 'numeric'});

  return t + ' ' + d;
}

/**
 * Сортирует массив объектов по указанному ключу и методу
 * @param  {Array} arr    Массив объектов, который требуется отсортировать
 * @param  {String} key    Ключ, по которому требуется провести сортировку
 * @param  {Number} method Метод сортировки: если 1 - сортирует от меньшего к большему,
 *                                           если 2 - соритрует от большего к меньшему
 *                                           по-умолчанию: 1.
 * @return {Array}        Отсортированный массив объектов
 */
export function sortArrayOfObjects(arr, key, method = 1) {
  let type = typeof arr[0][key];

  let sortedArray;
  if (method === 1) {
    if (type === 'string') return arr.sort((a, b) => a[key].localeCompare(b[key]));
    else if (type === 'number') return arr.sort((a, b) => a[key] - b[key]);
  } else if (method === 2) {
    if (type === 'string') return arr.sort((a, b) => b[key].localeCompare(a[key]));
    else if (type === 'number') return arr.sort((a, b) => b[key] - a[key]);
  } else {
    throw new Error('Method is not supported');
  }
}

/**
 * Ищет в массиве объектов объект по указанному ключу и значению
 *  
 * @param  {Array}  array    Массив объектов
 * @param  {String} property Свойство объекта
 * @param  {String} value    Значение объекта
 * @return {Object}          Искомый объект
 */
export function getObjectFromArray(array, property, value) {
  return array.find((obj) => obj[property] === value);
}