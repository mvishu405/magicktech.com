const GLOBAL = require('../constant');
export function add_line_item_post_data(type, postData) {
	let BaseURL = GLOBAL.BASE_URL+'api/v2/quotes/add_quote_line_item';
	var headers = {
		origin: ["*"],
		authorization:JSON.parse(localStorage.getItem('token'))
	};	
	return new Promise((resolve, reject) =>{
	fetch(BaseURL, {
		method: 'POST',
		headers,
		body: JSON.stringify(postData)
	}).then(
		response => response.json()
	).then((json) => {
		resolve(json);
	}).catch((error) => {
		reject(error);
	});
	});
}
