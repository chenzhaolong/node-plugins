/**
 * @file 监控器
 */

export default class Monitor {
    static options = {
        warningFn: '',
        openMonitor: '',
        memFilePath: ''
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
    static isArriveThreeLevel () {

    }

    /**
     * warn触发，日志输出, 溢出内存文件输出
     */
    static takeActionForThreeLevel () {

    }

    /**
     * 是否到达二级警告：内存使用率在70%以上
     */
    static isArriveTwoLevel () {

    }

    /**
     * warn触发，日志输出, 溢出内存文件输出, HF只出不进
     */
    static takeActionForTwoLevel () {

    }

    /**
     * 是否到达一级警告：内存使用率在80%以上
     */
    static isArriveOneLevel () {

    }

    /**
     * warn触发，日志输出, 溢出内存文件输出, LF只出不进, HF清空
     */
    static takeActionForOneLevel () {

    }
}