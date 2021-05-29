import minilight from './minilight.js';
import minimark from './minimark.js';
import miniblog from './miniblog.js';
const dd=document;

function applyPlugin(code, func, tag){
	dd.querySelectorAll(`[type="${code}"]`).forEach((e)=>{
		var container = dd.createElement( tag || "div" );
		e.parentNode.insertBefore(container, e);
		e.style.display='none';
		func(container, e.innerText,e.dataset);
	});
}

window.addEventListener("load", ()=>{
	applyPlugin("minilight", minilight );
	applyPlugin("minimark", minimark );
	applyPlugin("miniblog", miniblog, "ul");
});
