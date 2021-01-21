/**
 * @file 基于lru的低高频缓存策略
 * todo： logger的使用
 */
import LRU from './lru';
import Monitor from './monitor';

const HF_MAX_LENGTH = 10 * 1000;
const LF_MAX_LENGTH = 10 * 1000;
const HF_MAX_AGE = 60 * 1000;
const LF_MAX_AGE = 60 * 1000;
const HF_TIMES = 10;

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
            onLogger = () => {} // 待定
        } = options;

        this.LFLru = new LRU({length: LFLength, maxAge: LFMaxAge, onBeforeDelete});
        this.HFLru = new LRU({length: HFLength, maxAge: HFMaxAge, onBeforeDelete});
        this.frequency = HFTimes;
        this.onUpgrade = onUpgrade;
        this.onDemotion = onDemotion;
    }

    save (options) {

    }

    get(options) {

    }

    delete(key) {
        
    }
}