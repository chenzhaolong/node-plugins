/**
 * @file 基于lru的低高频缓存策略
 * todo：logger的使用
 * todo：对缓存的内容体积做限制
 */
import LRU from './lru';
import Monitor from './monitor';
import { isNull, isNumber, get } from 'lodash';
const path = require('path');

const HF_MAX_LENGTH = 10 * 1000;
const LF_MAX_LENGTH = 10 * 1000;
const HF_MAX_AGE = 60 * 1000;
const LF_MAX_AGE = 60 * 1000;
const HF_TIMES = 10;

const TYPE = {
  LF: 'lf', // 低频
  HF: 'hf', // 高频
  BOTH: 'both' // 两者
};

const LOGGER_TYPE = {
    SAVE: 'save',
    GET: 'get',
    RESET: 'reset',
    DELETE: 'delete',
    UPGRADE: 'upgrade',
    DEMOTION: 'demotion',
    OOM: 'outOfMemory'
};

export default class Cache {
    constructor(options) {
        const {
            HFLength = HF_MAX_LENGTH,
            LFLength = LF_MAX_LENGTH,
            HFMaxAge = HF_MAX_AGE,
            LFMaxAge = LF_MAX_AGE,
            HFTimes = HF_TIMES,
            onBeforeDelete = () => {},
            onUpgrade = () => {},
            onDemotion = () => {},
            clearDataTime = 0, // 每个多少秒清洗lru的数据
            onLogger = () => {}, // 日志
            openMonitor = false, // 是否开启内存监控
            onNoticeForOOM = () => {}, // 警告函数
            memFilePath = path.resolve(__dirname, '../menFile/') // 溢出文件的存储位置
        } = options;

        this.LFLru = new LRU({length: LFLength, maxAge: LFMaxAge, onBeforeDelete});
        this.HFLru = new LRU({length: HFLength, maxAge: HFMaxAge, onBeforeDelete});
        this.frequency = HFTimes;
        this.onUpgrade = onUpgrade;
        this.onDemotion = onDemotion;
        this.onLogger = onLogger;

        // 每个多少分钟更新数据一次
        if (isNumber(clearDataTime) && clearDataTime > 0) {
            setInterval(() => {
                !this._isLruEmpty(TYPE.LF) && this.LFLru.refresh();
                !this._isLruEmpty(TYPE.HF) && this.HFLru.refresh();
            }, clearDataTime * 1000 * 60);
        }

        Monitor.injectExtraPower({onNoticeForOOM, openMonitor, memFilePath});
    }

    /**
     * 保存数据
     */
    save (options) {
        const mem = Monitor.computedMemory();
        if (Monitor.isArriveOneLevel(mem)) {
            Monitor.takeAction();
            !this._isLruEmpty(TYPE.HF) && this._reset(TYPE.HF);
            this._logger({type: LOGGER_TYPE.OOM, msg: `the memory has used ${mem}`, data: {mem}});
            return
        }

        this._logger({
            type: LOGGER_TYPE.SAVE,
            msg: `${options.key} saved`,
            data: {key: options, expiredTime: options.expired}
        });

        if (this._has(options.key, TYPE.HF)) {
            return this._saveHF(options);
        }

        return this.LFLru.save({
            key: options.key,
            value: options.value,
            expired: options.expired,
            extra: {
                times: 0
            }
        });
    }

    _saveHF(options) {
        // 过期HF删除key，将key存入LF
        if (this.HFLru.isExpired(options.key)) {
            this.delete(options.key, TYPE.HF);
            return this.LFLru.save({
                key: options.key,
                value: options.value,
                expired: options.expired,
                extra: {
                    times: 0
                }
            });
        } else {
            return this.HFLru.save({
                key: options.key,
                value: options.value,
                expired: options.expired,
            });
        }
    }

    /**
     * 获取指定的key
     * @param {string | number} key
     * @return {any}
     */
    get(key) {
        if (!this._has(key)) {
            return null
        }
        // 高频LRU存在
        if (this._has(key, TYPE.HF)) {
            this._logger({
                type: LOGGER_TYPE.GET,
                msg: `${key} get`,
                data: {key, from: 'HFL'}
            });

            return this.HFLru.get(key);
        } else { // 低频LRU存在
            this._logger({
                type: LOGGER_TYPE.GET,
                msg: `${key} get`,
                data: {key, from: 'LFL'}
            });

            this.LFLru.link.map(node => {
                if (node.key === key) {
                    node.extra.times += 1;
                }
                return node;
            });
            const target = this.LFLru.get(key);
            if (isNull(target)) {
                return null;
            }
            if (this._canUpgrade()) {
                this._upgrade(target);
            }
            return target;
        }
    }

    /**
     * 删除数据
     * @param {string | number} key
     * @param {string} type
     */
    delete(key, type) {
        this._logger({
            type: LOGGER_TYPE.DELETE,
            msg: `${key} delete`,
            data: {key, from: type}
        });
        switch (type) {
            case TYPE.HF:
                this.HFLru.delete(key);
                break;
            case TYPE.LF:
                this.LFLru.delete(key);
                break;
            default:
                this.HFLru.delete(key);
                this.LFLru.delete(key);
                break;
        }
    }

    /**
     * 获取lru的key值
     * @param {boolean} isRank 是否输出排序好的key数组
     * @return {Object}
     */
    getKeys(isRank = false) {
        const LFKeys = this.LFLru.getKeys(isRank);
        const HFKeys = this.HFLru.getKeys(isRank);
        return {LFKeys, HFKeys};
    }

    /**
     * 获取lru的value值
     * @param {boolean} isRank 是否输出排序好的key数组
     * @return {Object}
     */
    getValues(isRank = false) {
        const LFValues = this.LFLru.getValues(isRank);
        const HFValues = this.HFLru.getValues(isRank);
        return {LFValues, HFValues};
    }

    /**
     * 是否能升级
     * @return boolean
     */
    _canUpgrade() {
        const mem = Monitor.computedMemory();
        if (Monitor.isArriveThreeLevel(mem) || Monitor.isArriveTwoLevel(mem)) {
            if (Monitor.isArriveTwoLevel(mem)) {
                !this._isLruEmpty(TYPE.HF) && this._reset(TYPE.HF);
            }
            this._logger({type: LOGGER_TYPE.OOM, msg: `the memory has used ${mem}`, data: {mem}});
            return false
        }

        const node = this.LFLru.link.head;
        const times= get(node, 'value.extra.times', 0);
        return times >= this.frequency;
    }

    /**
     * 升级
     */
    _upgrade() {
        const node = this.LFLru.link.head;
        this._logger({
            type: LOGGER_TYPE.UPGRADE,
            msg: `${node.value.key} upgrade`,
            data: {key: node.value.key, from: 'LFL', to: 'HFL'}
        });

        // 删除LF的key节点
        this.LFLru.delete(node.value.key);
        if (this._isOverLength(TYPE.HF)) {
            this._demotion()
        }
        this.HFLru.save({
            key: node.value.key,
            value: node.value.value,
            expired: node.value.expired,
        });
    }

    /**
     * 降级
     */
    _demotion() {
        const tail = this.HFLru.link.tail;
        tail && this.HFLru.delete(tail.value.keys);
        // 存在且没过期
        if (tail && (Date.now() <= tail.value.currentTime + tail.value.expiredTime)) {
            this.LFLru.save({
                key: tail.value.key,
                value: tail.value.value,
                expired: tail.value.expired,
                extra: {times: 0}
            });

            this._logger({
                type: LOGGER_TYPE.DEMOTION,
                msg: `${tail.value.key} demotion`,
                data: {key: tail.value.key, from: 'HFL', to: 'LFL'}
            });
        }
    }

    _logger(options) {
        const {type, msg, data} = options;
        data.currentTime = Date.now();
        this.onLogger({type, msg, data});
    }

    /**
     * 是否过期
     */
    _isExpired(key) {
        if (this._has(key, TYPE.LF) && this.LFLru.isExpired(key)) {
            return true;
        } else if (this._has(key, TYPE.HF) && this.HFLru.isExpired(key)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 是否有key
     * @param {string | number} key
     * @param {string} type
     * @return boolean
     */
    _has(key, type) {
        switch (type) {
            case TYPE.HF:
                return this.HFLru.has(key);
            case TYPE.LF:
                return this.LFLru.has(key);
            default:
                return this.HFLru.has(key) || this.LFLru.has(key);
        }
    }

    /**
     * 是否已满
     * @param {string} type
     * @return boolean
     */
    _isOverLength(type) {
        switch (type) {
            case TYPE.BOTH:
                return this.LFLru.isOverLength() && this.HFLru.isOverLength();
            case TYPE.HF:
                return this.HFLru.isOverLength();
            case TYPE.LF:
                return this.LFLru.isOverLength();
            default:
                return false;
        }
    }

    /**
     * lru是否为空
     * @param {string} type
     * @return {boolean}
     */
    _isLruEmpty(type) {
        if (type === TYPE.LF) {
            return this.LFLru.getKeys().length === 0;
        } else {
            return this.HFLru.getKeys().length === 0;
        }
    }

    /**
     * 重置
     * @param {string} type
     * @return boolean
     */
    _reset(type) {
        this._logger({
            type: LOGGER_TYPE.RESET,
            msg: `${type} reset`,
            data: {}
        });

        switch (type) {
            case TYPE.BOTH:
                this.LFLru.reset();
                this.HFLru.reset();
                break;
            case TYPE.HF:
                this.HFLru.reset();
                break;
            case TYPE.LF:
                this.LFLru.reset();
                break;
            default:
                break;
        }
    }
}