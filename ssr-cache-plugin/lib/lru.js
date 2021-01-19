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
    UPDATE: 'update', // 更新
    GET: 'get', // 获取
    DELETE: 'delete', // 删除
    RESET: 'reset', // 重置
    OTHER: 'other' // 其他情况
};

export default class LRU {
    constructor(options) {
        const {
            length = MAX_LENGTH, // 最多容纳多少个
            maxSize = MAX_SIZE, // 最大容量
            maxAge = MAX_AGE, // 最大过期时间
            onBeforeDelete = () => {}, // 删除某个内存项之前触发的回调
            logger = () => {}, // 日志函数
        } = options;
        this.maxLength = length;
        this.maxSize = maxSize;
        this.maxAge = maxAge;
        this.onBeforeDelete = onBeforeDelete;
        this.logger = logger;
        this.reset();
    }

    _inputIsEffective(key) {
        if (isString(key) || isNumber(key)) {
            return true
        } else {
            const self = this;
            this.logger({
                type: LOGGER_TYPE.OTHER,
                context: self,
                // ...LoggerCode.ERROR_INPUT_KEY
            });
            return false
        }
    }

    /**
     * 保存内容
     * @param {object} options
     * @return {boolean}
     */
    save(options) {
        const {key, value, expired = this.maxAge} = options;
        const self = this;
        // key不存在且已经到达长度
        if (!this.has(key) && this.isOverLength()) {
            this.currentLength -= 1;
            const tail = this.link.pop();
            tail && this.store.delete(tail.value.key);
        }
        const cache = new CacheItem({key, value, expired});
        if (this.has(key)) {
            this.store.set(key, value);
            this.link.remove(item => item.key === key);
            this.link.unshift(cache);
            this.logger({type: LOGGER_TYPE.UPDATE, context: self});
        } else {
            this.store.set(key, value);
            this.link.unshift(cache);
            this.currentLength += 1;
            this.logger({type: LOGGER_TYPE.SAVE, context: self});
        }
        return true
    }

    /**
     * 获取指定的key
     * @param {string | number} key
     * @return {any}
     */
    get(key) {
        const self = this;
        if (!this._inputIsEffective(key)) {
            return null
        }
        if (this.has(key)) {
            if (this.isExpired(key)) {
                this.delete(key);
                return null;
            } else {
                const target = this.link.get(item => item.key === key);
                if (!target) {
                    return null;
                }
                this.link.remove(item => item.key === key);
                const content = target.value;
                content.currentTime = Date.now();
                this.link.unshift(content);
                this.logger({type: LOGGER_TYPE.GET, context: self});
                return this.store.get(key);
            }
        } else {
            return null;
        }
    }

    /**
     * 删除制定的key
     * @param {string | number} key
     * @return {boolean}
     */
    delete(key) {
        const self = this;
        if (!this._inputIsEffective(key)) {
            return false
        }
        this.onBeforeDelete();
        this.store.delete(key);
        this.link.remove(item => item.key === key);
        this.currentLength -= 1;
        this.logger({type: LOGGER_TYPE.DELETE, context: self});
        return true;
    }

    /**
     * 是否规定超过长度
     * @return {boolean}
     */
    isOverLength () {
        return this.currentLength >= this.maxLength;
    }

    /**
     * 是否含有该key的缓存
     * @param {string | number} key
     * @return {boolean}
     */
    has(key) {
        if (!this._inputIsEffective(key)) {
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
        if (!this._inputIsEffective(key)) {
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
     * @param {boolean} isRank 是否输出排序好的key数组
     * @return {Array}
     */
    getValues(isRank = false) {
        if (isRank) {
            const array = this.link.toArray();
            return array.map(item => item.value);
        }
        const iterator = this.store.values();
        const array = [];
        for (let value of iterator) {
            array.push(value);
        }
        return array;
    }

    /**
     * 返回手游keys，用数组表示
     * @param {boolean} isRank 是否输出排序好的key数组
     * @return {Array}
     */
    getKeys(isRank = false) {
        if (isRank) {
            const array = this.link.toArray();
            return array.map(item => item.key);
        }
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
        if (!this._inputIsEffective(key)) {
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

    /**
     * 重新设置该key的过期时间
     * @param {string | number} key
     * @param {number} expiredTime
     * @return {boolean}
     */
    setExpiredTime(key, expiredTime) {
        if (!this._inputIsEffective(key)) {
            return false
        }
        if (!isNumber(time)) {
            const self = this;
            this.logger({
                type: LOGGER_TYPE.OTHER,
                context: self,
                // ...LoggerCode.ERROR_EXPIRED_TIME,
            });
            return false
        }
        this.link.map(item => {
            if (item.key === key) {
                item.expiredTime = expiredTime;
            }
            return item;
        });
        return true;
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

    /**
     * 更新缓存的内容，将过期的内容去掉
     * @return {boolean}
     */
    refresh() {
        const expiredCacheKey = [];
        const currentTime = Date.now();
        this.link.forEach(item => {
            if (currentTime > item.expiredTime + item.currentTime) {
                expiredCacheKey.push(item.key);
                this.store.delete(item.key);
                this.currentLength -= 1;
            }
        });
        expiredCacheKey.forEach(key => {
            this.link.remove(item => item.key === key);
        });
        return true;
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
    this.expiredTime = options.expired;
}