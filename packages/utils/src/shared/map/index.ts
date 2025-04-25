import ObjectMap from './ObjectMap';
import getExtendMap from './getExtendMap';

//region 让 ObjectMap 实例, 支持 instanceof Map
const rawHasInstance = Map[Symbol.hasInstance];
Object.defineProperty(Map, Symbol.hasInstance, {
	value:function(instance:any){
		return rawHasInstance.call(Map, instance)
			|| instance instanceof ObjectMap;
	},
});
//endregion
const ExtendMap = getExtendMap(Map);
const ExtendObjectMap = getExtendMap<string>(ObjectMap);

export {
	ObjectMap,
	ExtendMap,
	ExtendObjectMap,
};