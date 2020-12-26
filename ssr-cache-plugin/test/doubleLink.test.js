/**
 * @file 双向链表单元测试
 */
import DoubleLink from '../lib/doubleLink'
const chai = require('chai');

const expect = chai.expect;
describe('test.sh doubleLink', function() {
    it('test the double list', () => {
        const nodeList = new DoubleLink(1);
        nodeList.unshift(2);
        const array = nodeList.toArray();
        expect(array[0]).to.equal(2);
        expect(array[1]).to.equal(1);
    })
});