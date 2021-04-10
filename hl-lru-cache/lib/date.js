/**
 * @file 获取系统时间
 */

function getSystemTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const milSec = date.getMilliseconds();
    return {
        systemTime: `${year}-${month}-${day} ${hour}:${minute}:${second} ${milSec}`,
        time: date.getTime()
    }
}

module.exports = {
    getSystemTime
}