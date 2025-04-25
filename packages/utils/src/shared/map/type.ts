interface ExtendMap<K, V> extends Map<K, V>{
	getOrInsert(key:K, defaultValue:V):V;
	getOrInsertComputed<K1 extends K>(key:K1, callback:(key:K1) => V):V;
	deleteAndReturn(key:K):V | undefined;
}
interface ExtendMapConstructor<E>{
	new<K extends E, V>(iterable?:Iterable<readonly [K, V]> | null):ExtendMap<K, V>;
	readonly prototype:ExtendMap<E, any>;
}

export type {
	ExtendMap,
	ExtendMapConstructor,
};