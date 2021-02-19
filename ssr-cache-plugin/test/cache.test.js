/**
 * @file 高低频lru算法单元测试
 */
import Cache from '../lib/cache'
const chai = require('chai');

const expect = chai.expect;
describe('test HLF-LRU', () => {
    const keys = {
        a1: {key: 'a1', value: 1},
        a2: {key: 'a2', value: 2},
        a3: {key: 'a3', value: 3},
        a4: {key: 'a4', value: 4},
        a5: {key: 'a5', value: 5},
        a6: {key: 'a6', value: 6},
        a7: {key: 'a7', value: 7}
    };

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

    describe('test the LF-LRU', () => {
        it('test the LF-LRU is full', () => {
            const cache = new Cache({
                LFLength: 2,
                LFMaxAge: 1000
            });
            cache.save(keys.a1);
            cache.save(keys.a2);

            setTimeout(() => {
                const res = cache.get(keys.a1.key);
                expect(res).to.equal(keys.a1.value);
            }, 100);

            setTimeout(() => {
                cache.save(keys.a3);
                const res = cache.get(keys.a2.key);
                expect(res).to.equal(null);
            }, 300);
        });

        it('test the LF-LRU is expired', () => {
            const cache = new Cache({
                LFLength: 2,
                LFMaxAge: 1000
            });
            cache.save(keys.a1);
            cache.save(keys.a2);

            setTimeout(() => {
                const res = cache.get(keys.a1.key);
                cache.save(keys.a4);
                expect(res).to.equal(keys.a1.value);
            }, 900);

            setTimeout(() => {
                const res = cache.get(keys.a2.key);
                expect(res).to.equal(null);
            }, 1001);

            setTimeout(() => {
                const res = cache.get(keys.a4.key);
                expect(res).to.equal(null);
            }, 3000);
        });

        it('test the LF-LRU delete key', () => {
            const cache = new Cache({
                LFLength: 2,
                LFMaxAge: 1000
            });
            cache.save(keys.a1);
            cache.save(keys.a2);

            setTimeout(() => {
                cache.delete(keys.a1.key);
                cache.save(keys.a5);
            }, 100);

            setTimeout(() => {
                const res = cache.get(keys.a5.key);
                const res1 = cache.get(keys.a1.key);
                expect(res).to.equal(keys.a5.value);
                expect(res1).to.equal(null);
            }, 200);

            setTimeout(() => {
                const array = cache.getKeys(true);
                expect(array.LFKeys).to.deep.equal(['a5', 'a2']);
                expect(array.HFKeys).to.deep.equal([]);
            }, 300)
        });
    });

    describe('test the HF-LRU', () => {
        it('test the HF-LRU can save and get', () => {
            const cache = new Cache({
                LFLength: 2,
                LFMaxAge: 1000,
                HFLength: 3,
                HFMaxAge: 1000,
                HFTimes: 2
            });
            cache.save(keys.a1);
            cache.save(keys.a2);

            setTimeout(() => {
                
            }, 100)
        });

        it('test the HF-LRU is full', () => {});

        it('test the key of HF-LRU is expired', () => {});

        it('test the HF-LRU delete key')
    });

    describe('test the upgrade and demotion', () => {

    });

    describe('test the refresh', () => {

    });

    describe('test the monitor', () => {

    });

    describe('test the others', () => {

    });
});