/**
 * @file lru算法
 */
import DoubleLink from './doubleLink';
import {isString, isNumber} from 'lodash';
import LoggerCode from './loggerCode';

const OS = require('os');

const MAX_LENGTH = 10 * 1000;
const MAX_SIZE = Math.ceil(OS.freemem() / 8);
const MAX_AGE = 60 * 1000;

const LOGGER_TYPE = {
    SAVE: 'save', // 保存
    GET: 'get', // 获取
    DELETE: 'delete', // 删除
    EXPIRED_DELETE: 'expired_delete', // 过期删除
    RESET: 'reset', // 重置
    OTHER: 'other' // 其他情况
};

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

    /**
     * 是否含有该key的缓存
     * @param {string | number} key
     * @return {boolean}
     */
    has(key) {
        if (!isString(key) || !isNumber(key)) {
            const self = this;
            this.logger({
                type: LOGGER_TYPE.OTHER,
                context: self,
                ...LoggerCode.ERROR_INPUT_KEY.errorCode,
            });
            return false;
        }
        return this.store.has(key);
    }

    /**
     * 该key是否过期
     * @param {string | number} key
     * @return {boolean}
     */
    isExpired(key) {
        if (!isString(key) || !isNumber(key)) {
            const self = this;
            this.logger({
                type: LOGGER_TYPE.OTHER,
                context: self,
                ...LoggerCode.ERROR_INPUT_KEY.errorCode,
            });
            return true;
        }
        if (!this.has(key)) {
            return true
        }
        const node = this.link.get(item => item.key === key);
        return Date.now() > node.value.currentTime + node.value.expiredTime;
    }

    /**
     * 返回所有缓存的内容，用数组表示；
     * @return {Array}
     */
    getValues() {
        const iterator = this.store.values();
        const array = [];
        for (let value of iterator) {
            array.push(value);
        }
        return array;
    }

    /**
     * 返回手游keys，用数组表示
     * @return {Array}
     */
    getKeys() {
        const iterator = this.store.keys();
        const array = [];
        for (let key of iterator) {
            array.push(key);
        }
        return array;
    }

    /**
     * 在缓存期内强制更新该key对应的值
     * @param {string | number} key
     * @param {any} value
     * @return {boolean}
     */
    forceUpdateCache(key, value) {
        if (!isString(key) || !isNumber(key)) {
            return false
        }
        if (!this.has(key)) {
            return false
        }
        if (this.isExpired(key)) {
            return false
        }
        this.store.set(key, value);
        this.link.map(item => {
            if (item.key === key) {
                item.value = value;
            }
            return item;
        });
        return true;
    }

    // 重新设置该key的过期时间
    setExpired(key) {

    }

    // 重置
    reset(showLog = true) {
        this.currentLength = 0;
        this.store = new Map(); // 存取
        this.link = new DoubleLink(); // 管理和排序
        if (showLog) {
            const self = this;
            this.logger({type: LOGGER_TYPE.RESET, context: self});
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
    this.expiredTime = options.expiredTime;
    this.extraMsg = options.extraMsg;
}