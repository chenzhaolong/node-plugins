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
                const res = cache.get(keys.a1.key);
                expect(res).to.equal(keys.a1.value);
            }, 100);

            setTimeout(() => {
                const res = cache.get(keys.a2.key);
                expect(res).to.equal(keys.a2.value);
            }, 200);

            setTimeout(() => {
                const res = cache.get(keys.a1.key);
                expect(res).to.equal(keys.a1.value);
            }, 300);

            setTimeout(() => {
                const res = cache.get(keys.a1.key);
                expect(res).to.equal(keys.a1.value);
            }, 400);

            setTimeout(() => {
                const res = cache._has(keys.a1.key, 'hf');
                const res1 = cache._has(keys.a1.key, 'lf');
                expect(res).to.equal(true);
                expect(res1).to.equal(false);
            }, 500);
        });

        it('test the key is existed in HF when save this key', () => {
            const cache = new Cache({
                LFLength: 3,
                LFMaxAge: 1000,
                HFLength: 2,
                HFMaxAge: 1000,
                HFTimes: 2
            });

            cache.save(keys.a1);
            cache.save(keys.a2);
            cache.save(keys.a3);

            setTimeout(() => {
                const res = cache.get(keys.a2.key);
                expect(res).to.equal(keys.a2.value);
            }, 100);

            setTimeout(() => {
                const res = cache.get(keys.a2.key);
                expect(res).to.equal(keys.a2.value);

                const res1 = cache._has(keys.a2.key, 'hf');
                const res2 = cache._has(keys.a2.key, 'lf');
                expect(res1).to.equal(true);
                expect(res2).to.equal(false);
            }, 200);

            setTimeout(() => {
                cache.save({key: keys.a2.key, value: 10});
                const res = cache.get(keys.a2.key);
                expect(res).to.equal(10);

                const res1 = cache._has(keys.a2.key, 'hf');
                const res2 = cache._has(keys.a2.key, 'lf');
                expect(res1).to.equal(true);
                expect(res2).to.equal(false);
            }, 300);

            setTimeout(() => {
                cache.save({key: keys.a2.key, value: 11});
                const res = cache.get(keys.a2.key);
                expect(res).to.equal(11);

                const res1 = cache._has(keys.a2.key, 'hf');
                const res2 = cache._has(keys.a2.key, 'lf');
                expect(res1).to.equal(false);
                expect(res2).to.equal(true);
            }, 2000);
        });

        it('test the HF-LRU is full', () => {
            const cache = new Cache({
                LFLength: 3,
                LFMaxAge: 1000,
                HFLength: 2,
                HFMaxAge: 1000,
                HFTimes: 2
            });

            cache.save(keys.a1);
            cache.save(keys.a2);

            setTimeout(() => {
                cache.get(keys.a1.key);
            }, 100);

            setTimeout(() => {
                cache.get(keys.a2.key);
            }, 110);

            setTimeout(() => {
                cache.get(keys.a2.key);
            }, 120);

            setTimeout(() => {
                cache.get(keys.a1.key);
            }, 130);

            setTimeout(() => {
                cache.save(keys.a3);
                cache.save(keys.a4);
                cache.save(keys.a5);
            }, 200);

            setTimeout(() => {
                cache.get(keys.a3.key);
                cache.get(keys.a3.key);
            }, 210);

            setTimeout(() => {
                const res = cache._has(keys.a1.key, 'hf');
                const res1 = cache._has(keys.a2.key, 'hf');
                const res2 = cache._has(keys.a3.key, 'hf');
                const res3 = cache._has(keys.a2.key, 'lf');
                expect(res).to.equal(true);
                expect(res1).to.equal(false);
                expect(res2).to.equal(true);
                expect(res3).to.equal(true);
            }, 220);

            setTimeout(() => {
                cache.save(keys.a6);
                const res = cache._has(keys.a4.key, 'lf');
                expect(res).to.equal(false);
            }, 250);

            setTimeout(() => {
                cache.get(keys.a5.key);
                cache.get(keys.a3.key);
                cache.get(keys.a5.key);
                cache.get(keys.a5.key);
            }, 250);

            setTimeout(() => {
                const {LFKeys, HFKeys} = cache.getKeys(true);
                expect(LFKeys).to.deep.equal(['a1', 'a6', 'a2']);
                expect(HFKeys).to.deep.equal(['a5', 'a3']);
            }, 300);
        });

        it('test the key of HF-LRU is expired', () => {
            const cache = new Cache({
                LFLength: 3,
                LFMaxAge: 1000,
                HFLength: 2,
                HFMaxAge: 1000,
                HFTimes: 2
            });
            cache.save(keys.a1);
            cache.save(keys.a3);

            setTimeout(() => {
                cache.get(keys.a1.key);
                cache.get(keys.a1.key);
            }, 100);

            setTimeout(() => {
                cache.save({key: keys.a2.key, value: keys.a2.value, expired: 100});
                cache.get(keys.a2.key);
                cache.get(keys.a2.key);
                cache.get(keys.a1.key);
                cache.get(keys.a1.key);
                cache.get(keys.a3.key);
            }, 200);

            setTimeout(() => {
                cache.get(keys.a3.key);
                const res = cache.get(keys.a2.key);
                expect(res).to.equal(null);
                const res1 = cache._has('a2', 'hf');
                const res2 = cache._has('a2', 'lf');
                expect(res1).to.equal(false);
                expect(res2).to.equal(false);
            }, 900)
        });

        it('test the HF-LRU delete key', () => {
            const cache = new Cache({
                LFLength: 3,
                LFMaxAge: 1000,
                HFLength: 2,
                HFMaxAge: 1000,
                HFTimes: 2
            });
            cache.save({key: keys.a1.key, value: keys.a1.value, expired: 200});
            cache.save({key: keys.a2.key, value: keys.a2.value, expired: 300});

            setTimeout(() => {
                cache.save({key: keys.a3.key, value: keys.a3.value, expired: 500});
                cache.get(keys.a1.key);
                cache.get(keys.a1.key);
                cache.get(keys.a2.key);
                cache.get(keys.a2.key);
            }, 100);

            // 保存时删除
            setTimeout(() => {
                cache.save(keys.a1);
                const res1 = cache._has(keys.a1.key, 'hf');
                const res2 = cache._has(keys.a1.key, 'lf');
                expect(res1).to.equal(false);
                expect(res2).to.equal(true);
            }, 500);

            // 降级时删除
            setTimeout(() => {
                cache.get(keys.a1.key);
                cache.get(keys.a1.key);
                cache.get(keys.a3.key);
                cache.get(keys.a3.key);
                const res1 = cache._has(keys.a1.key, 'hf');
                const res2 = cache._has(keys.a1.key, 'lf');
                expect(res1).to.equal(true);
                expect(res2).to.equal(false);

                const res3 = cache._has(keys.a2.key, 'hf');
                const res4 = cache._has(keys.a2.key, 'lf');
                expect(res3).to.equal(false);
                expect(res4).to.equal(false);
            }, 550);

            // 获取时删除
            setTimeout(() => {
                const res = cache.get(keys.a3.key);
                const res1 = cache._has(keys.a3.key, 'hf');
                const res2 = cache._has(keys.a3.key, 'lf');
                expect(res).to.equal(null);
                expect(res1).to.equal(false);
                expect(res2).to.equal(false);
            }, 1500)
        })
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