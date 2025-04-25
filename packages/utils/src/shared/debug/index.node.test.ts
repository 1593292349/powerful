import {
	perfMark,
	perfMarkWrapper,
} from '@powerful/utils/esm/node';

//region 初始化设置
(() => {
	jest.useFakeTimers();
	const logCache = new Map<string, number>();
	const logSpy = jest.spyOn(console, 'log')
		.mockImplementation(() => {});
	const timeSpy = jest.spyOn(console, 'time')
		.mockImplementation((label = 'default') => {
			logCache.set(label, Date.now());
		});
	const timeEndSpy = jest.spyOn(console, 'timeEnd')
		.mockImplementation((label = 'default') => {
			const startTime = logCache.get(label);
			if(typeof startTime === 'number'){
				logCache.delete(label);
				console.log(`${label}: ${Date.now() - startTime}ms`);
			}
		});
	const markCache = new Map<string, number>();
	const rawMark = performance.mark;
	const markSpy = jest.spyOn(performance, 'mark')
		.mockImplementation((markName, markOptions) => {
			markCache.set(markName, Date.now());
			return rawMark.call(performance, markName, markOptions);
		});
	const clearMarksSpy = jest.spyOn(performance, 'clearMarks')
		.mockImplementation((markName) => {
			if(markName){
				markCache.delete(markName);
			}else{
				markCache.clear();
			}
		});
	const rawMeasure = performance.measure;
	const measureSpy = jest.spyOn(performance, 'measure')
		.mockImplementation((measureName, startOrMeasureOptions, endMark) => {
			const startMark = typeof startOrMeasureOptions === 'string'
				? startOrMeasureOptions
				: startOrMeasureOptions?.start;
			const start = typeof startMark === 'string'
				&& markCache.get(startMark);
			const end = typeof endMark === 'string'
				&& markCache.get(endMark);
			if(
				typeof start === 'number'
				&& typeof end === 'number'
			){
				console.log(`${measureName}: ${end - start}ms`);
			}
			return rawMeasure.call(performance, measureName, startOrMeasureOptions, endMark);
		});
	const clearMeasuresSpy = jest.spyOn(performance, 'clearMeasures');

	beforeEach(() => {
		logSpy.mockClear();
		timeSpy.mockClear();
		timeEndSpy.mockClear();
		markSpy.mockClear();
		clearMarksSpy.mockClear();
		measureSpy.mockClear();
		clearMeasuresSpy.mockClear();
	});

	afterAll(() => {
		jest.useRealTimers();
		logSpy.mockRestore();
		timeSpy.mockRestore();
		timeEndSpy.mockRestore();
		markSpy.mockRestore();
		clearMarksSpy.mockRestore();
		measureSpy.mockRestore();
		clearMeasuresSpy.mockRestore();
	});
})();
//endregion

//region expectPerformance
function expectPerformance(name:string, duration:number, index = 1){
	const mark = expect.stringContaining(name);
	expect(performance.mark).toHaveBeenCalledTimes(2 * index);
	expect(performance.mark).toHaveBeenNthCalledWith(2 * index - 1, mark);
	expect(performance.mark).toHaveBeenNthCalledWith(2 * index, mark);
	expect(performance.measure).toHaveBeenCalledTimes(index);
	expect(performance.measure).toHaveBeenNthCalledWith(index, name, mark, mark);
	expect(performance.clearMarks).toHaveBeenCalledTimes(2 * index);
	expect(performance.clearMarks).toHaveBeenNthCalledWith(2 * index - 1, mark);
	expect(performance.clearMarks).toHaveBeenNthCalledWith(2 * index, mark);
	expect(performance.clearMeasures).toHaveBeenCalledTimes(index);
	expect(performance.clearMeasures).toHaveBeenNthCalledWith(index, name);
	expect(console.log).toHaveBeenLastCalledWith(`${name}: ${duration}ms`);
}
//endregion
//region perfMark
describe('perfMark', () => {
	const param = [
		1,
		'param',
		true,
	];
	const result = '123';
	const duration = 1000;

	test('performance/name', async () => {
		const name = 'performance/name';
		const fn = jest.fn();
		fn.mockReturnValue(new Promise((resolve) => {
			setTimeout(resolve, duration, result);
		}));
		const perfMarkResult = perfMark('performance', name, fn, ...param);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(...param);
		jest.runAllTimers();
		await expect(perfMarkResult).resolves.toEqual(result);
		expectPerformance(name, duration);
	});

	test('performance/getter', async () => {
		const getter = jest.fn(() => {
			return 'performance/getter';
		});
		const fn = jest.fn();
		fn.mockReturnValue(new Promise((resolve) => {
			setTimeout(resolve, duration, result);
		}));
		const perfMarkResult = perfMark('performance', getter, fn, ...param);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(...param);
		expect(getter).toHaveBeenCalledTimes(1);
		jest.runAllTimers();
		await expect(perfMarkResult).resolves.toEqual(result);
		expectPerformance(getter.mock.results[0].value, duration);
	});

	test('console/name', async () => {
		const name = 'console/name';
		const fn = jest.fn();
		fn.mockReturnValue(new Promise((resolve) => {
			setTimeout(resolve, duration, result);
		}));
		const perfMarkResult = perfMark('console', name, fn, ...param);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(...param);
		jest.runAllTimers();
		await expect(perfMarkResult).resolves.toEqual(result);
		expect(console.log).toHaveBeenCalledWith(`${name}: ${duration}ms`);
	});

	test('console/getter', async () => {
		const getter = jest.fn(() => {
			return 'console/getter';
		});
		const fn = jest.fn();
		fn.mockReturnValue(new Promise((resolve) => {
			setTimeout(resolve, duration, result);
		}));
		const perfMarkResult = perfMark('console', getter, fn, ...param);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(...param);
		expect(getter).toHaveBeenCalledTimes(1);
		jest.runAllTimers();
		await expect(perfMarkResult).resolves.toEqual(result);
		expect(console.log).toHaveBeenCalledWith(`${getter.mock.results[0].value}: ${duration}ms`);
	});

	test('callback', async () => {
		const callback = jest.fn();
		const fn = jest.fn();
		fn.mockReturnValue(new Promise((resolve) => {
			setTimeout(resolve, duration, result);
		}));
		const perfMarkResult = perfMark('callback', callback, fn, ...param);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(...param);
		expect(callback).toHaveBeenCalledTimes(0);
		jest.runAllTimers();
		await expect(perfMarkResult).resolves.toEqual(result);
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(duration);
	});
});
//endregion
//region perfMarkWrapper
describe('perfMarkWrapper', () => {
	//region loopCall
	async function loopCall(
		{
			fn,
			run,
			after,
		}:{
			fn:ReturnType<typeof jest.fn>;
			run:(param:any, index:number) => any;
			after:(duration:number, index:number) => void;
		},
	){
		for(let i = 0; i < 3; ++i){
			const param = [
				i,
				'param',
				true,
			];
			const result = `123${i}`;
			const duration = 100 * i;
			fn.mockReturnValue(new Promise((resolve) => {
				setTimeout(resolve, duration, result);
			}));
			expect(fn).toHaveBeenCalledTimes(i);
			const perfMarkResult = run(param, i);
			expect(fn).toHaveBeenCalledTimes(i + 1);
			expect(fn).toHaveBeenLastCalledWith(...param);
			jest.runAllTimers();
			await expect(perfMarkResult).resolves.toEqual(result);
			after(duration, i);
		}
	}
	//endregion
	test('performance/name', async () => {
		const name = 'performance/name';
		const fn = jest.fn();
		const wrapper = perfMarkWrapper('performance', name, fn);
		await loopCall({
			fn,
			run(param){
				return wrapper(...param);
			},
			after(duration, index){
				expectPerformance(name, duration, index + 1);
			},
		});
	});

	test('performance/getter', async () => {
		let index = 0;
		const getter = jest.fn(() => {
			return `performance/getter${index++}`;
		});
		const fn = jest.fn();
		const wrapper = perfMarkWrapper('performance', getter, fn);
		await loopCall({
			fn,
			run(param, index){
				expect(getter).toHaveBeenCalledTimes(index);
				const result = wrapper(...param);
				expect(getter).toHaveBeenCalledTimes(index + 1);
				return result;
			},
			after(duration, index){
				expectPerformance(getter.mock.results[index].value, duration, index + 1);
			},
		});
	});

	test('console/name', async () => {
		const name = 'console/name';
		const fn = jest.fn();
		const wrapper = perfMarkWrapper('console', name, fn);
		await loopCall({
			fn,
			run(param){
				return wrapper(...param);
			},
			after(duration){
				expect(console.log).toHaveBeenLastCalledWith(`${name}: ${duration}ms`);
			},
		});
	});

	test('console/getter', async () => {
		let index = 0;
		const getter = jest.fn(() => {
			return `console/getter${index++}`;
		});
		const fn = jest.fn();
		const wrapper = perfMarkWrapper('console', getter, fn);
		await loopCall({
			fn,
			run(param, index){
				expect(getter).toHaveBeenCalledTimes(index);
				const result = wrapper(...param);
				expect(getter).toHaveBeenCalledTimes(index + 1);
				return result;
			},
			after(duration, index){
				expect(console.log).toHaveBeenCalledWith(`${getter.mock.results[index].value}: ${duration}ms`);
			},
		});
	});

	test('callback', async () => {
		const callback = jest.fn();
		const fn = jest.fn();
		const wrapper = perfMarkWrapper('callback', callback, fn);
		await loopCall({
			fn,
			run(param, index){
				const result = wrapper(...param);
				expect(callback).toHaveBeenCalledTimes(index);
				return result;
			},
			after(duration, index){
				expect(callback).toHaveBeenCalledTimes(index + 1);
				expect(callback).toHaveBeenCalledWith(duration);
			},
		});
	});
});
//endregion