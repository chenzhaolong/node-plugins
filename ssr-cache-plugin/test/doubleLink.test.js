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
    })
});