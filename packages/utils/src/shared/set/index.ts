import ObjectSet from './ObjectSet';
import getExtendSet from './getExtendSet';

//region 让 ObjectSet 实例, 支持 instanceof Set
const rawHasInstance = Set[Symbol.hasInstance];
Object.defineProperty(Set, Symbol.hasInstance, {
	value:function(instance:any){
		return rawHasInstance.call(Set, instance)
			|| instance instanceof ObjectSet;
	},
});
//endregion
const ExtendSet = getExtendSet(Set);
const ExtendObjectSet = getExtendSet<string>(ObjectSet);

export {
	ObjectSet,
	ExtendSet,
	ExtendObjectSet,
};