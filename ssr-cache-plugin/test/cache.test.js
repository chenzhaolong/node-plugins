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
                HFTimes: 2
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

        it('test the cache result is from HF-LRU', () => {
            const cache = new Cache({
                HFLength: 2,
                HFMaxAge: 1000,
                LFLength: 2,
                LFMaxAge: 1000,
                HFTimes: 2
            });

            cache.save({
                key: 'a1',
                value: 1
            });

            cache.save({
                key: 'a2',
                value: 2
            });

            setTimeout(() => {
                const res = cache.get('a1');
                expect(res).to.equal(1);
            }, 50);

            setTimeout(() => {
                const res = cache.get('a1');
                expect(res).to.equal(1);
            }, 100);

            setTimeout(() => {
                const res = cache.get('a2');
                expect(res).to.equal(2);
            }, 150);

            setTimeout(() => {
                cache.save({
                   key: 'a3',
                   value: 3
                });
                const res = cache.get('a1');
                expect(res).to.equal(1);
            }, 200);

            setTimeout(() => {
                cache.save({
                    key: 'a4',
                    value: 4
                });
                const res = cache.get('a2');
                expect(res).to.equal(null);
            }, 300);
        });
    });
    
});