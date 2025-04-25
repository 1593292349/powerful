import type {
	PerfMarkType,
	MeasureMapper,
	Measure,
} from './type';

//region 测量方式
const measure:MeasureMapper = {
	performance(nameOrGetter){
		const name
			= typeof nameOrGetter === 'string'
				? nameOrGetter
				: nameOrGetter();
		const start = `${name}::start`;
		performance.mark(start);
		return function(){
			const end = `${name}::end`;
			performance.mark(end);
			performance.measure(name, start, end);
			performance.clearMarks(start);
			performance.clearMarks(end);
			performance.clearMeasures(name);
		};
	},
	console(nameOrGetter){
		const name
			= typeof nameOrGetter === 'string'
				? nameOrGetter
				: nameOrGetter();
		console.time(name);
		return function(){
			console.timeEnd(name);
		};
	},
	callback(callback){
		const startTime = Date.now();
		return function(){
			callback(Date.now() - startTime);
		};
	},
};
//endregion
//region perfMark
function perfMark<T extends PerfMarkType, P extends any[], R>(
	type:T,
	param:Parameters<Measure<T>>[0],
	func:(...args:P) => R,
	...args:P
):R{
	const stop = measure[type](param as any);
	const result = func(...args);
	if(result instanceof Promise){
		result.finally(stop);
	}else{
		stop();
	}
	return result;
}
//endregion
//region perfMarkWrapper
function perfMarkWrapper<T extends PerfMarkType, P extends any[], R>(
	type:T,
	param:Parameters<Measure<T>>[0],
	func:(...args:P) => R,
):(...args:P) => R{
	return perfMark.bind<null, [T, Parameters<Measure<T>>[0], (...args:P) => R], P, R>(null, type, param, func);
}
//endregion

export {
	perfMark,
	perfMarkWrapper,
};