const GLOBAL = require('../constant');
var dateFormat = require('dateformat');

export default class DealersService {
    constructor(domain) {
        this.domain = domain || GLOBAL.BASE_URL;
        this.fetch = this.fetch.bind(this);
        this.add = this.add.bind(this);

    }

    get(id) {
      return this.fetch(`${this.domain}api/v2/dealer/get/`+id, {
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
      return this.fetch(`${this.domain}api/v2/dealer/delete/`+id, {
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
      return this.fetch(`${this.domain}api/v2/dealer/lists`, {
          method: 'GET',
          crossDomain:true
      }).then(res => {
          return Promise.resolve(res);
      });
    }

    update(id, user_name, logo, password, state, city, address, user_type) {
      var timestamp = Date.now();		
        return this.fetch(`${this.domain}api/v2/dealer/update`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
                id,
                user_name,
				logo,
                password,
                state,
                city,
                address,
                user_type
            })
        }).then(res => {
            return Promise.resolve(res);
        });
    }

    add(user_name, phone, email, logo, password, state, city, address, user_type, label) {
        return this.fetch(`${this.domain}api/v2/dealer/add`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
              user_name,
              phone,
              email,
			  logo,
              password,
              state,
              city,
              address,
              user_type,
			  label
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
