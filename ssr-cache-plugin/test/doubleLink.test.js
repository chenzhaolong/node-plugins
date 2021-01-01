/**
 * @file 双向链表单元测试
 */
import DoubleLink from '../lib/doubleLink'
const chai = require('chai');

const expect = chai.expect;
describe('test.sh doubleLink', function() {
    it('test the double link', () => {
        const nodeList = new DoubleLink(1);
        nodeList.unshift(2);
        const array = nodeList.toArray();
        expect(array).to.deep.equal([2, 1]);
    });

    it('test create the double link by createLinkArray', () => {
        const array = [3, 1, 5, 6, 2];
        const link = DoubleLink.createLinkByArray(array);
        const array1 = link.toArray();
        expect(array1).to.deep.equal(array);
    });

    it('test the link by createLinkArray is equal to the link by constructor', () => {
        const array = [3, 1, 5, 6, 2];
        const link1 = DoubleLink.createLinkByArray(array);
        const array1 = link1.toArray();
        const link2 = new DoubleLink();
        array.forEach(val => {
            link2.push(val);
        });
        const array2 = link2.toArray();
        expect(array1).to.deep.equal(array2)
    });

    it('test the double link when add ele by unshift', () => {
        const array = [{a: 1, b: 2}, {a: 1, b: 3}, {a: 3, b: 5}];
        const link = new DoubleLink();
        array.forEach(ele => {
            link.unshift(ele);
        });
        const a1 = link.toArray();
        expect(a1).to.deep.equal(array.reverse());
        link.shift();
        const a2 = link.toArray();
        array.shift();
        expect(a2).to.deep.equal(array);
    });

    it('test the double link when add ele by push', () => {
        const array = [{a: 1, b: 2}, {a: 1, b: 3}, {a: 3, b: 5}];
        const link = new DoubleLink();
        array.forEach(ele => {
            link.push(ele);
        });
        const a1 = link.toArray();
        expect(a1).to.deep.equal(array);
        link.pop();
        const a2 = link.toArray();
        array.pop();
        expect(a2).to.deep.equal(array);
    });

    it('test the double link when unshift, push, pop, shift', () => {
        const link = new DoubleLink(0);
        const array = [1, 2, 3];
        array.forEach(val => {
            link.push(val);
        });
        expect(link.toArray()).to.deep.equal([0, 1, 2, 3]);
        link.unshift(-1);
        link.push(4);
        link.push(5);
        expect(link.toArray()).to.deep.equal([-1, 0, 1, 2, 3, 4, 5]);
        link.pop();
        link.shift();
        expect(link.toArray()).to.deep.equal([0, 1, 2, 3, 4]);
    });

    
});