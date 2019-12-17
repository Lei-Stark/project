const http = require("http");
const https = require("https");
const cheerio = require("cheerio");
const axios = require("axios");
const express = require("express");
const fs = require("fs");
const puppeteer = require("puppeteer");

//官方 自动测试化工具
// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://wall.alphacoders.com');
//     await page.screenshot({ path: 'example.png' });

//     await browser.close();
// })();

//自动测试化工具 可取消下面屏蔽内容
// (async () => {
//     const browser = await puppeteer.launch({
//         headless: false,
//         timeout: 30000
//     })
//     const page = await browser.newPage();
//     page.setViewport({

//         width: 1440,
//         height: 1080

//     })
//     await page.goto('http://localhost:8080/');
//     const username = 'admin'
//     const password = '123456'
//     await page.type("input[name='username']", username)
//     await page.type("input[name='password']", password)
//     await page.tap('button')
//     await page.waitForSelector('[class^="menu-wrapper"]');
//     await page.goto('http://localhost:8080/#/materialmanagement/newADmate?state=create&source=img');
//     // await page.type("input[name='username']", username)
//     // await page.keyboard.press('Enter');
//     await page.waitForSelector('form');
//     let x = await page.$$('.el-input__inner')
//     await page.type(x[0], '有内鬼终止交易', { delay: 200 })
//     await page.type(x[1], '999', { delay: 200 })
//     await page.type(x[2], '666', { delay: 200 })

// })()

//http 服务器

// var server = http.createServer((request, response) => {

//     console.log(request.method + ': ' + request.url);

//     response.writeHead(200, { 'Content-Type': 'application/json;charset=UTF-8' });
//     response.end('你好，铁憨憨')

// })

// server.listen(9099)

//node 爬虫

(function getdata() {
  let name = "search=weathering+with+you&lang=Chinese";
  let smallurl = "search.php?";
  let bigimgurl = "big.php?";
  let urls = "https://wall.alphacoders.com/";
  let url = urls + smallurl + name + "&page=" + 3;
  let size = "&w=1440&h=900&type=stretch";
  let bigurl = urls;

  axios
    .get(url)
    .then(function(response) {
      let $ = cheerio.load(response.data);
      let datas = $(".center>.thumb-container-big");
      let list = [];
      datas.each((index, el) => {
        // list.push($(el).find('a').attr("href").toString().replace("big", "wallpaper"))
        // console.log($(el).find('a').attr("href").toString().replace("big", "wallpaper"))
        let s = $(el)
          .find("a")
          .attr("href")
          .toString();
        let u = bigurl + s;
        axios
          .get(u)
          .then(res => {
            let $ = cheerio.load(res.data);
            let data = $(".main-content").attr("src");
            let b = s;
            let index1 = data.lastIndexOf(".");
            let index2 = data.length;
            let name = data.substring(index1, index2);
            let b1 = b.indexOf("=");
            let b2 = b.length;
            let bname = b.substring(b1, b2);
            saveimg(data, bname + name);

            function saveimg(url, path) {
              try {
                https.get(url, function(req, res) {
                  var imgData = "";
                  req.setEncoding("binary");
                  req.on("data", function(chunk) {
                    imgData += chunk;
                  });
                  req.on("end", function() {
                    fs.writeFile("./img/" + path, imgData, "binary", function(
                      err
                    ) {
                      console.log("保存图片成功" + path);
                    });
                  });
                });
              } catch (err) {
                console.log(err);
              }
            }
          })
          .catch(() => {});
      });
    })
    .catch(function() {
      console.log();
    });
})();
