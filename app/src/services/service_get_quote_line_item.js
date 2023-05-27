const GLOBAL = require('../constant');
export function get_quote_line_item(quoteId) {
	let BaseURL = GLOBAL.BASE_URL+'api/v2/quotes/get_quote_line_items';
	var headers = {
		origin: ["*"],
		authorization:JSON.parse(localStorage.getItem('token'))
	};	
	return new Promise((resolve, reject) =>{
	fetch(BaseURL, {
		method: 'POST',
		headers,
		body: JSON.stringify(quoteId)
	}).then(
		response => response.json()
	).then((json) => {
		resolve(json);
	}).catch((error) => {
		reject(error);
	});
	});
}
