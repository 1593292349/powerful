import {
	Color,
} from '@powerful/utils/esm/node';

//region Color
describe('Color', () => {
	test('constructor/Color', () => {
		const a = new Color('#25cf6b');
		const b = new Color(a);
		expect(b.toHexString()).toEqual(a.toHexString());
		expect(b).not.toBe(a);
	});

	test('constructor/number', () => {
		expect(new Color(0x25cf6b).toHexString()).toEqual('#25cf6b');
	});

	test('constructor/HexString', () => {
		expect(new Color('#25cf6b').toHexString()).toEqual('#25cf6b');
		expect(new Color('#25cf6bff').toHexString()).toEqual('#25cf6b');
		expect(new Color('#25cf6b45').toHexString()).toEqual('#25cf6b45');
		expect(new Color('#123').toHexString()).toEqual('#112233');
		expect(new Color('#123f').toHexString()).toEqual('#112233');
		expect(new Color('#1234').toHexString()).toEqual('#11223344');
		expect(new Color('25cf6b').toHexString()).toEqual('#25cf6b');
		expect(new Color('25cf6bff').toHexString()).toEqual('#25cf6b');
		expect(new Color('25cf6b45').toHexString()).toEqual('#25cf6b45');
		expect(new Color('123').toHexString()).toEqual('#112233');
		expect(new Color('123f').toHexString()).toEqual('#112233');
		expect(new Color('1234').toHexString()).toEqual('#11223344');
	});

	test('constructor/rgb', () => {
		expect(new Color('rgb(37,207,107)').toRgbString()).toEqual('rgb(37,207,107)');
		expect(new Color('rgb(37,207,107,1)').toRgbString()).toEqual('rgb(37,207,107)');
		expect(new Color('rgb(37,207,107,100%)').toRgbString()).toEqual('rgb(37,207,107)');
		expect(new Color('rgb(20%,40%,60%)').toRgbString()).toEqual('rgb(51,102,153)');
		expect(new Color('rgb(20%,40%,60%,1)').toRgbString()).toEqual('rgb(51,102,153)');
		expect(new Color('rgb(20%,40%,60%,100%)').toRgbString()).toEqual('rgb(51,102,153)');
		expect(new Color('rgb(20.1%,40.1%,60.1%)').toRgbString()).toEqual('rgb(51,102,153)');
		expect(new Color('rgb(37,207,107,0.11)').toRgbString()).toEqual('rgba(37,207,107,0.11)');
		expect(new Color('rgba(37,207,107,0.11)').toRgbString()).toEqual('rgba(37,207,107,0.11)');
		expect(new Color('rgb(37,207,107,11%)').toRgbString()).toEqual('rgba(37,207,107,0.11)');
		expect(new Color('rgba(37,207,107,11%)').toRgbString()).toEqual('rgba(37,207,107,0.11)');
		expect(new Color('rgb(20%,40%,60%,0.11)').toRgbString()).toEqual('rgba(51,102,153,0.11)');
		expect(new Color('rgba(20%,40%,60%,0.11)').toRgbString()).toEqual('rgba(51,102,153,0.11)');
		expect(new Color('rgb(20%,40%,60%,11%)').toRgbString()).toEqual('rgba(51,102,153,0.11)');
		expect(new Color('rgba(20%,40%,60%,11%)').toRgbString()).toEqual('rgba(51,102,153,0.11)');
		expect(new Color({r:37, g:207, b:107}).toRgbString()).toEqual('rgb(37,207,107)');
		expect(new Color({r:37, g:207, b:107, a:0.11}).toRgbString()).toEqual('rgba(37,207,107,0.11)');
		expect(new Color({r:37, g:207, b:107, a:'11%'}).toRgbString()).toEqual('rgba(37,207,107,0.11)');
		expect(new Color({r:'20%', g:'40%', b:'60%'}).toRgbString()).toEqual('rgb(51,102,153)');
		expect(new Color({r:'20%', g:'40%', b:'60%', a:0.11}).toRgbString()).toEqual('rgba(51,102,153,0.11)');
		expect(new Color({r:'20%', g:'40%', b:'60%', a:'11%'}).toRgbString()).toEqual('rgba(51,102,153,0.11)');
	});
});
//endregion

test('Color', () => {
	expect(new Color('#25cf6b').toRgbString()).toStrictEqual('rgb(37,207,107)');
	expect(new Color('#00cf6b').toRgbString()).toStrictEqual('rgb(0,207,107)');
	expect(new Color('#25006b').toRgbString()).toStrictEqual('rgb(37,0,107)');
	expect(new Color('#25cf00').toRgbString()).toStrictEqual('rgb(37,207,0)');
	expect(new Color('#ffcf6b').toRgbString()).toStrictEqual('rgb(255,207,107)');
	expect(new Color('#25ff6b').toRgbString()).toStrictEqual('rgb(37,255,107)');
	expect(new Color('#25cfff').toRgbString()).toStrictEqual('rgb(37,207,255)');

	expect(new Color('#25cf6bc2').toRgbString()).toStrictEqual('rgba(37,207,107,0.76)');
	expect(new Color('#00cf6bc2').toRgbString()).toStrictEqual('rgba(0,207,107,0.76)');
	expect(new Color('#25006bc2').toRgbString()).toStrictEqual('rgba(37,0,107,0.76)');
	expect(new Color('#25cf00c2').toRgbString()).toStrictEqual('rgba(37,207,0,0.76)');
	expect(new Color('#25cf6b00').toRgbString()).toStrictEqual('rgba(37,207,107,0)');
	expect(new Color('#ffcf6bc2').toRgbString()).toStrictEqual('rgba(255,207,107,0.76)');
	expect(new Color('#25ff6bc2').toRgbString()).toStrictEqual('rgba(37,255,107,0.76)');
	expect(new Color('#25cfffc2').toRgbString()).toStrictEqual('rgba(37,207,255,0.76)');
	expect(new Color('#25cf6bff').toRgbString()).toStrictEqual('rgb(37,207,107)');

	expect(new Color('25cf6b').toHexString()).toStrictEqual('#25cf6b');
	expect(new Color('25cf6bc2').toHexString()).toStrictEqual('#25cf6bc2');
	expect(new Color('25c').toHexString()).toStrictEqual('#2255cc');
	expect(new Color('25cd').toHexString()).toStrictEqual('#2255ccdd');

	expect(new Color('#2b7012').toHslString()).toStrictEqual('hsl(104,72%,25%)');
	expect(new Color('#2b7012').toHslString(2)).toStrictEqual('hsl(104.04,72.31%,25.49%)');
	expect(new Color('#2b7012').toHsvString()).toStrictEqual('hsv(104,84%,44%)');
	expect(new Color('#2b7012').toHsvString(2)).toStrictEqual('hsv(104.04,83.93%,43.92%)');
	expect(new Color('#2b7012').toHwbString()).toStrictEqual('hwb(104 7% 56%)');
	expect(new Color('#2b7012').toHwbString(2)).toStrictEqual('hwb(104.04 7.06% 56.08%)');
	expect(new Color('#d82d2d').toHslString()).toStrictEqual('hsl(0,69%,51%)');
	expect(new Color('#d82d2d').toHslString(2)).toStrictEqual('hsl(0,68.67%,51.18%)');
	expect(new Color('#d82d2d').toHsvString()).toStrictEqual('hsv(0,79%,85%)');
	expect(new Color('#d82d2d').toHsvString(2)).toStrictEqual('hsv(0,79.17%,84.71%)');
	expect(new Color('#d82d2d').toHwbString()).toStrictEqual('hwb(0 18% 15%)');
	expect(new Color('#d82d2d').toHwbString(2)).toStrictEqual('hwb(0 17.65% 15.29%)');
	expect(new Color('#a930c0').toHslString()).toStrictEqual('hsl(290,60%,47%)');
	expect(new Color('#a930c0').toHslString(2)).toStrictEqual('hsl(290.42,60%,47.06%)');
	expect(new Color('#a930c0').toHsvString()).toStrictEqual('hsv(290,75%,75%)');
	expect(new Color('#a930c0').toHsvString(2)).toStrictEqual('hsv(290.42,75%,75.29%)');
	expect(new Color('#a930c0').toHwbString()).toStrictEqual('hwb(290 19% 25%)');
	expect(new Color('#a930c0').toHwbString(2)).toStrictEqual('hwb(290.42 18.82% 24.71%)');
	expect(new Color('#12419b').toHslString()).toStrictEqual('hsl(219,79%,34%)');
	expect(new Color('#12419b').toHslString(2)).toStrictEqual('hsl(219.42,79.19%,33.92%)');
	expect(new Color('#12419b').toHsvString()).toStrictEqual('hsv(219,88%,61%)');
	expect(new Color('#12419b').toHsvString(2)).toStrictEqual('hsv(219.42,88.39%,60.78%)');
	expect(new Color('#12419b').toHwbString()).toStrictEqual('hwb(219 7% 39%)');
	expect(new Color('#12419b').toHwbString(2)).toStrictEqual('hwb(219.42 7.06% 39.22%)');
	expect(new Color('#3acb5f').toHslString()).toStrictEqual('hsl(135,58%,51%)');
	expect(new Color('#3acb5f').toHslString(2)).toStrictEqual('hsl(135.31,58.23%,51.18%)');
	expect(new Color('#3acb5f').toHsvString()).toStrictEqual('hsv(135,71%,80%)');
	expect(new Color('#3acb5f').toHsvString(2)).toStrictEqual('hsv(135.31,71.43%,79.61%)');
	expect(new Color('#3acb5f').toHwbString()).toStrictEqual('hwb(135 23% 20%)');
	expect(new Color('#3acb5f').toHwbString(2)).toStrictEqual('hwb(135.31 22.75% 20.39%)');
	expect(new Color('#bbc020').toHslString()).toStrictEqual('hsl(62,71%,44%)');
	expect(new Color('#bbc020').toHslString(2)).toStrictEqual('hsl(61.88,71.43%,43.92%)');
	expect(new Color('#bbc020').toHsvString()).toStrictEqual('hsv(62,83%,75%)');
	expect(new Color('#bbc020').toHsvString(2)).toStrictEqual('hsv(61.88,83.33%,75.29%)');
	expect(new Color('#bbc020').toHwbString()).toStrictEqual('hwb(62 13% 25%)');
	expect(new Color('#bbc020').toHwbString(2)).toStrictEqual('hwb(61.88 12.55% 24.71%)');

	expect(new Color('hsl(188,76%,60%,0.5)').toHexString()).toStrictEqual('#4bd2e780');
	expect(new Color('hsl(188,76%,60%,50%)').toHexString()).toStrictEqual('#4bd2e780');
	expect(new Color('hsl(188,76%,60%)').toHexString()).toStrictEqual('#4bd2e7');
	expect(new Color('hsl(188,76%,60)').toHexString()).toStrictEqual('#4bd2e7');
	expect(new Color('hsl(188,76,60%)').toHexString()).toStrictEqual('#4bd2e7');
	expect(new Color('hsl(188,76,60)').toHexString()).toStrictEqual('#4bd2e7');
	expect(new Color('hsl(-188,76%,60%)').toHexString()).toStrictEqual('#4be7d2');
	expect(new Color('hsl(188deg,76,60)').toHexString()).toStrictEqual('#4bd2e7');
	expect(new Color('hsl(188grad,76%,60%)').toHexString()).toStrictEqual('#4be7cb');
	expect(new Color('hsl(188rad,76%,60%)').toHexString()).toStrictEqual('#e74b95');
	expect(new Color('hsl(1.2turn,76%,60%)').toHexString()).toStrictEqual('#c8e74b');
	expect(new Color('hsl(44,76,60)').toHexString()).toStrictEqual('#e7bd4b');
	expect(new Color('hsl(92,76,60)').toHexString()).toStrictEqual('#94e74b');
	expect(new Color('hsl(155,76,60)').toHexString()).toStrictEqual('#4be7a6');
	expect(new Color('hsl(222,76,60)').toHexString()).toStrictEqual('#4b7ae7');
	expect(new Color('hsl(277,76,60)').toHexString()).toStrictEqual('#ab4be7');
	expect(new Color('hsl(333,76,60)').toHexString()).toStrictEqual('#e74b91');
	expect(new Color('hsl(333,0,60)').toHexString()).toStrictEqual('#999999');
	expect(new Color('hsl(333,76,0)').toHexString()).toStrictEqual('#000000');

	expect(new Color('hsv(188,76%,60%,0.5)').toHexString()).toStrictEqual('#25899980');
	expect(new Color('hsv(188,76%,60%,50%)').toHexString()).toStrictEqual('#25899980');
	expect(new Color('hsv(188,76%,60%)').toHexString()).toStrictEqual('#258999');
	expect(new Color('hsv(188,76%,60)').toHexString()).toStrictEqual('#258999');
	expect(new Color('hsv(188,76,60%)').toHexString()).toStrictEqual('#258999');
	expect(new Color('hsv(188,76,60)').toHexString()).toStrictEqual('#258999');
	expect(new Color('hsv(-188,76%,60%)').toHexString()).toStrictEqual('#259989');
	expect(new Color('hsv(44,76,60)').toHexString()).toStrictEqual('#997a25');
	expect(new Color('hsv(92,76,60)').toHexString()).toStrictEqual('#5b9925');
	expect(new Color('hsv(155,76,60)').toHexString()).toStrictEqual('#259969');
	expect(new Color('hsv(222,76,60)').toHexString()).toStrictEqual('#254899');
	expect(new Color('hsv(277,76,60)').toHexString()).toStrictEqual('#6c2599');
	expect(new Color('hsv(333,76,60)').toHexString()).toStrictEqual('#992559');
	expect(new Color('hsv(333,0,60)').toHexString()).toStrictEqual('#999999');
	expect(new Color('hsv(333,76,0)').toHexString()).toStrictEqual('#000000');

	expect(new Color('hwb(188 32% 44% / 0.5)').toHexString()).toStrictEqual('#52878f80');
	expect(new Color('hwb(188 32% 44% / 50%)').toHexString()).toStrictEqual('#52878f80');
	expect(new Color('hwb(188 32% 44%)').toHexString()).toStrictEqual('#52878f');
	expect(new Color('hwb(188 32% 44)').toHexString()).toStrictEqual('#52878f');
	expect(new Color('hwb(188 32 44%)').toHexString()).toStrictEqual('#52878f');
	expect(new Color('hwb(188 32 44)').toHexString()).toStrictEqual('#52878f');
	expect(new Color('hwb(-188 32 44)').toHexString()).toStrictEqual('#528f87');
	expect(new Color('hwb(44 32% 44%)').toHexString()).toStrictEqual('#8f7e52');
	expect(new Color('hwb(92 32% 44%)').toHexString()).toStrictEqual('#6e8f52');
	expect(new Color('hwb(155 32% 44%)').toHexString()).toStrictEqual('#528f75');
	expect(new Color('hwb(222 32% 44%)').toHexString()).toStrictEqual('#52648f');
	expect(new Color('hwb(277 32% 44%)').toHexString()).toStrictEqual('#77528f');
	expect(new Color('hwb(333 32% 44%)').toHexString()).toStrictEqual('#8f526d');
	expect(new Color('hwb(333 66% 44%)').toHexString()).toStrictEqual('#999999');

	expect(new Color('#50d3e788').toRgbString()).toStrictEqual('rgba(80,211,231,0.53)');
	expect(new Color('#50d3e788').toHslString()).toStrictEqual('hsla(188,76%,61%,0.53)');
	expect(new Color('#50d3e788').toHsvString()).toStrictEqual('hsva(188,65%,91%,0.53)');
	expect(new Color('#50d3e788').toHwbString()).toStrictEqual('hwb(188 31% 9% / 0.53)');

	expect(new Color('#FF0000').lighten(0.1).toHexString()).toStrictEqual('#ff1a1a');
	expect(new Color('#FF0000').lighten(-0.1).toHexString()).toStrictEqual('#e60000');
});