/**
 * @file 高低频lru算法单元测试
 */
import Cache from '../lib/cache'
const chai = require('chai');

const expect = chai.expect;
describe('test HLF-LRU', () => {
    describe('test the cache can run', () => {
        it('create cache and save and get it', () => {
            const cache = new Cache({
                HFLength: 3,
                HFMaxAge: 1000,
                LFLength: 5,
                LFMaxAge: 1000,
                HFTimes: 2,
                openMonitor: false
            });

            cache.save({
                key: 'a1',
                value: 1
            });

            setTimeout(() => {
                const res = cache.get('a1');
                expect(res).to.equal(1);
            }, 490);
        });
    })
});