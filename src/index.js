const express = require('express');
const app = express();
const superagent = require('superagent');
const cheerio = require('cheerio');
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show:false });

let server = app.listen(3000, ()=>{
    let host = server.address().address;
    let port = server.address().port;
    console.log('Your App is runing at http://%s;%s', host, port)
})

let hotNews = [];
let localNews = [];

app.get('/', async (request, response, next) => {
    response.send({
        hotNews: hotNews,
        localNews: localNews
    });
})


superagent.get('http://news.baidu.com').end((err,res) => {
    if(err){
        console.log('获取新闻失败')
    }else{
        hotNews = getHotNews(res);
        localNews = getLocalNews(res);
    }
})

let getHotNews = (res) => {
    let hotNews = [];
    let $ = cheerio.load(res.text)
    $('div#pane-news ul li a').each((idx, ele) => {
        let news = {
            title:$(ele).text(),
            href:$(ele).attr('href')
        }
        hotNews.push(news);
    });
    return hotNews;
}

nightmare
.goto('http://news.baidu.com')
.wait('div#local_news')
.evaluate(() => document.querySelector('div#local_news').innerHTML)
.then(htmlStr => {
    localNews = getLocalNews(htmlStr);
})
.catch(err => {
    console.log('本地新闻获取失败-%s;',err );
});


let getLocalNews = (htmlStr) => {
    let localNews = [];
    let $  = cheerio.load(htmlStr);

    $('ul#localnews-focus li a').each((idx, ele) => {
        let news = {
            title:$(ele).text(),
            href:$(ele).attr('href')
        };
        localNews.push(news);
    });

    $('div#localnews-zixun ul li a').each((idx, ele) => {
        let news = {
            title: $(ele).text(),
            href: $(ele).attr('href')
        };
        localNews.push(news);
    });
    return localNews;
}