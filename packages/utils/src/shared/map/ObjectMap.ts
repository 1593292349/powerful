/**
 * 针对 IE 的优化
 * todo 缓存 Object.keys 执行结果, 优化性能
 */
export default class ObjectMap<K extends string, V> implements Map<K, V>{
	private _cache:Record<K, V> = Object.create(null);

	//region constructor
	constructor(iterable?:Iterable<readonly [K, V]> | null){
		if(iterable){
			const {
				_cache,
			} = this;
			if(Array.isArray(iterable)){
				for(let i = 0; i < iterable.length; ++i){
					const [k, v] = iterable[i];
					_cache[k as K] = v;
				}
			}else{
				for(const [k, v] of iterable){
					_cache[k] = v;
				}
			}
		}
	}
	//endregion

	//region has
	has(key:K):boolean{
		return key in this._cache;
	}
	//endregion

	//region get
	get(key:K):V | undefined{
		return this._cache[key];
	}
	//endregion

	//region set
	set(key:K, value:V):this{
		this._cache[key] = value;
		return this;
	}
	//endregion

	//region delete
	delete(key:K):boolean{
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
	forEach(callbackfn:(value:V, key:K, map:Map<K, V>) => void, thisArg?:any){
		for(const [key, value] of this.entries()){
			callbackfn.call(thisArg, value, key, this);
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
		return 'ObjectMap';
	}
	//endregion

	//region Symbol.iterator
	[Symbol.iterator]():ReturnType<Map<K, V>['entries']>{
		return this.entries();
	}
	//endregion

	//region entries
	* entries():ReturnType<Map<K, V>['entries']>{
		const {
			_cache,
		} = this;
		const keys = Object.keys(_cache);
		for(let i = 0; i < keys.length; ++i){
			const key = keys[i] as K;
			yield [key, _cache[key]];
		}
	}
	//endregion

	//region keys
	* keys():ReturnType<Map<K, V>['keys']>{
		const keys = Object.keys(this._cache);
		for(let i = 0; i < keys.length; ++i){
			yield keys[i] as K;
		}
	}
	//endregion

	//region values
	* values():ReturnType<Map<K, V>['values']>{
		const {
			_cache,
		} = this;
		const keys = Object.keys(_cache);
		for(let i = 0; i < keys.length; ++i){
			yield _cache[keys[i] as K];
		}
	}
	//endregion
}