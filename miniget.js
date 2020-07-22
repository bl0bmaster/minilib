function get(option){
	return fetch(option.url).then(function (response) {
		return response.text();
	}).then(function (data) {
		if( option.type && option.type.toLowerCase()  == 'html' ){
			var parser = new DOMParser();
			return parser.parseFromString(data, 'text/html');
		}
		return data;
	}).catch(function (err) {
		// There was an error
		console.warn('Something went wrong.', err);
	});
}
export {get};