/**
 * @file 双向链表
 */
import {isNull, isArray} from 'lodash';

/**
 * List 节点
 * @param val 节点的值
 */
function ListNode(val) {
    this.value = val;
    this.prev = null;
    this.next = null;
}

export default class DoubleLink {
    constructor(val) {
        const node = val ? new ListNode(val) : null;
        this.head = node;
        this.tail = node;
        this.current = null;
        this.length = isNull(node) ? 0 : 1;
    }

    static createLinkByArray (array) {
        if (isArray(array)) {

        } else {
            throw new Error('the param must be array!');
        }
    }

    /**
     * 获取链表长度
     * @return {number}
     */
    getLength () {

    }

    /**
     * 头部插入
     * @param {String} key
     * @param {any} val
     * @return {ListNode}
     */
    unshift (key, val) {

    }

    /**
     * 头部移出
     * @return {ListNode}
     */
    shift () {

    }

    /**
     * 尾部插入
     * @param {String} key
     * @param {any} val
     * @return {ListNode}
     */
    push (key, val) {

    }

    /**
     * 尾部移出
     * @return {ListNode}
     */
    pop () {

    }

    /**
     * 转成成数组
     * @return {Array}
     */
    toArray () {

    }

    /**
     * 获取key的节点
     * @param {String} key
     * @return {ListNode}
     */
    get (key) {

    }

    /**
     * 将某个节点放到制定节点之后或者之前
     * @param {String} key
     * @param {any} val
     * @param {String} targetKey
     * @param {String} position
     * @return {ListNode}
     */
    set (key, val, targetKey, position) {

    }

    /**
     * 删除制定的key
     * @param {String} key
     * @return {ListNode}
     */
    remove (key) {

    }

    /**
     * 是否存在key
     * @param {String} key
     * @return {Boolean}
     */
    has (key) {

    }

    /**
     * 对节点进行处理
     * @param {Function} callback
     */
    map (callback) {

    }

    /**
     * 对节点进行遍历
     * @param {Function} callback
     */
    forEach (callback) {

    }

    /**
     * 重置DoubleList
     */
    reset () {

    }
}