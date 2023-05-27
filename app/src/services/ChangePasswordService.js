const GLOBAL = require('../constant');
export function change_password_post_data(type, userData) {
	let BaseURL = GLOBAL.BASE_URL+'api/v2/login/change_password';
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
