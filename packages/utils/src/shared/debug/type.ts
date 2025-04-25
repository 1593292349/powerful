type PerfMarkType = 'performance' | 'console' | 'callback';
//out类型接收回调方法参数, 其他类型接收字符串参数
type Measure<T extends PerfMarkType>
	= T extends 'callback'
		? (callback:(duration:number) => void) => MeasureStop
		: (nameOrGetter:string | (() => string)) => MeasureStop;
type MeasureStop = () => void;
type MeasureMapper = {
	[key in PerfMarkType]:Measure<key>;
};
export type {
	PerfMarkType,
	Measure,
	MeasureStop,
	MeasureMapper,
};