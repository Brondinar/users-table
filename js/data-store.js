export default class DataStore {

	constructor(newData) {
		this._data = newData;
	}

	get data() {
		return this._data;
	}

	set data(newData) {
		this._data = newData;
	}
}