/**
 * @file 服务端 测试HF-LRU的性能
 */

const CachePlugin = require('../index');
const http = require('http');
const fs = require('fs');

const cache = new CachePlugin.Cache({
    HFLength: 10,
    LFLength: 20,
    HFTimes: 3,
    HFMaxAge: 60 * 1000,
    LFMaxAge: 60 * 1000,
    onLogger({msg}) {
        console.log(msg);
    }
});

const answer = (url) => {
    switch (url) {
        case 'A':
            return 'A';
        case 'B':
            return 'B';
        case 'C':
            return 'C';
        case 'D':
            return 'D';
        case 'E':
            return 'E';
        case 'F':
            return 'F';
        case 'G':
            return 'G';
        case 'H':
            return 'H';
        case 'I':
            return 'I';
        case 'J':
            return 'J';
        case 'K':
            return 'K';
        case 'L':
            return 'L';
        case 'M':
            return 'M';
        case 'N':
            return 'N';
        case 'O':
            return 'O';
        case 'P':
            return 'P';
        case 'Q':
            return 'Q';
        case 'R':
            return 'R';
        case 'S':
            return 'S';
        case 'T':
            return 'T';
        case 'U':
            return 'U';
        case 'V':
            return 'V';
        case 'W':
            return 'W';
        case 'X':
            return 'X';
        case 'Y':
            return 'Y';
        case 'Z':
            return 'Z';
    }
};

const server = http.createServer((req, res) =>{
    const url = req.url.replace('/', '');
    const content = cache.get(url);
    if (content) {
        res.end(content);
    } else {
        // fs.readFile('./demo.txt', (err, content) => {
        //     cache.save(url, content);
        //     res.end(content);
        // });
        setTimeout(() => {
            const a = answer(url);
            cache.save(url, a);
            res.end(a);
        }, 1000);
    }
});

server.listen(8002, () => {
    console.log('start');
});



