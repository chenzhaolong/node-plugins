/**
 * @file 监控器
 */
const os = require('os');
const heapdump = require('heapdump');

export default class Monitor {
    static options = {
        warningFn: '',
        openMonitor: '',
        memFilePath: '',
        logger: () => {}
    };

    static injectExtraPower (options) {
        Monitor.options = {
            warningFn: options.onWarning,
            openMonitor: options.openMonitor,
            memFilePath: options.memFilePath,
            logger: options.logger
        }
    }

    /**
     * 是否到达三级告警：内存使用率在60%以上
     */
    static isArriveThreeLevel (mem) {
        return mem > 60;
    }

    /**
     * 是否到达二级警告：内存使用率在70%以上
     */
    static isArriveTwoLevel (mem) {
        return mem > 70;
    }

    /**
     * 是否到达一级警告：内存使用率在80%以上
     */
    static isArriveOneLevel (mem) {
        return mem > 80;
    }

    /**
     * warn触发，日志输出, 溢出内存文件输出, LF只出不进, HF清空
     */
    static takeActionForOneLevel () {

    }

    /**
     * warn触发，日志输出, 溢出内存文件输出, HF只出不进
     */
    static takeActionForTwoLevel () {

    }

    /**
     * warn触发，日志输出, 溢出内存文件输出
     */
    static takeAction (mem) {
        const {openMonitor, memFilePath, warningFn, logger} = Monitor.options;
        if (openMonitor) {
            warningFn();
            logger({type: 'warn', msg: `mem used ${mem}%`});
            const str = (new Date()).toLocaleDateString().replace(/[\/]/g, '.');
            heapdump.writeSnapshot(`${memFilePath}_${str}.heapsnapshot`);
        }
    }

    static computedMemory() {
        const total = os.totalmem();
        const free = os.freemem();
        return Math.round(((total - free) / total) * 100);
    }
}