

db.fetch=db._wrapper.call(fw4wdb('fetch-bangumi',1,{
	key:'url'
}));


const getBangumiHTML = async (url,onOver,onError = ()=>{}) => {
    console.log('getBangumiHTML',url);
    db.fetch.get(url, data => {
        if(data) return onOver(data.html);

        httpRequest({
            method: 'GET',
            url,
            responseType: 'text',
            headers: {
                referer: 'https://bangumi.tv/anime/browser/airtime/2023?sort=rank',
            },
            onload(res){
                const html = res.response;
                // console.log(html);
                onOver(html);
                db.fetch.set({url,html});
            },
            onerror(e){
                console.log('getBangumiHTML error',e);
                onError(e);
            }
        });
    })
};


const InfoKeysConvert = {
    中文名:'cn',
    别名:'alias',
    话数:'ep',
    类型:'type',
    官方网站:'site',
    '性别':'fade',
    '引用来源':'origin',
};


const getSubjectInfoById = (id,isGetAllCharacters = false,onOver) => {
    const url = `https://bangumi.tv/subject/${id}`;
    getBangumiHTML(url, html => {

        const info = fixSubject(id,html);

        if(!isGetAllCharacters) return onOver(info);
        
        getAllCharacterIdsBySubjectInfo(info,characterIds=>{
            // console.log('characterIds',characterIds);

            getCharacterInfosByIds(characterIds,characterInfos=>{
                // console.log('characters',characterInfos);

                info.characters.forEach(character=>{
                    const characterInfo = characterInfos.find(a=>a.id === character.id);

                    if(characterInfo){
                        Object.assign(character,characterInfo);
                    }

                    // 处理 name tags
                    character.nameTags = getCharacterNameTags(character);
                });
                getCharacterCoversI2V(info.characters,()=>{
                    onOver(info);
                })
            });

        });
    });
}


db.bgmImage=db._wrapper.call(fw4wdb('fetch-bangumi-image',1,{
	key:'url'
}));


const imageEl = document.createElement('img');
document.body.appendChild(imageEl);

const downloadImage = (url,onOver) => {
    console.log('downloadImage',url);

    if(/\.png/.test(url)) return onOver();

    db.bgmImage.get(url, data => {
        if(data) {
            
            const blob = new Blob([data.buffer], {type: data.type});
            return onOver(blob);
        }
            
        httpRequest({
            method: 'GET',
            url,
            headers: {
                referer: 'https://bangumi.tv/anime/browser/airtime/2023?sort=rank',
            },
            responseType: 'arraybuffer',
            onload(res){
                // console.log(res);
                const buffer = res.response;

                const headers = res.responseHeaders.split(/[\r\n]+/).map(a=>a.split(': '));
                const Headers = Object.fromEntries(headers);
                // console.log(Headers)
                const type = Headers['content-type'] || Headers['Content-Type'];
                const blob = new Blob([buffer], {type});

                imageEl.src = URL.createObjectURL(blob);

                onOver(blob);
                db.bgmImage.set({url,buffer,type});
            },
            onerror(e){
                console.log('downloadImage error',e);
                onOver();
            }
        });
    });
}


db.bgmImageI2V=db._wrapper.call(fw4wdb('fetch-bangumi-image-i2v',1,{
    key:'url'
}));

const getTagsFromBGMImageURL = (url,onOver) => {

    if(!window.i2vIsOnline) return onOver();

    db.bgmImageI2V.get(url, data => {
        if(data) return onOver(data.tags);

        downloadImage(url,blob=>{
            if(!blob) return onOver();

            getTagsFromImageBlobXHR(blob,tags=>{
                onOver(tags);
                if(tags)
                    db.bgmImageI2V.set({url,tags});
            });
        });
    });
}






// 转换tag为中文并去重成简单数组
const getSimpleTagsFromBGMImageURL = (url,onOver) => {
    getTagsFromBGMImageURL(url,data=>{
        if(!data) return onOver();

        const tags = data[0].general?.map(v=>{
            const name = tagEN2CN(v[0]);
            return name;
        });

        console.log(tags);
        onOver(tags);
    });
}

window.i2vIsOnline = true;
getTagsFromBGMImageURL('https://lain.bgm.tv/pic/crt/g/b5/b6/86246_crt_VexxG.jpg?r=1696587402',r=>{
    console.log(r);
    window.i2vIsOnline = !!r;
});