const express = require('express');
const app = express();
const superagent = require('superagent');
const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show:false });
const request = require('request');

let server = app.listen(3000, ()=>{
    let host = server.address().address;
    let port = server.address().port;
    console.log('Your App is runing at http://%s;%s', host, port)
})

let topData = [];
let secondData = [];

app.get('/', async (request, response, next) => {
    response.send({
        topData: topData
    });
});


nightmare
.goto('https://meishij.net')
.wait('div.main_w')
.evaluate(() => document.querySelector('div.main').innerHTML)
.then(htmlStr => {
    topData = getMeishijData(htmlStr);
})
.catch(err => {
    console.log('没事信息获取失败-%s;',err );
});


let getMeishijData = (htmlStr) => {
    console.log('htmlStr:', htmlStr);
    let _topData = [];
    let $  = cheerio.load(htmlStr);
    $('div#index_zzw ul li a img').each((idx, ele) => {
        let _data = {
            title:$(ele).attr('alt'),
            href:$(ele).attr('src')
        };
        _topData.push(_data);
    });

    $('div#index_pxw_w a img').each((idx, ele) => {
        let _data = {
            title: $(ele).attr('alt'),
            href: $(ele).attr('src')
        };
        _topData.push(_data);
    });
    return _topData;
}