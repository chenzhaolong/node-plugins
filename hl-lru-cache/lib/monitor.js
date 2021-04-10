/**
 * @file 监控器
 * 大于70：HFL只出不进, LFL正常；
 * 大于80：HFL清空且不能进，LFL正常;
 * 大于85：LFL只出不进；
 */
const heapdump = require('heapdump');
const fs = require('fs');
const path = require('path');

let Options = {
    warningFn: () => {},
    openMonitor: false,
    memFilePath: path.resolve(process.cwd(), '../memSnapShot/'),
    memoryLimit: {
        oneLevel: 85,
        twoLevel: 80,
        threeLevel: 70
    }
};

class Monitor {

    static injectExtraPower (options) {
        let tmp = Object.assign({}, Options.memoryLimit, options.memoryLimit);
        // 保证升序
        const tmpValues = [tmp.oneLevel, tmp.twoLevel, tmp.threeLevel].sort((a, b) => a - b);
        Options = {
            warningFn: options.onNoticeForOOM,
            openMonitor: options.openMonitor,
            memFilePath: options.memFilePath,
            memoryLimit: {
                oneLevel: tmpValues[2],
                twoLevel: tmpValues[1],
                threeLevel: tmpValues[0]
            }
        }
    }

    /**
     * 是否到达三级告警：默认内存使用率在70%以上
     */
    static isArriveThreeLevel (mem) {
        return Options.openMonitor && mem >= Options.memoryLimit.threeLevel && mem < Options.memoryLimit.twoLevel;
    }

    /**
     * 是否到达二级警告：默认内存使用率在80%以上
     */
    static isArriveTwoLevel (mem) {
        return Options.openMonitor && mem >= Options.memoryLimit.twoLevel && mem < Options.memoryLimit.oneLevel;
    }

    /**
     * 是否到达一级警告：默认内存使用率在85%以上
     */
    static isArriveOneLevel (mem) {
        return Options.openMonitor && mem >= Options.memoryLimit.oneLevel;
    }

    /**
     * warn触发，日志输出, 溢出内存文件输出
     */
    static takeAction (mem) {
        const {openMonitor, memFilePath, warningFn} = Options;
        if (openMonitor) {
            warningFn(mem);
            if (!fs.existsSync(memFilePath)) {
                fs.mkdirSync(memFilePath);
            }
            const date = Date.now();
            heapdump.writeSnapshot(`${memFilePath}/snapShot_${date}.heapsnapshot`);
        }
    }

    static computedMemory() {
        if (!Options.openMonitor) {
            return 0;
        }
        const {heapTotal, heapUsed} = process.memoryUsage();
        return Math.round(((heapUsed) / heapTotal) * 100);
    }
}

module.exports = Monitor;