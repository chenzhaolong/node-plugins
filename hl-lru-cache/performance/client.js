/**
 * @file 客户端发起请求
 */
const http = require('http');

const config = {
    total: 1,
    path: {
        'A': 1,
        'B': 5,
        'C': 9,
        'D': 3,
        'E': 9,
        'F': 2,
        'G': 4,
        'H': 8,
        'I': 9,
        'J': 11,
        'K': 1,
        'L': 2,
        'M': 5,
        'N': 15,
        'O': 1,
        'P': 1,
        'Q': 1,
        'R': 1,
        'S': 1,
        'T': 3,
        'U': 1,
        'V': 1,
        'W': 1,
        'X': 1,
        'Y': 1,
        'Z': 1
    },
    spec: 'B',
    dir: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
    'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
    time: 1000
};



function fetch(path) {
    return new Promise(res => {
        const xhr = http.request(`http://127.0.0.1:8002/${path}`)
        xhr.on('response', () => {
            res();
        });
        xhr.end();
    });
}

function main() {
    const {total, path, time, dir, spec} = config;
    const obj = {};
    const start = Date.now();
    let count = 0;
    for (let i = 0; i < total; i++) {
        setTimeout(() => {
            let index = Math.floor(Math.random() * 26);
            let key = dir[index];
            while(path[key] === 0) {
                index = Math.floor(Math.random() * 26);
                key = dir[index];
            }
            path[key] = path[key] - 1;
            obj[key] = obj[key] ? obj[key] + 1 : 1;
            const realKey = spec ? spec : key;
            fetch(realKey)
                .then(() => {
                    count += 1;
                    if (count === total) {
                        console.log('obj', obj);
                        console.log(Date.now() - start);
                    }
                })
        }, i);
    }
}
main();