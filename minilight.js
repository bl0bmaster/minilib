const wordsList=`abstract{and{array{as{asc{assert{boolean{break{by{byte{case{catch{char{class{const{continue{debugger{def{default{del{delete{desc{distinct{do{double{elif{else{empty{except{exec{exports{extends{false{filter{final{finally{float{for{foreach{from{function{global{goto{if{implements{import{in{instanceof{int{interface{is{join{lambda{let{long{map{module{native{new{not{null{or{order{package{pass{print{private{protected{public{raise{range{reduce{requires{return{select{short{static{string{super{switch{synchronized{this{throw{throws{transient{true{try{typeof{unused{var{void{volatile{where{while{with{yield`;
const rootClass = "ml7e4 ";
const cssColor = "{color:#";
const cssBackground=";background:#";
const _document=document;
const _RegExp=RegExp;
function _match(aRegExp, aString){
	return aString.match(aRegExp);
}
function neutralizeStar(str){
    return str.replace(/\*/gi,"\\*");
}
function blockFactory(b/* egin */, end, s/* tyle */){
	return {   	a : _RegExp(`.*${neutralizeStar(end)}$$`),
	            b,
	            s,
	            z : _RegExp( `(.*)${neutralizeStar(b)}\$` )
    };
}
// Global configuration
const blocks = [
    blockFactory('"','"',"d"),/* double quote string */
    blockFactory("'","'","s"),/* single quote string */ 
    blockFactory("//","\n","c"),/* single comment */
    blockFactory("#","\n","c"),/* single comment */
    blockFactory("/*","*/","m"),/* multilineComment */
];
const _keyWords=wordsList.split("{").map(kw=>_RegExp(`^${kw}\$`, "gi"));
addEventListener("load", ()=>{
    var style = _document.createElement("style");
    style.appendChild(_document.createTextNode(`
.${rootClass}${cssColor}777}
.${rootClass}i{font-style:normal}
.${rootClass}[d],.${rootClass}[s]${cssColor}339${cssBackground}F5F5FF}
.${rootClass}[c],.${rootClass}[m]${cssColor}5B5}
.${rootClass}[n]${cssColor}f90${cssBackground}FFE}
.${rootClass}[k]${cssColor}B55}
.${rootClass}[z]${cssColor}000;font-weight:600;letter-spacing:0.1rem}
`));
    _document.documentElement.appendChild(style);
});

function block_format(block, str){
    return `<i ${block.s}>${str}</i>`;
}
function block_before(block,str){
    return str.replace(block.z, "$1");
}
function block_after(block){
    return block.b;
}
const block_atRE = _match;
function keyWords(str,mayBeASpecialChar){
    if(_keyWords.some(kw=>_match(kw, str))){
        return `<i k>${str}</i>`
    }
    if(_match(/^[0-9][-e²+.,/%^0-9]*$/gi,str)){
        return `<i n>${str}</i>`
    }
    if(mayBeASpecialChar && _match(/^[^\w0-9]+$/gi,str)){
        return `<i z>${str}</i>`
    }
    return str;
}

function minilight(outer, code){
    let splittedCode =  code.match(/([^\$\w_]|[\$\w_]+)/g);
    // State variables
    let block = 0;
    let token = '';
    // Result buffer
    let result = '';
    let i=0; 
    // ZE loop !
    for(;i < splittedCode.length;i++){
        if( block ){
            token = `${token}${splittedCode[i]}` ;
            if( block_atRE(block.a,token) ){
                result+=block_format(block,token);
                token = block='';
            }
        } else {
            if( _match(/[-+\(\)\[\] =."'\n\{\}]+/, splittedCode[i])){
                result+=keyWords(token,1);
                token = splittedCode[i];
            } else {
                token = `${token}${keyWords(splittedCode[i],0)}` ;
            }
            if( block = blocks.find(b=>block_atRE(b.z	,token)) ){
                result+= block_before(block,token );
                token = block_after(block); 
            }
        }
    }
    result = `<pre class="${rootClass}">${result + (token||'')}</pre>`
    
    if( outer) {
    	outer.innerHTML = result ;
    }else {
    	return result;
    }
}

export default minilight;
