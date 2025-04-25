import {
	ObjectMap,
	ExtendMap,
	ExtendObjectMap,
} from '@powerful/utils/esm/node';

//region Map
describe('Map', () => {
	test('instanceof', () => {
		const map = new Map();
		expect(map instanceof Map).toEqual(true);
	});

	test('constructor', () => {
		const map = new Map();
		expect(map.constructor).toEqual(Map);
	});
});
//endregion
//region ObjectMap
describe('ObjectMap', () => {
	test('instanceof', () => {
		const map = new ObjectMap<string, string>();
		expect(map instanceof Map).toEqual(true);
		expect(map instanceof ObjectMap).toEqual(true);
	});

	test('constructor', () => {
		const map1 = new ObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect([...map1]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);

		const map2 = new ObjectMap<string, any>(new Map<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]));
		expect([...map2]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);

		const map3 = new ObjectMap<string, string>();
		expect([...map3]).toEqual([]);
		expect(map3.constructor).toEqual(ObjectMap);
	});

	test('has', () => {
		const map = new ObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(map.has('a')).toEqual(true);
		expect(map.has('b')).toEqual(true);
		expect(map.has('c')).toEqual(true);
		expect(map.has('d')).toEqual(true);
		expect(map.has('e')).toEqual(true);
		expect(map.has('f')).toEqual(true);
		expect(map.has('no')).toEqual(false);
	});

	test('get', () => {
		const map = new ObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(map.get('a')).toEqual('1');
		expect(map.get('b')).toEqual(null);
		expect(map.get('c')).toEqual(undefined);
		expect(map.get('d')).toEqual(11);
		expect(map.get('e')).toEqual(true);
		expect(map.get('f')).toEqual(false);
		expect(map.get('no')).toEqual(undefined);
	});

	test('set', () => {
		const map = new ObjectMap<string, any>();
		map.set('a', '1')
			.set('b', null)
			.set('c', undefined)
			.set('d', 11)
			.set('e', true)
			.set('f', false)
			.set('a', '10');
		expect([...map]).toEqual([
			['a', '10'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
	});

	test('delete', () => {
		const map = new ObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
			['o', '1'],
		]);
		expect(map.delete('a')).toEqual(true);
		expect(map.delete('b')).toEqual(true);
		expect(map.delete('c')).toEqual(true);
		expect(map.delete('d')).toEqual(true);
		expect(map.delete('e')).toEqual(true);
		expect(map.delete('f')).toEqual(true);
		expect(map.delete('no')).toEqual(false);
		expect([...map]).toEqual([
			['o', '1'],
		]);
	});

	test('clear', () => {
		const map = new ObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		map.clear();
		expect([...map]).toEqual([]);
	});

	test('size', () => {
		const map = new ObjectMap<string, any>([
			['a', '1'],
		]);
		expect(map.size).toEqual(1);
		map.set('b', null)
			.set('c', undefined)
			.set('d', 11)
			.set('e', true)
			.set('f', false)
			.set('a', '10');
		expect(map.size).toEqual(6);
		map.delete('a');
		expect(map.size).toEqual(5);
		map.delete('no');
		expect(map.size).toEqual(5);
		map.clear();
		expect(map.size).toEqual(0);
	});

	test('order', () => {
		const map1 = new ObjectMap<string, any>();
		map1.set('a', '1');
		map1.set('b', '2');
		map1.set('c', '3');
		expect([...map1]).toEqual([
			['a', '1'],
			['b', '2'],
			['c', '3'],
		]);

		const map2 = new ObjectMap<string, any>();
		map2.set('a', '1');
		map2.set('c', '3');
		map2.set('b', '2');
		expect([...map2]).toEqual([
			['a', '1'],
			['c', '3'],
			['b', '2'],
		]);
	});

	test('forEach', () => {
		const map = new ObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		const fn = jest.fn();
		map.forEach(fn);
		expect(fn).toHaveBeenCalledTimes(6);
		expect(fn).toHaveBeenNthCalledWith(1, '1', 'a', map);
		expect(fn).toHaveBeenNthCalledWith(2, null, 'b', map);
		expect(fn).toHaveBeenNthCalledWith(3, undefined, 'c', map);
		expect(fn).toHaveBeenNthCalledWith(4, 11, 'd', map);
		expect(fn).toHaveBeenNthCalledWith(5, true, 'e', map);
		expect(fn).toHaveBeenNthCalledWith(6, false, 'f', map);
		const fn2 = jest.fn();
		const thisArg = {};
		map.forEach(fn2, thisArg);
		expect(fn2).toHaveBeenCalledTimes(6);
		expect(fn2).toHaveBeenNthCalledWith(1, '1', 'a', map);
		expect(fn2.mock.contexts[0]).toBe(thisArg);
		expect(fn2).toHaveBeenNthCalledWith(2, null, 'b', map);
		expect(fn2.mock.contexts[1]).toBe(thisArg);
		expect(fn2).toHaveBeenNthCalledWith(3, undefined, 'c', map);
		expect(fn2.mock.contexts[2]).toBe(thisArg);
		expect(fn2).toHaveBeenNthCalledWith(4, 11, 'd', map);
		expect(fn2.mock.contexts[3]).toBe(thisArg);
		expect(fn2).toHaveBeenNthCalledWith(5, true, 'e', map);
		expect(fn2.mock.contexts[4]).toBe(thisArg);
		expect(fn2).toHaveBeenNthCalledWith(6, false, 'f', map);
		expect(fn2.mock.contexts[5]).toBe(thisArg);
	});

	test('entries', () => {
		const map = new ObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect([...map.entries()]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
	});

	test('keys', () => {
		const map = new ObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect([...map.keys()]).toEqual(['a', 'b', 'c', 'd', 'e', 'f']);
	});

	test('values', () => {
		const map = new ObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect([...map.values()]).toEqual(['1', null, undefined, 11, true, false]);
	});
});
//endregion
//region ExtendMap
describe('ExtendMap', () => {
	test('instanceof', () => {
		const map = new ExtendMap();
		expect(map instanceof Map).toEqual(true);
		expect(map instanceof ExtendMap).toEqual(true);
	});

	test('constructor', () => {
		const map1 = new ExtendMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect([...map1]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);

		const map2 = new ExtendMap<string, any>(new Map<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]));
		expect([...map2]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);

		const map3 = new ExtendMap<string, string>();
		expect([...map3]).toEqual([]);
		expect(map3.constructor).toEqual(ExtendMap);
	});

	test('getOrInsert', () => {
		const map = new ExtendMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(map.getOrInsert('a', '10')).toEqual('1');
		expect([...map]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(map.getOrInsert('no', '10')).toEqual('10');
		expect([...map]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
			['no', '10'],
		]);
	});

	test('getOrInsertComputed', () => {
		const map = new ExtendMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(
			map.getOrInsertComputed('a', (key) => `val:${key}`),
		).toEqual('1');
		expect([...map]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(
			map.getOrInsertComputed('no', (key) => `val:${key}`),
		).toEqual('val:no');
		expect([...map]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
			['no', 'val:no'],
		]);
	});

	test('deleteAndReturn', () => {
		const map = new ExtendMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(map.deleteAndReturn('a')).toEqual('1');
		expect(map.deleteAndReturn('b')).toEqual(null);
		expect(map.deleteAndReturn('c')).toEqual(undefined);
		expect([...map]).toEqual([
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(map.deleteAndReturn('no')).toEqual(undefined);
		expect([...map]).toEqual([
			['d', 11],
			['e', true],
			['f', false],
		]);
	});
});
//endregion
//region ExtendObjectMap
describe('ExtendObjectMap', () => {
	test('instanceof', () => {
		const map = new ExtendObjectMap();
		expect(map instanceof Map).toEqual(true);
		expect(map instanceof ObjectMap).toEqual(true);
		expect(map instanceof ExtendObjectMap).toEqual(true);
	});

	test('constructor', () => {
		const map1 = new ExtendObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect([...map1]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);

		const map2 = new ExtendObjectMap<string, any>(new Map<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]));
		expect([...map2]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);

		const map3 = new ExtendObjectMap<string, string>();
		expect([...map3]).toEqual([]);
		expect(map3.constructor).toEqual(ExtendObjectMap);
	});

	test('getOrInsert', () => {
		const map = new ExtendObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(map.getOrInsert('a', '10')).toEqual('1');
		expect([...map]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(map.getOrInsert('no', '10')).toEqual('10');
		expect([...map]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
			['no', '10'],
		]);
	});

	test('getOrInsertComputed', () => {
		const map = new ExtendObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(
			map.getOrInsertComputed('a', (key) => `val:${key}`),
		).toEqual('1');
		expect([...map]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(
			map.getOrInsertComputed('no', (key) => `val:${key}`),
		).toEqual('val:no');
		expect([...map]).toEqual([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
			['no', 'val:no'],
		]);
	});

	test('deleteAndReturn', () => {
		const map = new ExtendObjectMap<string, any>([
			['a', '1'],
			['b', null],
			['c', undefined],
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(map.deleteAndReturn('a')).toEqual('1');
		expect(map.deleteAndReturn('b')).toEqual(null);
		expect(map.deleteAndReturn('c')).toEqual(undefined);
		expect([...map]).toEqual([
			['d', 11],
			['e', true],
			['f', false],
		]);
		expect(map.deleteAndReturn('no')).toEqual(undefined);
		expect([...map]).toEqual([
			['d', 11],
			['e', true],
			['f', false],
		]);
	});
});
//endregion