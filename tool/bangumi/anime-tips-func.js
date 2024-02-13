
const getTagsByText = (text = '',splitBy = /\s+/g)=>{
    return [...new Set(String(''+text).split(splitBy).filter(a=>a))]
}

const niceCvs = getTagsByText(`
釘宮理恵
堀江由衣
豊崎愛生
中原麻衣
中村悠一
绪方惠美
林原惠美
悠木碧
宫野真守
平野绫
石田彰
花泽香菜
水濑祈
坂本真綾
戸松遥
小松未可子
福山潤
子安武人
鈴村健一
白石稔
樱井孝宏
阿澄佳奈
小原好美
林原惠
`)


let types = getTagsByText(`
悬疑
惊悚
偶像
内涵
搞笑
日常 百合 恋爱 校园
战斗 机战
公路片
科幻 奇幻
冒险
萝卜 青春 竞技 运动
吐槽 少年系 治愈 催泪 萝莉
剧情
异世界
赛博朋克
末日
超能力
温情
穿越
黑暗
`);

let mainHaves = getTagsByText(`
深度
内涵
幻想

`)
let mainTypes = getTagsByText(`

`)

let oriTypes = getTagsByText(`
半年番
漫画改
小说改
轻小说改
GAL改
`)

let cmts = getTagsByText(`
猎奇
燃 热血
中二 废萌 电波`)
let mainCmts = getTagsByText(`
爆笑 必看
神作 笑到爆
萌豚饲料
`);
let kandukus = getTagsByText(`
庵野秀明
金敏
宫崎骏
水岛努
新海诚
石原立也
大友克洋
新房昭之
水岛精二
`);

let staffs = getTagsByText(`
汤浅政明
山本宽
花田十辉
大河内
西屋太志
门胁未来

滨口侍郎
菅野洋子
`);


let companys = getTagsByText(`
動画工房
京阿尼
日升
迪士尼
龙之子
SHAFT
ProductionI.G
`)

const getTags = (anime)=>{
    return anime.tags || []
}
const getCvs = (anime)=>{
    const cvs = anime.characters.map(c=>c.cv).filter(c=>c);

    // console.log(cvs)
    return cvs;
}
const getMainCharacters = (anime)=>{
    const cvs = anime.characters.slice(0,2).filter(c=>c.job === '主角')

    // console.log('getMainCvs',cvs)
    return cvs;
}
const getOtherCvs = (anime)=>{
    const cvs = anime.characters.filter(c=>c.job != '主角').map(c=>c.cv)

    // console.log('getOtherCvs',cvs)
    return cvs;
}
const randOne = (arr)=>{
    return arr[Math.floor(Math.random() * arr.length)]
};
const cloths = [
    '水手服',
    '连衣裙',
    '短裙',
    '和服',
    '校服',
    '泳装',
    '紧身衣',
    '紧身连衣裤',
    '超短裙',
    '没穿胸罩',
    '胸罩',
]
const hairColors = ['黑发', '棕发', '金发', '蓝发', '红发', '紫发', '粉发', '白发', '绿发', '银发', '橙发',  '水绿发'];
const TagsKV = {
    致郁: `读作治愈写作致郁`,
    bilibili: '甚至B站上有',
    爽片: `是个爽片`,
    肉番: `是个肉番`,
    后宫: `后宫番`,
    龙傲天: `呕，龙傲天`,
    残酷描写: `有残酷描写`,
    狗屎: `狗屎！！`,
    原创: `是原创动画！`,
    单元剧: `是单元剧形式`,
    灰色童话: `是治愈的灰色童话`,
    ClariS: `ClariS❤`,
    神前晓: `神前晓做了配乐！`,
    牛尾宪辅: `牛尾宪辅做了配乐！`,
    血腥: `血腥警告`,
    反套路: `有点反套路`,
    人生: `是人生啊`,
    大河内一楼: `大！河！内！一！楼！`,
    基: `有给！`,
    耽美: `耽美、来袭`,
    神: `神！`,
    NTR: `N!T!R!`,
    骨头社: '骨头社!',
    原创结尾: '是原创结尾',
    key: '不会是要打棒球吧',
    智斗:'甚至在日本动画里可以看到智斗',
    童话:'童话风',
    成长:'甚至能看到角色成长',
    异世界:'又是异世界',
    丧尸:'有丧尸！',
    番茄酱: '怎么都是番茄酱',
    硬科幻: '太棒了，是硬科幻',
    SF: 'SF!',
    '3D': '3D',
    弐瓶勉: '弐瓶勉多来点！',
    长篇: '是长篇动画',
    燃: '燃起来了啊',
    梶浦由记: '梶浦由记',
    澤野弘之: '澤野弘之来了',
    中二: '很中二',
    现实: '现实',
    轻百合: '轻百合好耶',
    伪娘: '有伪娘',
}

let hitokotos = getTagsByText(`
经典
安倍吉俊
萌
推理
教练我想打篮球
目测带感
总之就是非常可爱
总之就是非常酸
动画史上绝无仅有的神作
万分给力
等得花儿都谢了
有尖叫有快感
肉作什么的最没爱了
内裤
有血有肉
奇怪的名字
神身高差
泉此方既视感
猫耳
呆毛
AC娘
万分给力
看到哪儿了
童年系
没看全
现代黑帮
暴力最高
這就是青春啊
不看人生不完整
`);

const getAnimeTips = anime=>{
    if(!anime) return [];
    let tips = [];
    // console.log(anime);

    // if(anime.info['动画制作']){
    //     getTagsByText(anime.info['动画制作'],/、|\//g).forEach(company=>{
    //         company = Companys[company.toLocaleLowerCase()] || company;

    //         // tips.push(`制作公司是${company}`)
    //     })
    // }
    let {
        放送星期,
        放送开始,
        上映年度,
    } = anime.info;

    // if(放送星期){
    //     if(放送星期.length === 1) 放送星期 = '星期' + 放送星期;
    //     tips.push(`${放送星期}放送`);
    // }

    const start = 放送开始 || 上映年度
    if(start){
        const yyyyMatch = start.match(/^\d{4}/)
        if(yyyyMatch){
            tips.push(`是${String(yyyyMatch).substring(2)}年的动画`);
        }

        // if(anime.cat === 'TV'){
        //     const mmMatch = start.match(/(\d{1,2})月/);
        //     if(mmMatch){
        //         tips.push(`${+mmMatch[1]}月番`);
        //     }
        // }
    }

    if(anime.cat){
        if(anime.cat === 'TV'){
            // tips.push(`是TV动画`)
        }else{
            tips.push(`是${anime.cat}`)
        }
    }

    if(anime.fade){
        tips.push(`在番组计划拿到了${anime.fade}分`)
    }

    const tags = getTags(anime);

    tags.forEach(tag=>{
        if(TagsKV[tag]) return tips.push(TagsKV[tag])

        if(hitokotos.includes(tag)){
            return tags.push(tag);
        }

        if(types.includes(tag)){
            return tips.push(randOne([
                // `是${tag}番`,
                `${tag}`,
                // `有${tag}场景`,
                // `是${tag}`,
            ]))
        }

        if(oriTypes.includes(tag)){
            tips.push(`是${tag}`)
        }

        if(companys.includes(tag)){
            tips.push(`制作公司是${tag}`)
        }

        if(mainCmts.includes(tag)){
            tips.push(`可以说是${tag}`)
        }
        if(mainHaves.includes(tag)){
            tips.push(`这个动画有${tag}`)
        }

        if(kandukus.includes(tag)){
            return tips.push(`监督是${tag}!`)
        }
        if(staffs.includes(tag)){
            return tips.push(`${tag}参与了这部动画的制作`)
        }
    })

    if(anime.characters){
        const mainCharacters = getMainCharacters(anime);
        mainCharacters.forEach(character=>{
            // if(niceCvs.includes(cv)){
            if(character.cv){
                tips.push(`${character.cv}给主角配了音`);
            }
            // }
            if(character.tags){
                character.tags.forEach(tag=>{
                    // if(/瞳$/.test(tag)) return tips.push(`主要角色有个${tag}`);
                    if(hairColors.includes(tag)) return tips.push(`主要角色是${tag}`);

                    if(cloths.includes(tag)) return tips.push(`主要角色穿过${tag}`);
                })
            }
        });
        const cvs = getOtherCvs(anime);
        cvs.forEach(cv=>{
            if(niceCvs.includes(cv)){
                tips.push(`${cv}也参与了配音`);
            }
        });

    }  

    tips = tips.map(tc2sc);

    return [...new Set(tips)];
}
