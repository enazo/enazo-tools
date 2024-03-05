const { httpRequest } = window.enazoToolsEnhanceFunctions;

export default class BaseAdapter {
    get baseApi() {
        throw "未定义的API"
    }
    get name() {
        return "未知数据源"
    }

    generateSearchResult(textList) {
        let id = this.constructor.name
        let name = this.name + "源:"
        let lists = ''
        for (let text of textList) {
            lists += `<li>${text}</li>`
        }
        return `<div id="${id}"><h3>${name}</h3><ul>${lists}</ul></div>`
    }

    searchOnce(srsearch, onSuccess, extra = {}) {
        let params = Object.assign({
            action: "query",
            list: "search",
            srsearch: srsearch,
            format: "json",
            srprop: "",
        }, extra)
        this.request(params, res => {
            onSuccess(res.query.search ?? [])
        })
    }

    request(params, onSuccess, onError = null) {
        let url = this.baseApi + "?origin=*";
        Object.keys(params).forEach(key => {
            url += "&" + key + "=" + params[key];
        });
        httpRequest({
            method: 'GET',
            url,
            responseType: 'json',
            headers: {
            },
            onload(res){
                const html = res.response;
                onSuccess(html);
            },
            onerror(e){
                console.error('moe error',e);
                if (onError) onError(e)
            }
        });
    }

}