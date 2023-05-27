
const GLOBAL = require('../constant');

export default class AccessoriesService {
    constructor(domain) {
        this.domain = domain || GLOBAL.BASE_URL;
        this.fetch = this.fetch.bind(this);
        this.add = this.add.bind(this);

    }

    get(id) {
      return this.fetch(`${this.domain}api/v2/accessories/get/`+id, {
          method: 'POST',
          crossDomain:true,
          body: JSON.stringify({
              id
          })
      }).then(res => {
          return Promise.resolve(res);
      });
    }

    delete(id) {
      return this.fetch(`${this.domain}api/v2/accessories/delete/`+id, {
          method: 'POST',
          crossDomain:true,
          body: JSON.stringify({
              id
          })
      }).then(res => {
          return Promise.resolve(res);
      });
    }

    list() {
      return this.fetch(`${this.domain}api/v2/accessories/lists`, {
          method: 'GET',
          crossDomain:true
      }).then(res => {
          return Promise.resolve(res);
      });
    }

    update(id, name, code, price) {
        return this.fetch(`${this.domain}api/v2/accessories/update`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
                id, name, code, price
            })
        }).then(res => {
            return Promise.resolve(res);
        });
    }

    add(name, code, price) {
        return this.fetch(`${this.domain}api/v2/accessories/add`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
              name, code, price
            })
        }).then(res => {
            return Promise.resolve(res);
        });
    }

    fetch(url, options) {
		var headers = {
			origin: ["*"],
			authorization:JSON.parse(localStorage.getItem('token'))
		};

        return fetch(url, {
            headers,
            ...options
        })
        .then(this._checkStatus)
        .then(response => response.json())
    }

    _checkStatus(response) {
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        } else {
            var error = new Error(response.statusText)
            error.message = response.json();
            throw error
        }
    }
}
