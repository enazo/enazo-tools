const { httpRequest } = window.enazoToolsEnhanceFunctions;




const trim = text=>{
	return String(text).trim();
};

const 去除网页标记 = function(html){
	html+='';
	html=trim(html.replace(/<.+?>/g,''));

	return html;
};

const getMatch = (text,regex,index) =>{
	try{
		return String(text).match(regex)[index].trim() || undefined;
	}catch(e){
		return undefined;
	}
}



const forEach = (arr, next, onOver, runNum = 1) => {
    let index = 0;
    
    const nextFn = () => {
        if(index >= arr.length){
            onOver();
            return;
        }

        next(arr[index], index, nextFn);
        index++;
    };
    for(let i = 0; i < runNum; i++)
        nextFn();
}




const $ = (selector, context = document) => context.querySelector(selector);

