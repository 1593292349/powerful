import type {
	ExtendSetConstructor,
} from './type';

export default function<E>(Super:{
	new<T extends E>(iterable?:Iterable<T> | null):Set<T>;
	readonly prototype:Set<E>;
}):ExtendSetConstructor<E>{
	return (class ExtendSet<T extends E> extends Super<T>{
		test(){
			console.log('test');
		}
	});
}