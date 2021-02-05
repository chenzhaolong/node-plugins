/**
 * @file 监控器
 * 大于60：HFL只出不进, LFL正常；
 * 大于70：HFL清空且不能进，LFL正常;
 * 大于80：LFL只出不进；
 */
import { debounce } from 'lodash';
const os = require('os');
const heapdump = require('heapdump');

let Options = {
    warningFn: '',
    openMonitor: '',
    memFilePath: ''
};

export default class Monitor {

    static injectExtraPower (options) {
        Options = {
            warningFn: options.onNoticeForOOM,
            openMonitor: options.openMonitor,
            memFilePath: options.memFilePath
        }
    }

    /**
     * 是否到达三级告警：内存使用率在60%以上
     */
    static isArriveThreeLevel (mem) {
        return Options.openMonitor && mem >= 60 && mem < 70;
    }

    /**
     * 是否到达二级警告：内存使用率在70%以上
     */
    static isArriveTwoLevel (mem) {
        return Options.openMonitor && mem >= 70 && mem < 80;
    }

    /**
     * 是否到达一级警告：内存使用率在80%以上
     */
    static isArriveOneLevel (mem) {
        return Options.openMonitor && mem >= 80;
    }

    /**
     * warn触发，日志输出, 溢出内存文件输出，1分钟输出一次（防抖）
     */
    static takeAction (mem) {
        const {openMonitor, memFilePath, warningFn} = Options;
        if (openMonitor) {
            const noticeFn = debounce(() => {
                warningFn(mem);
                const date = (new Date()).toLocaleDateString().replace(/[\/]/g, '.');
                heapdump.writeSnapshot(`${memFilePath}/snapShot_${date}.heapsnapshot`);
            }, 60 * 1000);
            noticeFn();
        }
    }

    static computedMemory() {
        if (!Options.openMonitor) {
            return 0;
        }
        const total = os.totalmem();
        const free = os.freemem();
        return Math.round(((total - free) / total) * 100);
    }
}