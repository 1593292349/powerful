import type Color from './Color';

type RGB<T = number | string> = {
	r:T;
	g:T;
	b:T;
	a?:T;
};
type HSV<T = number | string> = {
	h:T;
	s:T;
	v:T;
	a?:T;
};
type HSL<T = number | string> = {
	h:T;
	s:T;
	l:T;
	a?:T;
};
type HWB<T = number | string> = {
	h:T;
	w:T;
	b:T;
	a?:T;
};
type ColorValue = number | string | RGB | HSV | HSL | HWB | Color;
type EventMapper = Record<string, (...param:any) => any>;
type EventBusProcessor<M extends EventMapper, R>
	= <K extends (keyof M) & string>(
		listeners:Set<(...param:any) => any>,
		type:K,
		param:Parameters<M[K]>,
	) => R;

export {
	RGB,
	HSV,
	HSL,
	HWB,
	ColorValue,
	EventMapper,
	EventBusProcessor,
};