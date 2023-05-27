
const GLOBAL = require('../constant');

export default class ComponentService {
    constructor(domain) {
        this.domain = domain || GLOBAL.BASE_URL;
        this.fetch = this.fetch.bind(this);
        this.add = this.add.bind(this);

    }

    get(id) {
      return this.fetch(`${this.domain}api/v2/warranty_order_form/get/`+id, {
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
      return this.fetch(`${this.domain}api/v2/warranty_order_form/delete/`+id, {
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
      return this.fetch(`${this.domain}api/v2/warranty_order_form/lists`, {
          method: 'GET',
          crossDomain:true
      }).then(res => {
          return Promise.resolve(res);
      });
    }

    update(id,customer_name,customer_address,customer_city,customer_postalcode,customer_email,customer_order,customer_dateoforder,customer_lowesstore,customer_doorname,customer_detail, cabinetRowData, removedlines) {
        return this.fetch(`${this.domain}api/v2/warranty_order_form/update`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
                id,customer_name,customer_address,customer_city,customer_postalcode,customer_email,customer_order,customer_dateoforder,customer_lowesstore,customer_doorname,customer_detail, cabinetRowData, removedlines
            })
        }).then(res => {
            return Promise.resolve(res);
        });
    }

    add(customer_name,customer_address,customer_city,customer_postalcode,customer_email,customer_order,customer_dateoforder,customer_lowesstore,customer_doorname,customer_detail, cabinetRowData) {
        return this.fetch(`${this.domain}api/v2/warranty_order_form/add`, {
            method: 'POST',
            crossDomain:true,
            body: JSON.stringify({
              customer_name,customer_address,customer_city,customer_postalcode,customer_email,customer_order,customer_dateoforder,customer_lowesstore,customer_doorname,customer_detail, cabinetRowData
            })
        }).then(res => {
            return Promise.resolve(res);
        });
    }

    fetch(url, options) {
		var headers = {
			origin: ["*"],
			Authorization:JSON.parse(localStorage.getItem('token'))
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
