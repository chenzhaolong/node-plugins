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

    it('test the reverse the double link', () => {
        const link = new DoubleLink();
        const array = [1, 2, 3, 4, 5];
        array.forEach(val => {
            link.push(val);
        });
        expect(link.toReveseArray()).to.deep.equal(array.reverse())
    });

    it('test finding the target val', () => {
        const array = [1,3,2,5,7,2];
        const link = DoubleLink.createLinkByArray(array);
        const targetValue = 2;
        const node = link.get(targetValue);
        expect(node.value).to.equal(targetValue);

        const targetValue1 = 10;
        const node1 = link.get(targetValue1);
        expect(node1).to.equal(null);
    });

    it('test finding the target val when val is function', () => {
        const array = [
            {key: 'a1', value: 12},
            {key: 'a2', value: 13},
            {key: 'a3', value: 14},
            {key: 'a4', value: 15},
            {key: 'a5', value: 16}
        ];
        const link = DoubleLink.createLinkByArray(array);
        const targetValue = {key: 'a3', value: 14};
        const node = link.get((item) => item.key === targetValue.key);
        expect(node.value).to.deep.equal(targetValue);

        const node1 = link.get((item) => item.key === 'a6');
        expect(node1).to.equal(null);
    });

    it('test the setting value', () => {
        const link = new DoubleLink();
        const node = link.set(1, 2);
        expect(node).to.equal(null);

        link.push(1);
        link.unshift(1);
        link.set(2, 1);
        expect(link.toArray()).to.deep.equal([1,2,1]);

        link.unshift(3);
        link.set(5, 3, 'before');
        expect(link.toArray()).to.deep.equal([5,3,1,2,1]);

        link.pop();
        link.set(5, 2);
        expect(link.toArray()).to.deep.equal([5,3,1,2,5]);

        link.set(10, 3);
        expect(link.toArray()).to.deep.equal([5,3,10,1,2,5]);
    });

    it('test the remove value', () => {
        const link = DoubleLink.createLinkByArray([1,2,3,4,5]);
        link.remove(3);
        expect(link.toArray()).to.deep.equal([1,2,4,5]);
        link.push(6);
        link.set(3, 4);
        expect(link.toArray()).to.deep.equal([1,2,4,3,5,6]);

        const array = [
            {key: 'a1', value: 12},
            {key: 'a2', value: 13},
            {key: 'a3', value: 14},
            {key: 'a4', value: 15},
            {key: 'a5', value: 16}
        ];
        const link1 = DoubleLink.createLinkByArray(array);
        link1.remove(item => item.key === 'a4');
        expect(link1.toArray()).to.deep.equal([
            {key: 'a1', value: 12},
            {key: 'a2', value: 13},
            {key: 'a3', value: 14},
            {key: 'a5', value: 16}
        ]);
    });

    
});