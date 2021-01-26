/**
 * @file 基于lru的低高频缓存策略
 * todo： logger的使用
 */
import LRU from './lru';
import Monitor from './monitor';
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
  OTHER: 'other',
  WARN: 'warn'
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
            onLogger = () => {}, // 日志
            onWarning = () => {}, // 警告函数
            openMonitor = true, // 是否开启内存监控
            memFilePath = path.resolve(__dirname, '../menFile/') // 溢出文件的存储位置
        } = options;

        this.LFLru = new LRU({length: LFLength, maxAge: LFMaxAge, onBeforeDelete});
        this.HFLru = new LRU({length: HFLength, maxAge: HFMaxAge, onBeforeDelete});
        this.frequency = HFTimes;
        this.onUpgrade = onUpgrade;
        this.onDemotion = onDemotion;

        Monitor.injectExtraPower({
            onWarning, openMonitor, memFilePath,
            logger: (msg) => {
                this._logger(LOGGER_TYPE.WARN, msg);
            }
        });
    }

    /**
     * 保存数据
     */
    save (options) {

    }

    /**
     * 获取数据
     */
    get(options) {

    }

    /**
     * 删除数据
     */
    delete(key) {

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
     * @param {Object} node
     * @return boolean
     */
    _canUpgrade(node) {
        const {times = 0} = node.value.extra;
        return times >= this.frequency;
    }

    /**
     * 升级
     * @param {Object} node
     */
    _uograde(node) {
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
     * 是否能降级
     */
    _canDemotion(node) {

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
        }
    }

    /**
     * 停止存入
     */
    _stopSave(type) {

    }

    /**
     * 恢复存入
     */
    restoreSave(type) {

    }

    _logger(type, msg) {

    }

    /**
     * 是否过期
     */
    _isExpired(key) {
        if (this.LFLru.isExpired(key)) {
            return true;
        } else if (this.HFLru.isExpired(key)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 是否有key
     * @param {string | number} key
     * @return boolean
     */
    _has(key) {
        if (this.LFLru.has(key)) {
            return true
        } else if (this.HFLru.has(key)) {
            return true;
        } else {
            return false;
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
     * 重置
     * @param {string} type
     * @return boolean
     */
    _reset(type) {
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