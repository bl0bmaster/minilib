import minilight from "./minilight.js";

const isEmptyLineBefore="b";
const isCode="c";
const wasCode="o";
const codeBuffer="t";
const RETURN_CHAR="\n";

const blockTagFactory = (tagName) => {
    return (element) => {
        return `<${tagName}>${element}</${tagName}>`;
    }
}

const previousBlockTagFactory = (tagName) => {
    return (element, state, destination, ligne) => {
        if( destination.length ){
            destination[destination.length-1]=`<${tagName}>${destination[destination.length-1]}</${tagName}>`;
        }
        return "";
    }
}

const normalBlockTypeParser=(()=>{
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
        [/^\s*$/,(element, state)=>{
            	state[isEmptyLineBefore]=1;
            	return "<br/>";
        	}
        ],
        [/^    /,(element, state)=> {
        	state[isCode] = 1;
        	return element;
        }],
        [/^.*$/, (element, state, destination, ligne) => ligne ],
    ];
    const blockFilterMap = (state, destination, ligne, re, filter) => {
		let result = filter( ligne.replace(re,""), state, destination, ligne);
		if( state[isCode] && state[wasCode]){
			state[codeBuffer].push(result);
			return "";
		}
		if( state[isCode] && !state[wasCode]){
			state[codeBuffer] = []
			state[codeBuffer].push(result);
			return "";
		}
		if( !state[isCode] && state[wasCode]){
			state[codeBuffer].push(result);
			result = minilight( 0, state[codeBuffer].join(RETURN_CHAR) );
			state[codeBuffer] = [];
		}
		return result;
    }
    return (state, destination, ligne) => {
        state[isEmptyLineBefore]=0;
    	state[wasCode]=state[isCode];
        state[isCode]=0;
        return blockFilterMap(
        			state,
        			destination,
        			ligne,
        			...blocksFilters.find(
        					(filter) => ligne.match(filter[0])
					)
		);
    }
})()

function minimark(outer, str){
	const state = {
        [isEmptyLineBefore] :0,
        [isCode] :0,
        [codeBuffer] :[]
    };
    const parser = (destination, ligne)=>{
        const result = normalBlockTypeParser(state, destination, ligne);
        destination.push(result);      
        return destination;
    };
    outer.innerHTML = str.split(RETURN_CHAR).reduce(parser,[]).join(RETURN_CHAR);
}

export default minimark;
