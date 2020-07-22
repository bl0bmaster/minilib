import minilight from "./minilight.js";
function MMStateFactory(){
    return {
        blockType : 'normal',
        emptyLineBefore :false,
        isCode :false
    };
}
function mmEmptyLine(element,state){
    state.emptyLineBefore=true;
    return "<br />";
}

function blockTagFactory(tagName){
    return function(element,state){
        return `<${tagName}>${element}</${tagName}>`;
    }
}
function previousBlockTagFactory(tagName){
    return function(element,state,destination, ligne,index,source){
        if( destination.length > 0){
        	const ligneMoinsUn = destination[destination.length-1];
            destination[destination.length-1]=`<${tagName}>${ligneMoinsUn}</${tagName}>`;
        }
        return "";
    }
}
function identity(i,j,k,ligne){
	return ligne;
}
function code( element,state,destination, ligne,index,source){
	state.isCode = true;
	return element;
}
let codeBuffer=null;
const normalBlockTypeParser=(function(){
    const blocksFilters =[
        [/^>/,blockTagFactory("blockquote")],
        [/^######/,blockTagFactory("h6")],
        [/^#####/,blockTagFactory("h5")],
        [/^####/,blockTagFactory("h4")],
        [/^###/,blockTagFactory("h3")],
        [/^##/,blockTagFactory("h2")],
        [/^#/,blockTagFactory("h1")],
        [/^===*$/,previousBlockTagFactory("h1")],
        [/^---*$/,previousBlockTagFactory("h2")],
        [/^\s*$/,mmEmptyLine],
        [/^    /,code],
        [/^.*$/,identity],
    ];
    function blockFilterFilter(re,filter){
    	return this.ligne.match(re) ;
	}
    function blockFilterMap(re,filter){
        	try{
        		let result = filter(  this.ligne.replace(re,""),
    							this.state,
    							this.destination,
    							this.ligne,
    							this.index,
    							this.source);
    			if( this.state.isCode && this.state.oldCodeStatus){
    				codeBuffer.push(result);
    				return null;
    			}
        		if( this.state.isCode && !this.state.oldCodeStatus){
        			codeBuffer = []
        			codeBuffer.push(result);
        			return null;
        		}
        		if( !this.state.isCode && this.state.oldCodeStatus){
        			codeBuffer.push(result);
    				result = minilight( 0, codeBuffer.join("\n") );
    				codeBuffer = [];
        		}
        		return result;
        	}catch(eee){
        		console.log(eee,re,filter);
        	}
        return null;
    }
        
    return function(state, destination, ligne,index,source){
        state.emptyLineBefore=false;
    	state.oldCodeStatus=state.isCode;
        state.isCode=false;
        return blockFilterMap.apply({state, destination, ligne,index,source}, blocksFilters.find(
        		(filter)=> blockFilterFilter.apply({state, destination, ligne,index,source}, filter )
        ));
    }
})()
function codeBlockTypeParser(state, destination, ligne,index,source) {
    
}

const blockTypeParser = {
    normal : normalBlockTypeParser,
    code : codeBlockTypeParser
}

function MMParserByReduceFactory(_state){
    const state=_state;
    return function(a,e,i,t){
        const result = blockTypeParser[state.blockType](state,a,e,i,t);
        a.push(result);      
        return a;
    }
}

const cleanString = (function(){
    const filters =[
        [/[\c\n\r]/g,""],
        [/\t/g,"    "],
        [/\s/g," "],
    ];    
    return function (str){
        return filter.reduce((a,e)=>a.replaceAll.apply(a,e),str);
    };
})()


function minimark(outer, str){
    const parser =  MMParserByReduceFactory(MMStateFactory());
    outer.innerHTML = str.split("\n").reduce(parser,[]).join("\n");
}

export default minimark;
