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
    });

    // describe('test the key is exist', () => {})
});