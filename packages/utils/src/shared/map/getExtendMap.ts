import type {
	ExtendMapConstructor,
} from './type';

export default function<E>(Super:{
	new<K extends E, V>(iterable?:Iterable<readonly [K, V]> | null):Map<K, V>;
	readonly prototype:Map<E, any>;
}):ExtendMapConstructor<E>{
	return (class ExtendMap<K extends E, V> extends Super<K, V>{
		getOrInsert(key:K, defaultValue:V):V{
			if(this.has(key)){
				return this.get(key)!;
			}
			this.set(key, defaultValue);
			return defaultValue;
		}

		getOrInsertComputed<K1 extends K>(key:K1, callback:(key:K1) => V):V{
			if(this.has(key)){
				return this.get(key)!;
			}
			const defaultValue = callback(key);
			this.set(key, defaultValue);
			return defaultValue;
		}

		deleteAndReturn(key:K):V | undefined{
			const value = this.get(key);
			this.delete(key);
			return value;
		}
	});
}