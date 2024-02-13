
// 从番剧首页获取角色信息
const fixCharacters = (id,html)=>{
	
	const usersMatch = html.match(/<li class="user [\s\S]+?<\/li>/g);
	if(!usersMatch) return [];

	// if(usersMatch.length === 9){
	// 	return getCharacterMore(id);
	// }

	const characters = usersMatch.map(li=>{
		const idMatch = li.match(/href="\/character\/(\d+)"/);
		if(!idMatch) return;
		const id = +idMatch[1];

		const fade = +getMatch(li,/<small class="fade rr">\(\+(\d+)\)<\/small>/,1)
		const job = getMatch(li,/<span class="badge_job_tip">(.+?)<\/span>/,1)
		const cv = getMatch(li,/ rel="v:starring">(.+?)<\/a>/,1)

		let cover = getMatch(li,/background-image:url\((.+?)\)/,1) || '';

		cover = cover.replace(/\?r=.+?$/,'');
		cover = cover.replace(/^\/\//,'http://');

		let name = getMatch(li,/title="(.+?) \/ (.+?)"/,1)
		if(!name){
			name = getMatch(li,/title="(.+?)/,1)
		}
		const cn = getMatch(li,/title="(.+?) \/ (.+?)"/,2) || undefined
		return {
			id,
			names:[name],
			cn,
			cv,
			fade,
			job,
			cover,
		}
	}).filter(a=>a)

	return characters;
}


const fixSubject = (id,html)=>{


	let info={};

	let data = {
		id,
		info,
		alias: [],
	};
	let title=html.match(/<title>(.+?) \| Bangumi 番组计划<\/title>/);

	if(!title){
		console.log(id,/没有匹配到标题，停止查询/);
		return;
	}

	data['title']=title[1];

	let 种类=html.match(/<small class="grey">(.+?)<\/small>/);

	if(种类){
		data['cat']=种类[1];
	}


	let 封面 = html.match(/<a href="(.+?)" title=".+?" alt=".+?" class="thickbox cover">/);

	if(封面){
		封面=封面[1];
	
		if(封面.match(/^\/\//)){
			封面='https:'+封面;
		}
	
		data['cover']=封面;
	}


	let 简介 = html.match(/<div id="subject_summary" class="subject_summary" property="v:summary">([\s\S]+?)<\/div>/im);

	if(简介){
		简介 = 简介[1].replace(/<br \/>/g,'');
		简介 = 去除网页标记(简介);
	}


	data['description']= 简介 || '';

	let fade = html.match(/property="v:average">([\d\.]+)<\/span/);
	if(fade){
		data.fade = +fade[1]
	}
	

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const infoLiEls = doc.querySelectorAll('#infobox>li');
    infoLiEls.forEach(li=>{
        const text = 去除网页标记(li.innerHTML);
        const match = text.match(/^(.+?): (.+)$/);
        if(match){
            let key = trim(match[1]);
            let value = trim(match[2]);
            if(InfoKeysConvert[key]){
                key = InfoKeysConvert[key];
                if(key === 'alias'){
                    data.alias.push(value);
                    return;
                }
                data[key] = value;
            }else{
                info[key] = value;
            }
        }
    });


	data.tags = [];

	const tagsText = getMatch(html,/class="subject_tag_section">([\s\S]+?)<\/div>/,1)

	if(tagsText){
		const tagsMatch = tagsText.match(/<span>(.+?)<\/span>/g)

		if(tagsMatch){
			data.tags = tagsMatch.map(text=>{
				return getMatch(text,/<span>(.+?)<\/span>/,1)
			});
		}
	}

    const haveMoreCharacter = !!html.match(/<a href="\/subject\/\d+\/characters" class="more">更多/);
    data.haveMoreCharacter = haveMoreCharacter;
	data.characters = fixCharacters(id,html);


    const names = [
        ...new Set([
            data.cn,
            data.title,
            ...data.alias,
        ])
    ].filter(a=>a);

    data.names = names;
	return data
};





const isOneStage = (subject)=>{
	const text = subject.names.join('、');
	
	if(/1期|1季|一期|一季/.test(text)) return true;
	if(/第.+[期篇话]/.test(text)) return false;
	if(/(2|3|4|六)$/.test(text)) return false;
	if(/第.+季|再始动|\dnd|\d期|\d季/.test(text)) return false;

	return true;
}



const fixText = text=>{
	text = String(text);
	text = trim(text);
	text = text.replace(/\(.+?\)/g,'').replace(/（.+?）/g,'');

	text = 去除网页标记(text);

	text = text.split(/[、/,，]/);
	text = text.map(a=>trim(a));
	text = text.filter(a=>a);
	text = [...new Set(text)];
	text = text.join('、');

	return text;

}


const subjectToLibTagText = subject=>{
    const namesText = fixText(subject.names.join('、'));
	let characterTags = [];
	subject.characters.forEach(character=>{
		if(character.nameTags){
			return characterTags.push(character.nameTags);
		}
		characterTags = characterTags.concat([...character.names,character.cn]);
    });
    const charactersNamesText = fixText([...new Set(characterTags)].filter(a=>a).join('、'));
    const kitsuText = fixText(getAnimeTips(subject).join('、'));

	let outputText = namesText;

	if(charactersNamesText) outputText += `^${charactersNamesText}`;
	if(kitsuText) outputText += `$${kitsuText}`;


	outputText = outputText.replace(/\(.+?\)/g,'').replace(/（.+?）/g,'');

	return outputText;
}