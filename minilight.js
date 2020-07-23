/**
 * Minilight. GPL	
 * 
 * Librairie permettant de highlighter n'importe que code en moins de 2ko.
 * 
 * Usage :
 * 
 * <pre>
 * 		<_script type="module" src="./minified/minilib.js"></_script>
 * 		<_script >
 *   	document.querySelectorAll("[type="minilight"]").forEach((e)=>{
 *   		var container = dd.createElement("div" );
 *	 	    e.parentNode.insertBefore(container, e);
 *	 	    e.style.display='none';
 *	 	    minilight(container, e.innerText);
 *   	});
 * 		</_script>
 *     <_code type="minilight">
 *     		Le code à afficher ici ...
 *     </_code>
 * </pre>
 * 
 */

// La liste des mots qui seront considérés comme des "mots du langage"
// Cette liste contient de quoi matcher le SQL, le Basic le python le ruby et la pluspart des dérivés du C.
const wordsList=`abstract{and{array{as{asc{assert{boolean{break{by{byte{case{catch{char{class{const{continue{debugger{def{default{del{delete{desc{distinct{do{double{elif{else{empty{except{exec{exports{extends{false{filter{final{finally{float{for{foreach{from{function{global{goto{if{implements{import{in{instanceof{int{interface{is{join{lambda{let{long{map{module{native{new{not{null{or{order{package{pass{print{private{protected{public{raise{range{reduce{requires{return{select{short{static{string{super{switch{synchronized{this{throw{throws{transient{true{try{typeof{unused{var{void{volatile{where{while{with{yield`;

// La root classe est volontairement chelou pour éviter les collisions avec d'autres librairies.
const rootClass = "ml7e4 ";

// Ces 2 valiables sont là juste pour gratter qlq octets à la minification 
const cssColor = "{color:#";
const cssBackground=";background:#";

/* Les 3 lignes si dessous paraissent stupide mais elles font gagner des octets à la minification
 * Par exemple _RexExp vas devenir R pendant la minification.
 * Si j'utilise un élément JS très souvent ça fait gagner quelque caractères.
 */
const _document=document;
const _RegExp=RegExp;

function _match(aRegExp, aString){
	return aString.match(aRegExp);
}
// fabrique les Objets qui définissent les différents block de couleur
function blockFactory(b/* egin */, end, s/* tyle */){
	// Si a est une regexp en .* c'est pour gérer les cas ou la fin contient plusieurs caractères spéciaux.
	return {   	a/* fter */ : _RegExp(`.*${end}$$`), // finit par d'ou le .* au début
	            b/* egin */,
	            s/* tyle */,
	            z/* e very begin */ : _RegExp( `(.*)${b}\$` ) // Commence par le (.*) permet de récupérer l'espace avant 
    };
}
// Global configuration
const blocks = [
    blockFactory('"','"',"d"),/* double quote string */
    blockFactory("'","'","s"),/* single quote string */ 
    blockFactory("//","\n","c"),/* single comment */
    blockFactory("#","\n","c"),/* single comment */
    blockFactory("/\\*","\\*/","m"),/* multilineComment \\* pour neutraliser dans la RE */ 
];
const _keyWords=wordsList.split("{").map(kw=>_RegExp(`^${kw}\$`, "gi")); // Je transforme les mots clef en RE

/* Au chargement de la page j'ajoute le style.
 * Le style n'est pas paramétrable.
 * Mais comme il est inséré au début du head, n'importe quelle CSS le surchargera.
 * Il est donc possible de charger son propre style en l'incluant dans son head tout simplement.
 * 
 * J'utilise pas les class mais la présence d'attribut d c n k z pour détecter le style à appliquer.
 * Ça n'est qu'une astuce pour économiser quelques octets.
 *  
 */ 
/* window. */addEventListener("load", ()=>{
    _document.querySelector('head').insertAdjacentHTML('afterbegin', `<style>
.${rootClass}${cssColor}777}
.${rootClass}i{font-style:normal}
.${rootClass}[d],.${rootClass}[s]${cssColor}339${cssBackground}F5F5FF}
.${rootClass}[c],.${rootClass}[m]${cssColor}5B5}
.${rootClass}[n]${cssColor}f90${cssBackground}FFE}
.${rootClass}[k]${cssColor}B55}
.${rootClass}[z]${cssColor}000;font-weight:600;letter-spacing:0.1rem}
</style>`);
});

/*
 * Cette fonction retourne une chain formatté 
 * selon le type de block de son contexte amène.
 * 
 * @param block
 * @param str
 * @returns
 */
function block_format(block, str){
    return `<i ${block.s}>${str}</i>`;
}
/*
 * Cette fonction retourne le format qui correspond à la chiane passée en paramètre.
 * 
 * Si la chaine est un mot clef on retourne le style "mot clef"
 * Si la chaine est un nombre ... "nombre"
 * Si ... caractère spécial ... "caractère spécial"
 * Sinon on retourne la chaine sans style.
 * 
 * @param str
 * @param mayBeASpecialChar
 * @returns une chaine avec style 
 */
function not_block_format(str,mayBeASpecialChar){
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
    let splittedCode =  code.match(/([^\$\w_]|[\$\w_]+)/g); // devrait être const mais let pour être assemblé avec les autres let par le minifier
    /* splittedCode est un Array qui contient le code a highlighter découper autour des mots.
     * 				- La regexp /([^\$\w_]|[\$\w_]+)/g est en deux parties qui se complètent.
     * 				- La totalité des caractères de "code" sera dans le tableau.
     * 				- Soit la regexp match de l'alpha+$ et alors elle garde ces caractères groupés.
     * 				- Soit la Regexp match "ce qui n'est pas de l'alpha+$" et elles découpe caractère par caractère. 
     *  */
    // State variables
    let block = 0; // 0 c'est plus petit que false ou null il faudrait que je trouve comment paramétrer le minifier pour qu'il remplace null par 0
    let token = ''; // C'est pas 0 car dans certains cas token est utilisé en concaténation. Null ne serait pas bon non plus.
    // Result buffer
    let result = ''; // on "concatène" le highlighting dans cette chaine. 
    let i=0; // le i est hors la boucle car ainsi le minifier var l'assemblé avec les autres 'let' pour ne faire qu'un let.
    // ZE loop !
    for(;i < splittedCode.length;i++){
        if( block ){
        	/* Je ne suis pas à la première itération 
        	 * 	  et je suis en milieu de block.
        	 * 
        	 * J'enrichi le token courant de la valeur déjà identifiée précédemment
        	 * 
        	 * Si le nouveau token se finit par un élément de fin de block 
        	 *   Alors on pousse le token dans le résult avec le bon formattage d'highlighting
        	 *   Puis on RAZ token et block
        	 * 
        	 */
            token = `${token}${splittedCode[i]}` ; // enrichissement
            
            /* On test avec token et pas splittedCode[i] 
             * Et donc on fait un test "finit par" et pas === 
             * Car la "fin d'un block" peut contenir plusieurs caractères spéciaux
             * Typiquement la fin des commentaires multilines an JS.
             * Cependant splittedCode[i] ne contient qu'un caractère spécial à la fois.
             */
            if( _match(block.a,token) ){ // test fin de block
                result+=block_format(block,token); // poussée + format
                token = block=''; // RAZ 
            }
        } else {
        	/* Je viens de finir de traiter un block je vais donc en commencer un nouveau
        	 * 
        	 * Je vais d'abord calculer le token.
        	 * Si l'élément courant est un caractère spécial, 
        	 * 
        	 * Finallement 
        	 * je cherche s'il existe un block candidat pour devenir le suivant avec le token courant comme début
        	 * Et si ce block existe
        	 * Alors il devient le block courant
        	 * Je pousse dans le résultat ce qui précède le marqueur de début de block (typiquement les espaces de début de ligne) 
        	 * Et j'initialise le token block_formatavec le marqueur de début de block
        	 */
        	
        	// calcul token
            if( _match(/[-+\(\)\[\] =."'\n\{\}]+/, splittedCode[i])){
            	// special
                result+=not_block_format(token,1);
                token = splittedCode[i];
            } else {
            	// normal
                token = `${token}${not_block_format(splittedCode[i])}` ;
            }
            // finallement
            if( block = blocks.find(b=>_match(b.z	,token)) ){ // ? nouveau block courant
                result+= token.replace(block.z, "$1"); // ce qui précède
                token = block.b; // token == début de block
            }
        }
    }
    // On A finit on entoure le résultat de balise PRE Parce que c'est du code !
    result = `<pre class="${rootClass}">${result + (token||'')}</pre>`
    
    	
    if( outer) {
    	// on a appelé minilight avec un DOM ou l'attacher.
    	outer.innerHTML = result ;
    }else {
    	// on a appelé minilight en mode "je retourne un string"
    	return result;
    }
}

export default minilight;
