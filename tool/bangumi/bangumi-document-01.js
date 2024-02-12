const input1El = $('#input_bangumi_1')
const output1El = $('#output_bangumi_1')
const btn1El = $('#button1')

const tip1El = $('.tip1');

btn1El.onclick = ()=>{
    btn1El.disabled = true;
    const urls = input1El.value.trim().split(/\n+/g).filter(a=>a);
    let outputLinks = [];

    let errorNum = 0;

    tip1El.innerText = `当前进度：0 / ${urls.length}，已获取 0 个链接`;

    forEach(urls, (url, index, next) => {
        getBangumiHTML(url, html => {
            const _url = new URL(url);
            const htmlEl = new DOMParser().parseFromString(html, 'text/html');
            const baseEl = document.createElement('base');
            baseEl.href = _url.origin;
            htmlEl.head.appendChild(baseEl);

            const links = [...new Set([...htmlEl.querySelectorAll('a[href*="/subject/"]')].map(a=>a.href))];
            outputLinks = outputLinks.concat(links);
            tip1El.innerText = `当前进度：${index + 1} / ${urls.length}，已获取 ${outputLinks.length} 个链接`;
            next();
        }, () => {
            tip1El.innerText = `当前进度：${index + 1} / ${urls.length}，已获取 ${outputLinks.length} 个链接，失败 ${++errorNum} 次`;
            next();
        });
    },()=>{
        output1El.value = outputLinks.join('\n');
        tip1El.innerText = `获取完成，共获取 ${outputLinks.length} 个链接，失败 ${errorNum} 次`;
        btn1El.disabled = false;
    });

}



const output2El = $('#output_bangumi_2');
const btn2El = $('#button2');
const tip2El = $('.tip2');


btn2El.onclick = ()=>{
    btn2El.disabled = true;
    const urls = input1El.value.trim().split(/\n+/g);
    let outputTexts = [];

    let errorNum = 0;

    tip2El.innerText = `当前进度：0 / ${urls.length}，已获取 0 个链接`;

    forEach(urls, (url, index, next) => {
        getBangumiHTML(url, html => {
            const htmlEl = new DOMParser().parseFromString(html, 'text/html');
            
            const text = '';
            outputTexts.push(text);
            tip2El.innerText = `当前进度：${index + 1} / ${urls.length}，已获取 ${outputLinks.length} 个链接`;
            next();
        }, () => {
            tip2El.innerText = `当前进度：${index + 1} / ${urls.length}，已获取 ${outputLinks.length} 个链接，失败 ${++errorNum} 次`;
            next();
        });
    },()=>{
        output2El.value = outputLinks.join('\n');
        tip2El.innerText = `获取完成，共获取 ${outputLinks.length} 个链接，失败 ${errorNum} 次`;
        btn2El.disabled = false;
    });
}