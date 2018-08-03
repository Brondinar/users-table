export default class AbstractModel {

	get urlRead() {
		throw new Error('This is abstract method');
	}

	get urlReadOptions() {
		throw new Error('This is abstract method');
	}

	load() {
		return fetch(this.urlRead, this.urlReadOptions)
		  .then(response => response.json());
	}
}