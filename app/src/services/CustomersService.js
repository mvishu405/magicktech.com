const GLOBAL = require('../constant');
var dateFormat = require('dateformat');

export default class CustomersService {
    constructor(domain) {
        this.domain = domain || GLOBAL.BASE_URL;
        this.fetch = this.fetch.bind(this);
        this.add = this.add.bind(this);		
    }

    get(id) {
      return this.fetch(`${this.domain}api/v2/customers/get/`+id, {
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
      return this.fetch(`${this.domain}api/v2/customers/delete/`+id, {
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
      return this.fetch(`${this.domain}api/v2/customers/lists`, {
          method: 'POST',
          crossDomain:true, 
      }).then(res => {
          return Promise.resolve(res);
      });
    }

    update(id, name, alternate_phone, state, city, address, comments, lead_source) {
        return this.fetch(`${this.domain}api/v2/customers/update`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
                id, name, alternate_phone, state, city, address, comments, lead_source
            })
        }).then(res => {
            return Promise.resolve(res);
        });
    }

    add(name, email, phone, alternate_phone, state, city, address, comments, lead_source, dealer_id) {
        return this.fetch(`${this.domain}api/v2/customers/add`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
              name, email, phone, alternate_phone, state, city, address, comments, lead_source, dealer_id
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
