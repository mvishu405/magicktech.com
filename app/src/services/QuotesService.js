
const GLOBAL = require('../constant');

export default class QuotesService {
    constructor(domain) {
        this.domain = domain || GLOBAL.BASE_URL;
        this.fetch = this.fetch.bind(this);
        this.add = this.add.bind(this);

    }

    get(id) {
      return this.fetch(`${this.domain}api/v2/quotes/get/`+id, {
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
      return this.fetch(`${this.domain}api/v2/quotes/delete/`+id, {
          method: 'POST',
          crossDomain:true,
          body: JSON.stringify({
              id
          })
      }).then(res => {
          return Promise.resolve(res);
      });
    }

    list(dealer_id, user_type) {
      return this.fetch(`${this.domain}api/v2/quotes/api_lists`, {
          method: 'POST',
          crossDomain:true,
          body: JSON.stringify({
              dealer_id, user_type
          })		  
      }).then(res => {
          return Promise.resolve(res);
      });
    }

    update(id, code, description, width, depth, height, cabinet_type) {
        return this.fetch(`${this.domain}api/v2/quotes/update`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
                id, code, description, width, depth, height, cabinet_type
            })
        }).then(res => {
            return Promise.resolve(res);
        });
    }

    add(code, description, width, depth, height, cabinet_type) {
        return this.fetch(`${this.domain}api/v2/quotes/add`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
              code, description, width, depth, height, cabinet_type
            })
        }).then(res => {
            return Promise.resolve(res);
        });
    }

    add(quote_id, admin_discount, admin_square_feet, status) {
        return this.fetch(`${this.domain}api/v2/quotes/quote_gen_admindiscount`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
              quote_id, admin_discount, admin_square_feet, status
            })
        }).then(res => {
            return Promise.resolve(res);
        });
    }
	
    quote_clone(quote_id, customer_id) {
        return this.fetch(`${this.domain}api/v2/quotes/quote_clone`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
              quote_id, customer_id
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
