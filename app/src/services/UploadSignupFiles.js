const GLOBAL = require('../constant');
export function UploadSignupFiles(pdfdata) {
	let BaseURL = GLOBAL.BASE_URL+'api/v2/Quotes/UploadSignupFiles';
	var headers = {
		origin: ["*"],
		authorization:JSON.parse(localStorage.getItem('token'))
	};	
	return new Promise((resolve, reject) =>{
	fetch(BaseURL, {
		method: 'POST',
		headers,
		body: JSON.stringify(pdfdata)
	}).then(
		response => response.json()
	).then((json) => {
		resolve(json);
	}).catch((error) => {
		reject(error);
	});
	});
}



