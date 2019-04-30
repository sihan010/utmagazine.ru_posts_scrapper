const rp = require('request-promise');
const cheerio = require('cheerio');
var fs = require('fs');

const url = 'https://utmagazine.ru/finansoviy-slovar-treidera';
var result = {};
var letters = 0;
var posts = 0;
console.log("wait until html content is downloaded...");
rp(url).then((html) => {
    console.log('got html, getting into work...');
    const main_html = cheerio.load(html);
    try {
        main_html('.vocabulary__letter').each((key0, item) => {
            var all_posts = [];
            var vocabulary__letter = cheerio.load(item);
            var letter = vocabulary__letter('span').text();
            letters++;
            vocabulary__letter('ul li a').each((key1, item) => {
                var obj = {
                    //'id': `${key0}${key1}`,
                    'title': item.children[0].data,
                    'hyperlink': item.attribs.href
                }
                all_posts.push(obj);
                posts++;
            })
            result[`${letter}`] = all_posts;
        })
    } catch (err) {
        console.log('parsing error -> ', err);
    }
    console.log('scrapping done. parsing...');
    var resultJSON = {
        "letters": letters,
        "posts": posts,
        "summary": "scrapes letters and their associated posts alphabetically from https://utmagazine.ru/finansoviy-slovar-treidera",
        "author": "manal@m.insta.kim",
        "data": result
    }
    fs.writeFile('list_posts.txt', JSON.stringify(resultJSON), 'utf8', () => {
        console.log('parsing done, JSON data flushed to file ./list_posts.txt')
    });

}).catch((err) => {
    console.log('HTML error -> ', err);
});