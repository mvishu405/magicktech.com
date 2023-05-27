const GLOBAL = require('../constant');
export function expire_data_req(expire_data_req) {
	//console.log(user);
	let BaseURL = GLOBAL.BASE_URL+'api/v2/login/expire_data_req';
	return new Promise((resolve, reject) =>{
	fetch(BaseURL, {
		method: 'POST',
		body: JSON.stringify(expire_data_req)
	}).then(
		response => response.json()
	).then((json) => {
		resolve(json);
	}).catch((error) => {
		reject(error);
	});
	});
}





