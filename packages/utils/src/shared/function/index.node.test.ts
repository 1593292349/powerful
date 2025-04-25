import {
	splitString,
} from '@powerful/utils/esm/node';

test('splitString', () => {
	expect(splitString('a.b.c', '.')).toEqual(['a', 'b.c']);
	expect(splitString('a.b.c', '')).toEqual(['a.b.c', '']);
	expect(splitString('abc', '.')).toEqual(['abc', '']);
	expect(splitString('a..b..c', '..')).toEqual(['a', 'b..c']);
});