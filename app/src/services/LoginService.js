const GLOBAL = require('../constant');
export function login_post_data(type, userData) {
	let BaseURL = GLOBAL.BASE_URL+'api/v2/login/verify_user';
	return new Promise((resolve, reject) =>{
	fetch(BaseURL, {
		method: 'POST',
		body: JSON.stringify(userData)
	}).then(
		response => response.json()
	).then((json) => {
		resolve(json);
	}).catch((error) => {
		reject(error);
	});
	});
}
