const getMatchSelectorInnerText = (el,selector)=>{
    const match = el.querySelector(selector);
    if(!match) return;
    return trim(match.innerText);
};

const getCharactersMore = (id,onOver)=>{
    getBangumiHTML(`https://bangumi.tv/subject/${id}/characters`,html=>{
        
        if(!html) return onOver([]);

        const doc = new DOMParser().parseFromString(html, 'text/html');


        const userEls = [...doc.querySelectorAll('#columnInSubjectA>.light_odd')];
        
        const characters = userEls.map(liEl=>{
            const id = +liEl.querySelector('a').getAttribute('href').match(/\d+/);

            let fade = undefined;
            
            const fadeMatch = getMatchSelectorInnerText(liEl,'.crt_info.prsn_info .tip');

            if(/性别/.test(fadeMatch)){
                fade = fadeMatch.replace('性别 ','');
            }

            const job = getMatchSelectorInnerText(liEl,'.badge_job');

            let names = [...new Set(getMatchSelectorInnerText(liEl,'h2').split('/').map(a=>trim(a)))].filter(a=>a);
            const cv = getMatchSelectorInnerText(liEl,'.actorBadge>p>.grey');

            let cover = liEl.querySelector('img.avatar')?.getAttribute('src');

            if(cover){
                cover = cover.replace(/\?r=.+?$/,'');
                cover = cover.replace(/^\/\//,'http://');
            }
            
            return {
                id,
                names,
                cv,
                fade,
                job,
                cover,
            }
        }).filter(a=>a);

        onOver(characters);
    });
}


const getAllCharacterIdsBySubjectInfo = (info,onOver)=>{
    const ids = info.characters.map(a=>a.id);
    if(!info.haveMoreCharacter) return onOver(ids);

    getCharactersMore(info.id,characters=>{
        info.characters = characters;
        onOver(characters.map(a=>a.id));
    });
};

const getTextFromSelector = (htmlEl,selector)=>{
    const el = htmlEl.querySelector(selector);
    if(!el) return;
    return trim(el.innerText);

}



const fixCharacterHTML = (id,html)=>{
    let names = [];
    const data = {
        names
    };

    const doc = new DOMParser().parseFromString(html, 'text/html');

    names.push(getTextFromSelector(doc,'h1.nameSingle small.gray'));
    names.push(getTextFromSelector(doc,'h1.nameSingle a'));

    const dataLis = [...doc.querySelectorAll('#infobox>li')];
    dataLis.forEach(li=>{
        const text = 去除网页标记(li.innerHTML);
        // console.log(text);

        const match = text.match(/^(.+?): (.+)$/);
        if(match){
            let key = trim(match[1]);
            let value = trim(match[2]);

            if(['别名','简体中文名'].includes(key)){
                names.push(value);
                return;
            }

            if(InfoKeysConvert[key]){
                key = InfoKeysConvert[key];
            }
            data[key] = value;
        }
    });

    data.names = [...new Set(names)].filter(a=>a);

    data.cover = doc.querySelector('img.cover')?.getAttribute('src').replace(/\?r=.+?$/,'').replace(/^\/\//,'http://');
    

    return data;
}

const getCharacterInfoById = (id,onOver)=>{
    getBangumiHTML(`https://bangumi.tv/character/${id}`,html=>{
        if(!html) return onOver();
        const info = fixCharacterHTML(id,html);
        info.id = id;
        onOver(info);
    });
}


const getCharacterInfosByIds = (ids,onOver)=>{
    let infos = [];
    forEach(ids,(id,index,next)=>{
        getCharacterInfoById(id,info=>{
            infos.push(info);
            next();
        });
    },()=>{
        onOver(infos);
    });
}



const getCharacterNameTags = (character)=>{

    let tags = [character.cn,character.name,...character.names];

    tags = [...new Set(tags)];
    tags = tags.filter(a=>a);

    tags.forEach(name=>{
        if(/^([\u4E00-\u9FA5]+)\s([\u4E00-\u9FA5]+)$/.test(name)){
            tags.push(RegExp.$1);
            tags.push(RegExp.$2);
            return;
        }
        if(/^([\u0800-\u4e00]+)\s([\u0800-\u4e00]+)$/.test(name)){
            tags.push(RegExp.$1);
            tags.push(RegExp.$2);
            return;
        }
        if(/^([a-z]+)\s([a-z]+)$/i.test(name)){
            tags.push(RegExp.$1);
            tags.push(RegExp.$2);
            return;
        }
        if(/^([a-z]+)\s([a-z]+)$/i.test(name)){
            tags.push(RegExp.$1);
            tags.push(RegExp.$2);
            return;
        }
    });

    tags = [...new Set(tags)];
    tags = tags.filter(a=>a);


    return tags.join('、')
}


const getCharacterCoverI2V = (character,onOver)=>{
    if(!character.cover) return onOver();
   
    getSimpleTagsFromBGMImageURL(character.cover,tags=>{
        character.tags = tags;
        onOver()
    });
};


const getCharacterCoversI2V = (characters,onOver)=>{
    forEach(characters,(character,index,next)=>{
        getCharacterCoverI2V(character,()=>{
            setTimeout(next);
        });
    },()=>{
        onOver(characters);
    });
}