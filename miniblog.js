import { get } from './miniget.js';
import {query } from './minicommons.js';
import minimark from './minimark.js';

const dd=document;
let contenu=null;

function blogRoot(){
    return window.BLOG_ROOT || './blog/';
}


function read(path){
	return new Promise(function(resolve, reject){
		get({url:`${blogRoot()}${path}`, type :'html'}).then(function(data){
			resolve(query(data, "img[alt=\\[DIR\\]]").map(e=>query(e.parentNode.parentNode,"a")[0]).filter((a)=>a.getAttribute('href').endsWith( "/") ));
		}).catch((error) => {
			reject(error);
		});
	});
}

function loadHash(){
    if( `${window.location.href}`.indexOf('#BLOG') < 0 ){
        return;
    }
	var blog = atob( `${window.location.href}`.replace(/.*#BLOG-/, '' ) );
	if( contenu && blog ){
		get({url:`${blogRoot()}${blog}/readme.md?${new Date().getTime()}`}).then(function(data){
			if( data ){
				minimark(contenu, data ); 
			}
		}).catch((error) => {
			reject(error);
		});
	}	
}

window.addEventListener('hashchange', loadHash);

function miniblog( dom,content,data){
	if( data.role && data.role =="contenu" ){
		contenu = dom;
		minimark(dom, content);
	}
	if( data.role && data.role =="menu" ){
		return read('').then((all)=>all.forEach((a)=> {
			var listElement = dd.createElement("li");
			var link = dd.createElement("a");
			var linkValue = `#BLOG-${btoa(a.getAttribute('href'))}`;
			var linkDesc = `${a.getAttribute('href')}`;
 			link.href = linkValue;
			var linkText = dd.createTextNode( linkDesc );
			link.appendChild( linkText );
			listElement.appendChild(link);
			dom.appendChild(listElement);
		}));
	}
	loadHash();
}

export default miniblog;
