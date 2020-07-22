const _Array=[];
function nodesToArray(aNodesList){
	return _Array.slice.call(aNodesList);
}

function query(rootDOM, selector){
	return nodesToArray(rootDOM.querySelectorAll(selector));
}

export { nodesToArray, query } ;