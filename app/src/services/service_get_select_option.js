const GLOBAL = require('../constant');

export function get_select_option() {
	let BaseURL = GLOBAL.BASE_URL+'api/index.php?type=all_components';
	return new Promise((resolve, reject) =>{
	fetch(BaseURL, {
		method: 'GET'
	}).then(
		response => response.json()
	).then((json) => {
		resolve(json);
	}).catch((error) => {
		reject(error);
	});
	});
}
