import {
	ObjectSet,
	ExtendSet,
	ExtendObjectSet,
} from '@powerful/utils/esm/node';

//region Set
describe('Set', () => {
	test('instanceof', () => {
		const set = new Set();
		expect(set instanceof Set).toEqual(true);
	});

	test('constructor', () => {
		const set = new Set();
		expect(set.constructor).toBe(Set);
	});
});
//endregion
//region ObjectSet
describe('ObjectSet', () => {
	test('instanceof', () => {
		const set = new ObjectSet<string>();
		expect(set instanceof Set).toEqual(true);
		expect(set instanceof ObjectSet).toEqual(true);
	});

	test('constructor', () => {
		const set1 = new ObjectSet<string>(['a', 'b', 'c']);
		expect([...set1]).toEqual(['a', 'b', 'c']);

		const set2 = new ObjectSet<string>(new Set(['a', 'b', 'c']));
		expect([...set2]).toEqual(['a', 'b', 'c']);

		const set3 = new ObjectSet<string>('abc');
		expect([...set3]).toEqual(['a', 'b', 'c']);

		const set4 = new ObjectSet<string>();
		expect([...set4]).toEqual([]);
		expect(set4.constructor).toBe(ObjectSet);
	});

	test('has', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c']);
		expect(set.has('a')).toEqual(true);
		expect(set.has('no')).toEqual(false);
	});

	test('add', () => {
		const set = new ObjectSet<string>();
		set.add('a').add('b').add('a');
		expect([...set]).toEqual(['a', 'b']);
	});

	test('delete', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c']);
		expect(set.delete('b')).toEqual(true);
		expect(set.delete('no')).toEqual(false);
		expect([...set]).toEqual(['a', 'c']);
	});

	test('clear', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c']);
		set.clear();
		expect([...set]).toEqual([]);
	});

	test('size', () => {
		const set = new ObjectSet<string>(['a']);
		expect(set.size).toEqual(1);
		set.add('b').add('a').add('c');
		expect(set.size).toEqual(3);
		set.delete('a');
		expect(set.size).toEqual(2);
		set.delete('no');
		expect(set.size).toEqual(2);
		set.clear();
		expect(set.size).toEqual(0);
	});

	test('order', () => {
		const set1 = new ObjectSet<string>();
		set1.add('a');
		set1.add('b');
		set1.add('c');
		expect([...set1]).toEqual(['a', 'b', 'c']);

		const set2 = new ObjectSet<string>();
		set2.add('a');
		set2.add('c');
		set2.add('b');
		expect([...set2]).toEqual(['a', 'c', 'b']);
	});

	test('forEach', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c']);
		const fn = jest.fn();
		set.forEach(fn);
		expect(fn).toHaveBeenCalledTimes(3);
		expect(fn).toHaveBeenNthCalledWith(1, 'a', 'a', set);
		expect(fn).toHaveBeenNthCalledWith(2, 'b', 'b', set);
		expect(fn).toHaveBeenNthCalledWith(3, 'c', 'c', set);
		const fn2 = jest.fn();
		const thisArg = {};
		set.forEach(fn2, thisArg);
		expect(fn2).toHaveBeenCalledTimes(3);
		expect(fn2).toHaveBeenNthCalledWith(1, 'a', 'a', set);
		expect(fn2.mock.contexts[0]).toBe(thisArg);
		expect(fn2).toHaveBeenNthCalledWith(2, 'b', 'b', set);
		expect(fn2.mock.contexts[1]).toBe(thisArg);
		expect(fn2).toHaveBeenNthCalledWith(3, 'c', 'c', set);
		expect(fn2.mock.contexts[2]).toBe(thisArg);
	});

	test('entries', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c']);
		expect([...set.entries()]).toEqual([['a', 'a'], ['b', 'b'], ['c', 'c']]);
	});

	test('keys', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c']);
		expect([...set.keys()]).toEqual(['a', 'b', 'c']);
	});

	test('values', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c']);
		expect([...set.values()]).toEqual(['a', 'b', 'c']);
	});

	test('intersection', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c', 'd']);
		expect([...set.intersection(new ObjectSet<string>(['c', 'd', 'e', 'f']))]).toEqual(['c', 'd']);
		expect([...set.intersection(new ObjectSet<string>(['c', 'd']))]).toEqual(['c', 'd']);
		expect([...set.intersection(new ObjectSet<string>(['a', 'b', 'c', 'd', 'e']))]).toEqual(['a', 'b', 'c', 'd']);
		expect([...set.intersection(new ObjectSet<string>(['e', 'f']))]).toEqual([]);

		expect([...set.intersection(new Set(['c', 'd', 'e', 'f']))]).toEqual(['c', 'd']);
		expect([...set.intersection(new Set(['c', 'd']))]).toEqual(['c', 'd']);
		expect([...set.intersection(new Set(['a', 'b', 'c', 'd', 'e']))]).toEqual(['a', 'b', 'c', 'd']);
		expect([...set.intersection(new Set(['e', 'f']))]).toEqual([]);
	});

	test('union', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c', 'd']);
		expect([...set.union(new ObjectSet<string>(['c', 'd', 'e', 'f']))]).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
		expect([...set.union(new ObjectSet<string>(['c', 'd']))]).toEqual(['a', 'b', 'c', 'd']);
		expect([...set.union(new ObjectSet<string>(['a', 'b', 'c', 'd', 'e']))]).toEqual(['a', 'b', 'c', 'd', 'e']);
		expect([...set.union(new ObjectSet<string>(['e', 'f']))]).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);

		expect([...set.union(new Set(['c', 'd', 'e', 'f']))]).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
		expect([...set.union(new Set(['c', 'd']))]).toEqual(['a', 'b', 'c', 'd']);
		expect([...set.union(new Set(['a', 'b', 'c', 'd', 'e']))]).toEqual(['a', 'b', 'c', 'd', 'e']);
		expect([...set.union(new Set(['e', 'f']))]).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
	});

	test('difference', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c', 'd']);
		expect([...set.difference(new ObjectSet<string>(['c', 'd', 'e', 'f']))]).toEqual(['a', 'b']);
		expect([...set.difference(new ObjectSet<string>(['c', 'd']))]).toEqual(['a', 'b']);
		expect([...set.difference(new ObjectSet<string>(['a', 'b', 'c', 'd', 'e']))]).toEqual([]);
		expect([...set.difference(new ObjectSet<string>(['e', 'f']))]).toEqual(['a', 'b', 'c', 'd']);

		expect([...set.difference(new Set(['c', 'd', 'e', 'f']))]).toEqual(['a', 'b']);
		expect([...set.difference(new Set(['c', 'd']))]).toEqual(['a', 'b']);
		expect([...set.difference(new Set(['a', 'b', 'c', 'd', 'e']))]).toEqual([]);
		expect([...set.difference(new Set(['e', 'f']))]).toEqual(['a', 'b', 'c', 'd']);
	});

	test('symmetricDifference', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c', 'd']);
		expect([...set.symmetricDifference(new ObjectSet<string>(['c', 'd', 'e', 'f']))]).toEqual(['a', 'b', 'e', 'f']);
		expect([...set.symmetricDifference(new ObjectSet<string>(['c', 'd']))]).toEqual(['a', 'b']);
		expect([...set.symmetricDifference(new ObjectSet<string>(['a', 'b', 'c', 'd', 'e']))]).toEqual(['e']);
		expect([...set.symmetricDifference(new ObjectSet<string>(['e', 'f']))]).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);

		expect([...set.symmetricDifference(new Set(['c', 'd', 'e', 'f']))]).toEqual(['a', 'b', 'e', 'f']);
		expect([...set.symmetricDifference(new Set(['c', 'd']))]).toEqual(['a', 'b']);
		expect([...set.symmetricDifference(new Set(['a', 'b', 'c', 'd', 'e']))]).toEqual(['e']);
		expect([...set.symmetricDifference(new Set(['e', 'f']))]).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
	});

	test('isSubsetOf', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c', 'd']);
		expect(set.isSubsetOf(new ObjectSet<string>(['c', 'd', 'e', 'f']))).toEqual(false);
		expect(set.isSubsetOf(new ObjectSet<string>(['c', 'd']))).toEqual(false);
		expect(set.isSubsetOf(new ObjectSet<string>(['a', 'b', 'c', 'd', 'e']))).toEqual(true);
		expect(set.isSubsetOf(new ObjectSet<string>(['e', 'f']))).toEqual(false);

		expect(set.isSubsetOf(new Set(['c', 'd', 'e', 'f']))).toEqual(false);
		expect(set.isSubsetOf(new Set(['c', 'd']))).toEqual(false);
		expect(set.isSubsetOf(new Set(['a', 'b', 'c', 'd', 'e']))).toEqual(true);
		expect(set.isSubsetOf(new Set(['e', 'f']))).toEqual(false);
	});

	test('isSupersetOf', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c', 'd']);
		expect(set.isSupersetOf(new ObjectSet<string>(['c', 'd', 'e', 'f']))).toEqual(false);
		expect(set.isSupersetOf(new ObjectSet<string>(['c', 'd']))).toEqual(true);
		expect(set.isSupersetOf(new ObjectSet<string>(['a', 'b', 'c', 'd', 'e']))).toEqual(false);
		expect(set.isSupersetOf(new ObjectSet<string>(['e', 'f']))).toEqual(false);

		expect(set.isSupersetOf(new Set(['c', 'd', 'e', 'f']))).toEqual(false);
		expect(set.isSupersetOf(new Set(['c', 'd']))).toEqual(true);
		expect(set.isSupersetOf(new Set(['a', 'b', 'c', 'd', 'e']))).toEqual(false);
		expect(set.isSupersetOf(new Set(['e', 'f']))).toEqual(false);
	});

	test('isDisjointFrom', () => {
		const set = new ObjectSet<string>(['a', 'b', 'c', 'd']);
		expect(set.isDisjointFrom(new ObjectSet<string>(['c', 'd', 'e', 'f']))).toEqual(false);
		expect(set.isDisjointFrom(new ObjectSet<string>(['c', 'd']))).toEqual(false);
		expect(set.isDisjointFrom(new ObjectSet<string>(['a', 'b', 'c', 'd', 'e']))).toEqual(false);
		expect(set.isDisjointFrom(new ObjectSet<string>(['e', 'f']))).toEqual(true);

		expect(set.isDisjointFrom(new Set(['c', 'd', 'e', 'f']))).toEqual(false);
		expect(set.isDisjointFrom(new Set(['c', 'd']))).toEqual(false);
		expect(set.isDisjointFrom(new Set(['a', 'b', 'c', 'd', 'e']))).toEqual(false);
		expect(set.isDisjointFrom(new Set(['e', 'f']))).toEqual(true);
	});
});
//endregion
//region ExtendSet
describe('ExtendSet', () => {
	test('instanceof', () => {
		const set = new ExtendSet();
		expect(set instanceof Set).toEqual(true);
		expect(set instanceof ExtendSet).toEqual(true);
	});

	test('constructor', () => {
		const set1 = new ExtendSet(['a', 'b', 'c']);
		expect([...set1]).toEqual(['a', 'b', 'c']);

		const set2 = new ExtendSet(new Set(['a', 'b', 'c']));
		expect([...set2]).toEqual(['a', 'b', 'c']);

		const set3 = new ExtendSet('abc');
		expect([...set3]).toEqual(['a', 'b', 'c']);

		const set4 = new ExtendSet();
		expect([...set4]).toEqual([]);
		expect(set4.constructor).toBe(ExtendSet);
	});
});
//endregion
//region ExtendObjectSet
describe('ExtendObjectSet', () => {
	test('instanceof', () => {
		const set = new ExtendObjectSet();
		expect(set instanceof Set).toEqual(true);
		expect(set instanceof ObjectSet).toEqual(true);
		expect(set instanceof ExtendObjectSet).toEqual(true);
	});

	test('constructor', () => {
		const set1 = new ExtendObjectSet(['a', 'b', 'c']);
		expect([...set1]).toEqual(['a', 'b', 'c']);

		const set2 = new ExtendObjectSet(new Set(['a', 'b', 'c']));
		expect([...set2]).toEqual(['a', 'b', 'c']);

		const set3 = new ExtendObjectSet('abc');
		expect([...set3]).toEqual(['a', 'b', 'c']);

		const set4 = new ExtendObjectSet();
		expect([...set4]).toEqual([]);
		expect(set4.constructor).toBe(ExtendObjectSet);
	});
});
//endregion