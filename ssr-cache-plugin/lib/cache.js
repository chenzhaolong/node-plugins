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
     */
    getKeys(type) {

    }

    /**
     * 获取lru的value值
     */
    getValues(key) {

    }

    /**
     * 是否能升级
     */
    _canUpgrade(key) {

    }

    /**
     * 是否能降级
     */
    _canDemotion(key) {

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

    /**
     * 升级
     */
    _uograde(key) {

    }

    /**
     * 降级
     */
    _demotion(key) {

    }

    _logger(type, msg) {

    }

    /**
     * 是否过期
     */
    _isExpired(key, type) {

    }

    /**
     * 是否有key
     */
    _has(key, type) {
        switch (type) {
            case TYPE.BOTH:
                return this.LFLru.has(key) && this.HFLru.has(key);
            case TYPE.HF:
                return this.HFLru.has(key);
            case TYPE.LF:
                return this.LFLru.has(key);
            default:
                return false;
        }
    }

    /**
     * 是否已满
     */
    _isOverLength(type) {

    }

    /**
     * 重置
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