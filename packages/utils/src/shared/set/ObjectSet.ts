/**
 * 针对 IE 的优化
 * todo 缓存 Object.keys 执行结果, 优化性能
 */
export default class ObjectSet<T extends string> implements Set<T>{
	private _cache:Record<T, null> = Object.create(null);

	//region constructor
	constructor(iterable?:Iterable<T> | null){
		if(iterable){
			const {
				_cache,
			} = this;
			if(Array.isArray(iterable)){
				for(let i = 0; i < iterable.length; ++i){
					_cache[iterable[i] as T] = null;
				}
			}else{
				for(const k of iterable){
					_cache[k] = null;
				}
			}
		}
	}
	//endregion

	//region has
	has(key:T):boolean{
		return key in this._cache;
	}
	//endregion

	//region add
	add(key:T):this{
		this._cache[key] = null;
		return this;
	}
	//endregion

	//region delete
	delete(key:T):boolean{
		if(this.has(key)){
			return delete this._cache[key];
		}
		return false;
	}
	//endregion

	//region clear
	clear():void{
		this._cache = Object.create(null);
	}
	//endregion

	//region forEach
	forEach(callbackfn:(value:T, value2:T, set:Set<T>) => void, thisArg?:any):void{
		//这里追求性能, 冗余代码
		const keys = Object.keys(this._cache);
		for(let i = 0; i < keys.length; ++i){
			const key = keys[i] as T;
			callbackfn.call(thisArg, key, key, this);
		}
	}
	//endregion

	//region size
	get size():number{
		return Object.keys(this._cache).length;
	}
	//endregion

	//region Symbol.toStringTag
	get [Symbol.toStringTag](){
		return 'ObjectSet';
	}
	//endregion

	//region Symbol.iterator
	[Symbol.iterator]():SetIterator<T>{
		return this.values();
	}
	//endregion

	//region entries
	* entries():SetIterator<[T, T]>{
		const keys = Object.keys(this._cache);
		for(let i = 0; i < keys.length; ++i){
			const key = keys[i] as T;
			yield [key, key];
		}
	}
	//endregion

	//region keys
	keys():SetIterator<T>{
		return this.values();
	}
	//endregion

	//region values
	* values():SetIterator<T>{
		const keys = Object.keys(this._cache);
		for(let i = 0; i < keys.length; ++i){
			yield keys[i] as T;
		}
	}
	//endregion

	//region intersection
	intersection<U>(other:ReadonlySetLike<U>):Set<T & U>{
		const result = new ObjectSet<T & U>();
		if(this.size <= other.size){
			//这里追求性能, 冗余代码
			const keys = Object.keys(this._cache);
			for(let i = 0; i < keys.length; ++i){
				const key = keys[i];
				if(other.has(key as any)){
					result.add(key as any);
				}
			}
		}else{
			if(other instanceof ObjectSet){
				//这里追求性能, 冗余代码
				const keys = Object.keys(other._cache);
				for(let i = 0; i < keys.length; ++i){
					const key = keys[i];
					if(this.has(key as any)){
						result.add(key as any);
					}
				}
			}else{
				const iterator = other.keys();
				let temp = iterator.next();
				while(!temp.done){
					const key = temp.value;
					if(this.has(key as any)){
						result.add(key as any);
					}
					temp = iterator.next();
				}
			}
		}
		return result;
	}
	//endregion

	//region union
	union<U>(other:ReadonlySetLike<U>):Set<T | U>{
		const result = new Set<T | U>(this);
		if(other instanceof ObjectSet){
			//这里追求性能, 冗余代码
			const keys = Object.keys(other._cache);
			for(let i = 0; i < keys.length; ++i){
				result.add(keys[i] as T);
			}
		}else{
			const iterator = other.keys();
			let temp = iterator.next();
			while(!temp.done){
				result.add(temp.value);
				temp = iterator.next();
			}
		}
		return result;
	}
	//endregion

	//region difference
	difference<U>(other:ReadonlySetLike<U>):Set<T>{
		const result = new ObjectSet<T>();
		//这里追求性能, 冗余代码
		const keys = Object.keys(this._cache);
		for(let i = 0; i < keys.length; ++i){
			const key = keys[i] as T;
			if(!other.has(key as any)){
				result.add(key);
			}
		}
		return result;
	}
	//endregion

	//region symmetricDifference
	symmetricDifference<U>(other:ReadonlySetLike<U>):Set<T | U>{
		const result = new Set<T | U>(this);
		if(other instanceof ObjectSet){
			//这里追求性能, 冗余代码
			const keys = Object.keys(other._cache);
			for(let i = 0; i < keys.length; ++i){
				const key = keys[i] as T;
				result.delete(key) || result.add(key);
			}
		}else{
			const iterator = other.keys();
			let temp = iterator.next();
			while(!temp.done){
				const key = temp.value;
				result.delete(key) || result.add(key);
				temp = iterator.next();
			}
		}
		return result;
	}
	//endregion

	//region isSubsetOf
	isSubsetOf(other:ReadonlySetLike<unknown>):boolean{
		if(this.size > other.size){
			return false;
		}else{
			//这里追求性能, 冗余代码
			const keys = Object.keys(this._cache);
			for(let i = 0; i < keys.length; ++i){
				const key = keys[i];
				if(!other.has(key)){
					return false;
				}
			}
			return true;
		}
	}
	//endregion

	//region isSupersetOf
	isSupersetOf(other:ReadonlySetLike<unknown>):boolean{
		if(this.size < other.size){
			return false;
		}else{
			if(other instanceof ObjectSet){
				//这里追求性能, 冗余代码
				const keys = Object.keys(other._cache);
				for(let i = 0; i < keys.length; ++i){
					const key = keys[i];
					if(!this.has(key as any)){
						return false;
					}
				}
			}else{
				const iterator = other.keys();
				let result = iterator.next();
				while(!result.done){
					if(!this.has(result.value as any)){
						return false;
					}
					result = iterator.next();
				}
			}
			return true;
		}
	}
	//endregion

	//region isDisjointFrom
	isDisjointFrom(other:ReadonlySetLike<unknown>):boolean{
		if(this.size <= other.size){
			//这里追求性能, 冗余代码
			const keys = Object.keys(this._cache);
			for(let i = 0; i < keys.length; ++i){
				const key = keys[i];
				if(other.has(key)){
					return false;
				}
			}
		}else{
			if(other instanceof ObjectSet){
				//这里追求性能, 冗余代码
				const keys = Object.keys(other._cache);
				for(let i = 0; i < keys.length; ++i){
					const key = keys[i] as T;
					if(this.has(key)){
						return false;
					}
				}
			}else{
				const iterator = other.keys();
				let result = iterator.next();
				while(!result.done){
					if(this.has(result.value as any)){
						return false;
					}
					result = iterator.next();
				}
			}
		}
		return true;
	}
	//endregion
}