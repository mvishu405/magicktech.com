
const GLOBAL = require('../constant');

export default class PricemappingService {
    constructor(domain) {
        this.domain = domain || GLOBAL.BASE_URL;
        this.fetch = this.fetch.bind(this);
        this.add = this.add.bind(this);

    }

    get(id) {
      return this.fetch(`${this.domain}api/v2/pricemapping/get/`+id, {
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
      return this.fetch(`${this.domain}api/v2/pricemapping/delete/`+id, {
          method: 'POST',
          crossDomain:true,
          body: JSON.stringify({
              id
          })
      }).then(res => {
          return Promise.resolve(res);
      });
    }

     list(page,pageSize,sorted,filtered) {
      return this.fetch(`${this.domain}api/v2/pricemapping/lists`, {
			method: 'POST',
			body:JSON.stringify({page,pageSize,sorted,filtered}),	  
			crossDomain:true
      }).then(res => {
          return Promise.resolve(res);
      });
    }

    update(id, code_id, component_id, cost) {
        return this.fetch(`${this.domain}api/v2/pricemapping/update`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
                id, code_id, component_id, cost
            })
        }).then(res => {
            return Promise.resolve(res);
        });
    }

    add(code_id, component_id, cost) {
        return this.fetch(`${this.domain}api/v2/pricemapping/add`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
              code_id, component_id, cost
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
