/**
 * @file 双向链表
 */
import {isNull, isArray, isFunction, isNumber, isBoolean} from 'lodash';

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
        const node = val || isNumber(val) ? new ListNode(val) : null;
        this.head = node;
        this.tail = node;
        this.length = isNull(node) ? 0 : 1;
    }

    static createLinkByArray (array) {
        if (isArray(array)) {
            const list = new DoubleLink(array[0]);
            array.forEach((val, index) => {
                if (index !== 0) {
                    list.push(val)
                }
            });
            return list;
        } else {
            throw new Error('the param must be array!');
        }
    }

    /**
     * 获取链表长度
     * @return {number}
     */
    getLength () {
        return this.length;
    }

    /**
     * 头部插入
     * @param {any} val
     * @return {ListNode}
     */
    unshift (val) {
        const node = new ListNode(val);
        this.length = this.length + 1;
        // 补充初始化
        if (isNull(this.tail) && isNull(this.head)) {
            this.tail = this.head = node;
        } else {
            this.head.prev = node;
            node.next = this.head;
            this.head = node;
        }
        return node;
    }

    /**
     * 头部移出
     * @return {ListNode}
     */
    shift () {
        if (isNull(this.head)) {
            return null
        }
        this.length = this.length - 1;
        const head = this.head;
        const next = this.head.next;
        next.prev = null;
        head.next = null;
        this.head = next;
        return head;
    }

    /**
     * 尾部插入
     * @param {any} val
     * @return {ListNode}
     */
    push (val) {
        const node = new ListNode(val);
        this.length = this.length + 1;
        // 补充初始化
        if (isNull(this.tail) && isNull(this.head)) {
            this.tail = this.head = node;
        } else {
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
        }
        return node;
    }

    /**
     * 尾部移出
     * @return {ListNode}
     */
    pop () {
        if (isNull(this.head)) {
            return null
        }
        this.length = this.length - 1;
        const tail = this.tail;
        const prev = this.tail.prev;
        prev.next = null;
        tail.prev = null;
        this.tail = prev;
        return tail;
    }

    /**
     * 转成数组
     * @return {Array}
     */
    toArray () {
        const array = [];
        let node = this.head;
        while(node) {
            array.push(node.value);
            node = node.next;
        }
        return array;
    }

    /**
     * 转成反向数组
     * @return {Array}
     */
    toReveseArray () {
        const array = [];
        let node = this.tail;
        while(node) {
            array.push(node.value);
            node = node.prev;
        }
        return array;
    }

    /**
     * 获取key的节点
     * @param {any | Function} target
     * @return {ListNode}
     */
    get (target) {
        let node = this.head;
        let found = false;
        while (node && !found) {
            const value = node.value;
            found = isFunction(target) ? target(value) : target === value;
            node = isBoolean(found) && found ? node : node.next;
        }
        return isNull(node) ? null : node;
    }

    /**
     * 将某个节点放到制定节点之后或者之前
     * @param {any} val
     * @param {String | Function} targetValue
     * @param {String} position
     * @return {ListNode}
     */
    set (val, targetValue, position = 'after') {
        let current = this.get(targetValue);
        if (isNull(current)) {
            return null
        }
        const node = new ListNode(val);
        if (position === 'after') {
            const next = current.next;
            current.next = node;
            node.prev = current;
            node.next = next;
            if (isNull(next)) {
                this.tail = node;
            } else {
                next.prev = node;
            }
        } else {
            const prev = current.prev;
            current.prev = node;
            node.next = current;
            node.prev = prev;
            // 是否为头结点
            if (isNull(prev)) {
                this.head = node;
            } else {
                prev.next = node;
            }
        }
        this.length = this.length + 1;
        return node;
    }

    /**
     * 删除制定的key
     * @param {String | Function} val
     * @return {ListNode}
     */
    remove (val) {
        let current = this.get(val);
        const prev = current.prev;
        const next = current.next;
        prev.next = next;
        next.prev = prev;
        current.prev = null;
        current.next = null;
        this.length = this.length - 1;
        return current;
    }

    /**
     * 是否存在key
     * @param {String | Function} val
     * @return {Boolean}
     */
    has (val) {
        const current = this.get(val);
        return isNull(current);
    }

    /**
     * 对节点进行处理
     * @param {Function} callback
     * @return {ListNode}
     */
    map (callback) {
        let node = this.head;
        for (let i = 0; i < this.length; i++) {
            node.value = isFunction(callback) ? callback(node.value, i) : node.value;
            node = node.next;
        }
        return this.head;
    }

    /**
     * 对节点进行遍历
     * @param {Function} callback
     */
    forEach (callback) {
        let node = this.head;
        for (let i = 0; i < this.length; i++) {
            node.value = isFunction(callback) ? callback(node.value, i) : node.value;
            node = node.next;
        }
    }

    /**
     * 重置DoubleList
     * @param {any} val
     */
    reset (val) {
        const node = val ? new ListNode(val) : null;
        this.head = node;
        this.tail = node;
        this.length = isNull(node) ? 0 : 1;
    }
}