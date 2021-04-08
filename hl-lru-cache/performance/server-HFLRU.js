/**
 * @file 服务端 测试HF-LRU的性能
 */

import CachePlugin from '../index'
const fs = require('fs')
const cache = new CachePlugin.Cache({
    HFLength: 3,
    HFMaxAge: 1000,
    LFLength: 5,
    LFMaxAge: 1000,
    HFTimes: 2
});

function getResource(pathName) {
    const resource = cache.get(pathName);
    if (resource) {
        return resource
    } else {
        const content = fs.readFileSync(pathName);
        cache.set(pathName, content);
        return content
    }
}

getResource('./demo.txt');



