/**
 * @file lru算法单元测试
 */
import LRU from '../lib/lru'
const chai = require('chai');

const expect = chai.expect;
describe('test lru', function() {
    describe('test lru can run', () => {
        it('test create the instance of lru', () => {
            const lru = new LRU({length: 2});
            const key = 'a1';
            const isSave = lru.save({key: key, value: 12});
            const result = lru.get(key);
            expect(result).to.equal(12);
            expect(isSave).to.be.true;
        });
    });

    describe('test the rank of lru', () => {
        const lru = new LRU({length: 7, maxAge: 1000});
        const keys = {
            a1: 'a1',
            a2: 'a2',
            a3: 'a3',
            a4: 'a4',
            a5: 'a5',
            a6: 'a6',
            a7: 'a7',
            a8: 'a8',
            a9: 'a9'
        };
        lru.save({key: keys.a1, value: 12});
        lru.save({key: keys.a2, value: 10});
        lru.save({key: keys.a3, value: 9});
        lru.save({key: keys.a4, value: 10});
        lru.save({key: keys.a5, value: 91});

        it('test the rank when the container is not full', () => {
            const res1 = lru.get(keys.a4);
            expect(res1).to.equal(10);
            const res2 = lru.link.toArray();
            const res3 = res2.map(item => item.key);
            expect(res3).to.deep.equal(['a4', 'a5', 'a3', 'a2', 'a1']);
        });

        it('test the rank when the container is full', () => {
            lru.save({key: keys.a6, value: 10});
            lru.save({key: keys.a7, value: 9});

            const res = lru.get(keys.a5);
            expect(res).to.equal(91);
            const res1 = lru.get(keys.a3);
            expect(res1).to.equal(9);

            const res2 = lru.link.toArray();
            const res3 = res2.map(item => item.key);
            expect(res3).to.deep.equal(['a3', 'a5', 'a7', 'a6', 'a4', 'a2', 'a1']);
        });

        it('test the rank when the container out of full', () => {
            lru.save({key: keys.a8, value: 11});
            const res1 = lru.link.toArray();
            const res2 = res1.map(item => item.key);
            expect(res2).to.deep.equal(['a8', 'a3', 'a5', 'a7', 'a6', 'a4', 'a2']);
        });
    });

    describe('test expiredTime of lru', () => {
        const lru = new LRU({length: 5, maxAge: 1000});
        const lru1 = new LRU({length: 3, maxAge: 1000});
        const keys = {
            a1: 'a1',
            a2: 'a2',
            a3: 'a3',
            a4: 'a4',
            a5: 'a5',
            a6: 'a6',
            a7: 'a7',
            a8: 'a8',
            a9: 'a9'
        };

        it('test the key is expired when the container is not full', () => {
            lru.save({key: keys.a1, value: 10});
            const result = lru.get(keys.a1);
            expect(result).to.equal(10);
            const not_exist_value = lru.get(keys.a2);
            expect(not_exist_value).to.equal(null);

            setTimeout(() => {
                const result = lru.get(keys.a1);
                expect(result).to.equal(null);
            }, 1001)
        });

        it('test the key is expired when the container is full', () => {
            lru.save({key: keys.a1, value: 10});
            lru.save({key: keys.a2, value: 101});
            lru.save({key: keys.a3, value: 103});
            lru.save({key: keys.a4, value: 104});
            lru.save({key: keys.a5, value: 105});

            setTimeout(() => {
                const result = lru.get(keys.a3);
                expect(result).to.equal(103);
                const res2 = lru.link.toArray();
                const res3 = res2.map(item => item.key);
                expect(res3).to.deep.equal(['a3', 'a5', 'a4', 'a2', 'a1']);
            }, 500);

            setTimeout(() => {
                const result = lru.get(keys.a2);
                expect(result).to.equal(null);
                const res2 = lru.link.toArray();
                const res3 = res2.map(item => item.key);
                expect(res3).to.deep.equal(['a3', 'a5', 'a4']);
            }, 1500);

            setTimeout(() => {
                const result = lru.get(keys.a3);
                expect(result).to.equal(null);
                const res2 = lru.link.toArray();
                const res3 = res2.map(item => item.key);
                expect(res3).to.deep.equal(['a5', 'a4']);
            }, 3000);
        });

        it('test the key is expired when the container is out of full', () => {
            lru1.save({key: keys.a1, value: 10});
            lru1.save({key: keys.a2, value: 101});
            lru1.save({key: keys.a3, value: 103});

            setTimeout(() => {
                lru1.save({key: keys.a4, value: 104});
                const result = lru1.link.toArray().map(item => item.key);
                expect(result).to.deep.equal(['a4', 'a3', 'a2']);
            }, 1200);

            setTimeout(() => {
                const result = lru1.get(keys.a2);
                expect(result).to.equal(null);
                const length = lru1.length();
                expect(length).to.equal(2);
            }, 1300);

            setTimeout(() => {
                lru1.save({key: keys.a3, value: 111});
                const result = lru1.get(keys.a3);
                expect(result).to.equal(111);
                const array = lru1.getKeys(true);
                expect(array).to.deep.equal(['a3', 'a4']);
            }, 1500)
        })
    });

    describe('test the maxAge and expired', () => {
        const lru = new LRU({length: 3, maxAge: 1000});
        const keys = {
            a1: 'a1',
            a2: 'a2',
            a3: 'a3',
            a4: 'a4',
            a5: 'a5',
            a6: 'a6',
            a7: 'a7',
        };

        it('test the key is expired when save key used expired', () => {
            lru.save({key: keys.a1, value: 1});
            lru.save({key: keys.a2, value: 2, expired: 400});
            lru.save({key: keys.a3, value: 3});

            setTimeout(() => {
                const res1 = lru.get(keys.a1);
                const res2 = lru.get(keys.a2);
                expect(res1).to.equal(1);
                expect(res2).to.equal(2);
            }, 300);

            setTimeout(() => {
                const res1 = lru.get(keys.a1);
                const res2 = lru.get(keys.a2);
                expect(res1).to.equal(1);
                expect(res2).to.equal(null);
            }, 800);
        });
    });

    describe('test the expireTime can modify', () => {
        const keys = {
            a1: 'a1',
            a2: 'a2',
            a3: 'a3',
            a4: 'a4',
            a5: 'a5'
        };

        it('test the key can modify when the key is not expired', () => {
            const lru = new LRU({length: 3, maxAge: 1000});
            lru.save({key: keys.a1, value: 12});
            lru.save({key: keys.a2, value: 122, expired: 500});
            lru.save({key: keys.a3, value: 123, expired: 500});

            setTimeout(() => {
                lru.setExpiredTime(keys.a2, 700);
            }, 300);

            setTimeout(() => {
                const res1 = lru.get(keys.a2);
                const res2 = lru.get(keys.a3);
                expect(res1).to.equal(122);
                expect(res2).to.equal(null);
            }, 600)
        });

        it('test the key can modify when the key is expired', () => {
            const lru = new LRU({length: 3, maxAge: 1000});
            lru.save({key: keys.a1, value: 12});
            lru.save({key: keys.a2, value: 122, expired: 500});
            lru.save({key: keys.a3, value: 123, expired: 500});

            setTimeout(() => {
                lru.setExpiredTime(keys.a2, 800);
            }, 600);

            setTimeout(() => {
                const res1 = lru.get(keys.a2);
                const res2 = lru.get(keys.a3);
                expect(res1).to.equal(122);
                expect(res2).to.equal(null);
            }, 700)
        });

        it('test the key can not modify when the key is deleted', () => {
            const lru = new LRU({length: 3, maxAge: 1000});
            lru.save({key: keys.a1, value: 12});
            lru.save({key: keys.a2, value: 122, expired: 500});
            lru.save({key: keys.a3, value: 123, expired: 500});

            setTimeout(() => {
                const res = lru.get(keys.a2);
                expect(res).to.equal(null);
            }, 600);

            setTimeout(() => {
                const res = lru.setExpiredTime(keys.a2, 1000);
                expect(res).to.equal(false);
            }, 605);

            setTimeout(() => {
                const res = lru.get(keys.a2);
                expect(res).to.equal(null);
            }, 1000);
        })
    });

    describe('test the cache can update', () => {
        const keys = {
            a1: 'a1',
            a2: 'a2',
            a3: 'a3',
            a4: 'a4',
            a5: 'a5'
        };

        it('test the value can update when the key is exist and not expired', () => {
            const lru = new LRU({length: 3, maxAge: 1000});
            lru.save({key: keys.a1, value: 12});
            lru.save({key: keys.a2, value: 122, expired: 500});
            lru.save({key: keys.a3, value: 123, expired: 500});

            setTimeout(() => {
                const res = lru.get(keys.a2);
                expect(res).to.equal(122);
            }, 100);

            setTimeout(() => {
                const res1 = lru.forceUpdateCache(keys.a2, 200);
                expect(res1).to.equal(true);
            }, 200);

            setTimeout(() => {
                const res = lru.get(keys.a2);
                expect(res).to.equal(200);
                const value = lru.getValues(true);
                expect(value).to.deep.equal([200, 123, 12]);
            }, 400);
        });

        it('test the value can update when the key is exist and expired', () => {
            const lru = new LRU({length: 3, maxAge: 1000});
            lru.save({key: keys.a1, value: 12});
            lru.save({key: keys.a2, value: 122, expired: 500});
            lru.save({key: keys.a3, value: 123, expired: 500});

            setTimeout(() => {
                const res = lru.get(keys.a2);
                expect(res).to.equal(122);
            }, 100);

            setTimeout(() => {
                const res1 = lru.forceUpdateCache(keys.a2, 200);
                expect(res1).to.equal(false);
            }, 700);

            setTimeout(() => {
                const res = lru.get(keys.a2);
                expect(res).to.equal(null);
                const value = lru.getValues(true);
                expect(value).to.deep.equal([123, 12]);
            }, 800);
        });

        it('test the value can update when the key is deleted', () => {
            const lru = new LRU({length: 3, maxAge: 1000});
            lru.save({key: keys.a1, value: 12});
            lru.save({key: keys.a2, value: 122, expired: 500});
            lru.save({key: keys.a3, value: 123, expired: 500});

            setTimeout(() => {
                const res = lru.get(keys.a2);
                expect(res).to.equal(122);
            }, 100);

            setTimeout(() => {
                const res1 = lru.get(keys.a2);
                expect(res1).to.equal(null);
            }, 700);

            setTimeout(() => {
                const res2 = lru.forceUpdateCache(keys.a2, 200);
                expect(res2).to.equal(false);
            }, 800);
        });
    });

    describe('test the cache refresh', () => {
        const keys = {
            a1: 'a1',
            a2: 'a2',
            a3: 'a3',
            a4: 'a4',
            a5: 'a5'
        };

        it('test the cache refresh when all keys is not expired', () => {
            const lru = new LRU({length: 3, maxAge: 1000});
            lru.save({key: keys.a1, value: 12});
            lru.save({key: keys.a2, value: 122, expired: 500});
            lru.save({key: keys.a3, value: 123, expired: 700});

            setTimeout(() => {
                lru.refresh();
                const res = lru.getKeys(true);
                expect(res).to.deep.equal([keys.a3, keys.a2, keys.a1]);
            }, 300);

            setTimeout(() => {
                lru.save({key: keys.a5, value: 123, expired: 700});
                lru.refresh();
                const res = lru.getKeys(true);
                expect(res).to.deep.equal([keys.a5, keys.a3, keys.a2]);
            }, 400)
        });

        it('test the cache refresh when some keys is not expired', () => {
            const lru = new LRU({length: 3, maxAge: 1000});
            lru.save({key: keys.a1, value: 12});
            lru.save({key: keys.a2, value: 122, expired: 500});
            lru.save({key: keys.a3, value: 123, expired: 700});

            setTimeout(() => {
                lru.refresh();
                const res = lru.getKeys(true);
                expect(res).to.deep.equal([keys.a3, keys.a2, keys.a1]);
            }, 400);

            setTimeout(() => {
                lru.refresh();
                const res = lru.getKeys(true);
                expect(res).to.deep.equal([keys.a3, keys.a1]);
            }, 600)

            setTimeout(() => {
                lru.refresh();
                const res = lru.getKeys(true);
                expect(res).to.deep.equal([keys.a1]);
            }, 800)
        });

        it('test the cache refresh when all keys is expired', () => {
            const lru = new LRU({length: 3, maxAge: 1000});
            lru.save({key: keys.a1, value: 12});
            lru.save({key: keys.a2, value: 122, expired: 500});
            lru.save({key: keys.a3, value: 123, expired: 700});

            setTimeout(() => {
                lru.refresh();
                const res = lru.getKeys(true);
                expect(res).to.deep.equal([]);
            }, 1100)
        })
    });
});