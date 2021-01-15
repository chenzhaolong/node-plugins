/**
 * @file lru算法单元测试
 */
import LRU from '../lib/lru'
const chai = require('chai');

const expect = chai.expect;
describe('test lru', function() {
    it('test create the instance of lru', () => {
        const lru = new LRU({length: 2});
        const key = 'a1';
        const isSave = lru.save({key: key, value: 12});
        const result = lru.get(key);
        expect(result).to.equal(12);
        expect(isSave).to.be.true;
    })
});