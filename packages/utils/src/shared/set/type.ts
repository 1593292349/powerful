interface ExtendSet<T> extends Set<T>{
	test():void;
}
interface ExtendSetConstructor<E>{
	new<T extends E>(iterable?:Iterable<T> | null):ExtendSet<T>;
	readonly prototype:ExtendSet<E>;
}

export type {
	ExtendSet,
	ExtendSetConstructor,
};