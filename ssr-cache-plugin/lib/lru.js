/**
 * @file lru算法
 */
import DoubleLink from './doubleLink';

const OS = require('os');

const MAX_LENGTH = 10 * 1000;
const MAX_SIZE = Math.ceil(OS.freemem() / 8);
const MAX_AGE = 60 * 1000;

export default class LRU {
    constructor(options) {
        const {
            length = MAX_LENGTH, // 最多容纳多少个
            maxSize = MAX_SIZE, // 最大容量
            maxAge = MAX_AGE, // 最大过期时间
            onBeforeClean = () => {}, // 删除某个内存项之前触发的回调
            onAfterExpired = () => {}, // 某项再过期之后删除之前的回调
            logger = () => {}, // 日志函数
        } = options;
        this.maxLength = length;
        this.maxSize = maxSize;
        this.maxAge = maxAge;
        this.onBeforeClean = onBeforeClean;
        this.onAfterExpired = onAfterExpired;
        this.logger = logger;
        this.reset();
    }

    /**
     * 对外暴露的方法
     */

    // 保存内容
    save(options) {
        // const {key, value, expired = this.maxAge, extraMsg = {}} = options;
        // const cache = new CacheItem({key, value, expired, extraMsg});

    }

    // 获取指定的key
    get(key) {

    }

    // 删除制定的key
    del(key) {

    }

    // 是否含有该key的缓存
    has(key) {

    }

    // 该key是否过期
    isExpired(key) {

    }

    // 返回所有缓存的内容，用数组表示；
    getValues() {

    }

    // 返回手游keys，用数组表示
    getKeys() {

    }

    // 根据该key代替原来的值
    replaceValue(key) {

    }

    // 重新设置该key的过期时间
    setExpired(key) {

    }

    // 重置
    reset(showLog = true) {
        this.currentLength = 0;
        this.store = new Map();
        this.link = new DoubleLink();
        if (showLog) {
            const self = this;
            this.logger({type: 'reset', context: self});
        }
    }

    // 更新缓存的内容，将过期的内容去掉
    refresh() {

    }

    // 获取长度
    length() {
        return this.currentLength;
    }
}

function CacheItem(options) {
    this.key = options.key;
    this.value = options.value;
    this.currentTime = Date.now();
    this.expired = options.expired;
    this.extraMsg = options.extraMsg;
}