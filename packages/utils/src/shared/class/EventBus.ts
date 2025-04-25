import type {
	EventMapper,
	EventBusProcessor,
} from './type';
import {
	stringMap,
} from '../function';

export default class EventBus<M extends EventMapper, R = void>{
	private eventMap = stringMap<string, Set<(...param:any) => any>>();

	private processor:undefined | EventBusProcessor<M, R>;

	constructor(processor?:EventBusProcessor<M, R>){
		this.processor = processor;
	}

	//region 监听
	on<K extends (keyof M) & string>(type:K, listener:M[K]):void{
		const {
			eventMap,
		} = this;
		let listenerSet = eventMap.get(type);
		if(!listenerSet){
			listenerSet = new Set();
			eventMap.set(type, listenerSet);
		}
		listenerSet.add(listener);
	}
	//endregion

	//region 停止监听
	off<K extends (keyof M) & string>(type:K, listener?:M[K]):boolean{
		const {
			eventMap,
		} = this;
		const listenerSet = eventMap.get(type);
		if(listenerSet){
			if(listener){
				const success = listenerSet.delete(listener);
				if(listenerSet.size === 0){
					eventMap.delete(type);
				}
				return success;
			}
			return eventMap.delete(type);
		}
		return false;
	}
	//endregion

	//region 发射事件
	emit<K extends (keyof M) & string>(type:K, ...param:Parameters<M[K]>):R | void{
		const listenerSet = this.eventMap.get(type);
		if(listenerSet){
			const {
				processor,
			} = this;
			if(processor){
				return processor(listenerSet, type, param);
			}else{
				for(const listener of listenerSet){
					listener(...param);
				}
			}
		}
	}
	//endregion
}