import { get } from './miniget.js';
import {query } from './minicommons.js';
import minimark from './minimark.js';

const dd=document;
let contenu=null;

function read(path){
	return new Promise(function(resolve, reject){
		get({url:`./blog/${path}`, type :'html'}).then(function(data){
			console.log( data );
			resolve(query(data, "a").filter((a)=>a.getAttribute('href').indexOf( "./") == 0 ));
		}).catch((error) => {
			reject(error);
		});
	});
}

function loadHash(){
	console.log( '' );
	var blog = atob( `${window.location.href}`.replace(/.*#BLOG-/, '' ) );
	if( contenu && blog ){
		get({url:`./blog/${blog}/readme.md?${new Date().getTime()}`}).then(function(data){
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
		console.log( dom, content, data, data.role );
		return read('').then((all)=>all.forEach((a)=> {
			var listElement = dd.createElement("li");
			var link = dd.createElement("a");
			var linkValue = `#BLOG-${btoa(a.getAttribute('href'))}`;
			var linkDesc = `${a.getAttribute('href').substr(28)}`;
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