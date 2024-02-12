const { httpRequest } = window.enazoToolsEnhanceFunctions;

const $ = (selector, context = document) => context.querySelector(selector);

const getBangumiHTML = async (url,onOver,onError = ()=>{}) => {
    const res = httpRequest({
        method: 'GET',
        url,
        responseType: 'text',
        headers: {
            referer: 'https://bangumi.tv/anime/browser/airtime/2023?sort=rank',
        },
        onload(res){
            onOver(res.response);
        },
        onerror(e){
            onError(e);
        }
    });
    return res.responseText;
};


const forEach = (arr, next, onOver) => {
    let index = 0;
    
    const nextFn = () => {
        if(index >= arr.length){
            onOver();
            return;
        }

        next(arr[index], index, nextFn);
        index++;
    };
    nextFn();
}