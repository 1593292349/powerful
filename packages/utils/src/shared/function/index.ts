import type {
	PlatformInfo,
} from './type';
import {
	ObjectMap,
} from '../map';
import {
	ObjectSet,
} from '../set';

//region splitString
/**
 * 简单的把字符串分成2个字符串
 * @param str		分割的字符串
 * @param separator	分隔符
 * @return			字符串数组
 */
function splitString(str:string, separator:string):[string, string]{
	const pos = separator ? str.indexOf(separator) : -1;
	if(pos === -1){
		return [str, ''];
	}
	return [str.slice(0, pos), str.slice(pos + separator.length)];
}
//endregion
//region replaceString
/**
 * 字符串替换
 * @param src		原始字符串
 * @param search	搜索值
 * @param replace	替换值
 * @return 替换后的字符串
 */
function replaceString(src:string, search:string, replace:string):string{
	let pos = 0;
	let next = src.indexOf(search);
	let str = '';
	while(next !== -1){
		str += src.slice(pos, next) + replace;
		pos = next + search.length;
		next = src.indexOf(search, pos);
	}
	return str + src.slice(pos);
}
//endregion
//region decimalDigits
/**
 * 获取小数位数
 * 传入一个实数, 返回该实数的小数位数
 * @param number	传入的实数
 * @return			小数位数
 */
function decimalDigits(number:number | string):number{
	if(typeof number === 'string'){
		number = Number(number);
	}
	if(!Number.isFinite(number)){
		return NaN;
	}
	number = number + '';
	const p1 = number.indexOf('.');
	const p2 = number.indexOf('e');
	if(p2 !== -1){
		let decimal = p1 === -1 ? 0 : p2 - p1 - 1;
		decimal -= Number(number.slice(p2 + 1));
		return decimal < 0 ? 0 : decimal;
	}
	return p1 === -1 ? 0 : number.length - p1 - 1;
}
//endregion
//region numberRound、numberCeil、numberFloor
/**
 * 适配 Math.round ,Math.ceil ,Math.floor 带小数位数的版本
 * @param type		类型
 * @param number	取整的数
 * @param digits	小数位数
 * @return			取整后的数
 */
function _decimalAdjust(type:'round' | 'ceil' | 'floor', number:number, digits?:number):number{
	const fn = Math[type];
	if(digits === undefined || digits === 0 || number === 0 || !Number.isFinite(number)){
		return fn(number);
	}else if(digits === Infinity){
		return number;
	}else if(digits === -Infinity){
		return 0;
	}else if(digits !== digits){
		return NaN;
	}else{
		let pow;
		let value;
		if(digits > 0){
			pow = Math.pow(10, digits);
			value = number * pow;
			if(value === Infinity || value === -Infinity){
				return number;
			}else if(digits > 22){
				if(value > Number.MAX_SAFE_INTEGER || value < Number.MIN_SAFE_INTEGER){
					const [real, index] = splitString(number.toString(), 'e');
					value = Number(real + 'e' + (index ? (+index + digits) : digits));
				}
				const [real, index] = splitString(fn(value).toString(), 'e');
				return +(real + 'e' + (index ? (+index - digits) : -digits));
			}else{
				return fn(value) / pow;
			}
		}else{
			pow = Math.pow(10, -digits);
			value = number / pow;
			if(value < 1 && value > -1){
				return 0;
			}else{
				return fn(value) * pow;
			}
		}
	}
}
/**
 * 四舍五入
 * 把指定实数, 按一定小数位数四舍五入
 * @param number	被四舍五入的实数
 * @param digits	保留的小数位数
 * @return			四舍五入后的值
 */
function numberRound(number:number, digits?:number):number{
	return _decimalAdjust('round', number, digits);
}
/**
 * 向上取整
 * @param number	被取整的数
 * @param digits	取整的小数位数
 * @return			取整后的数
 */
function numberCeil(number:number, digits?:number):number{
	return _decimalAdjust('ceil', number, digits);
}
/**
 * 向下取整
 * @param number	被取整的数
 * @param digits	取整的小数位数
 * @return			取整后的数
 */
function numberFloor(number:number, digits?:number):number{
	return _decimalAdjust('floor', number, digits);
}
//endregion
//region numberAdd、numberAdds
/**
 * 安全加法
 * 浮点数的加减不会出现误差, 例如: 0.1 + 0.2
 * @param p1	相加数1
 * @param p2	相加数2
 * @return		和
 */
function numberAdd(p1:number, p2:number):number{
	return numberRound(p1 + p2, Math.max(0, decimalDigits(p1), decimalDigits(p2)));
}
/**
 * 安全加法(多个)
 * 浮点数的加减不会出现误差, 例如: 0.1 + 0.2 + 0.3
 * @param p1	相加数1
 * @param p2	相加数2
 * @param p3	相加数3
 * @param rest	其他相加数
 * @return		和
 */
function numberAdds(p1:number, p2:number, p3:number, ...rest:Array<number>):number{
	let maxDecimalDigits = Math.max(0, decimalDigits(p1), decimalDigits(p2), decimalDigits(p3));
	let result = p1 + p2 + p3;
	for(const p of rest){
		result += p;
		const val = decimalDigits(p);
		if(val > maxDecimalDigits){
			maxDecimalDigits = val;
		}
	}
	return numberRound(result, maxDecimalDigits);
}
//endregion
//region numberMulti、numberMultis
/**
 * 安全乘法
 * 浮点数的乘除不会出现误差, 例如: 0.1 * 0.9
 * @param p1	相乘数1
 * @param p2	相乘数2
 * @return		乘积
 */
function numberMulti(p1:number, p2:number):number{
	return numberRound(p1 * p2, decimalDigits(p1) + decimalDigits(p2));
}
/**
 * 安全乘法(多个)
 * 浮点数的乘除不会出现误差, 例如: 0.1 * 0.9 * 2
 * @param p1	相乘数1
 * @param p2	相乘数2
 * @param p3	相乘数3
 * @param rest	其他相乘数
 * @return			乘积
 */
function numberMultis(p1:number, p2:number, p3:number, ...rest:Array<number>):number{
	let maxDecimalDigits = decimalDigits(p1) + decimalDigits(p2) + decimalDigits(p3);
	let result = p1 * p2 * p3;
	for(const p of rest){
		result *= p;
		maxDecimalDigits += decimalDigits(p);
	}
	return numberRound(result, maxDecimalDigits);
}
//endregion
//region numberToString
const urlSafeChar = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
/**
 * 把数字转换为 'A-Za-z0-9_-'
 * @param num 转换的数字
 * @return 转换后的字符串
 */
function numberToString(num:number):string{
	let res = '';
	do{
		res = urlSafeChar[num & 63] + res;
		num >>>= 6;
	}while(num);
	return res;
}
//endregion
//region pointInPolygon 点是否在多边形内
function pointInPolygon(
	[x, y]:[number, number],
	points:Array<[number, number]>,
):boolean | 'on'{
	let oddNodes = false;
	for(let i = points.length - 1, j = 0; i >= 0; j = i, --i){
		const [x1, y1] = points[i];
		const [x2, y2] = points[j];
		if(y === y1){
			if(x === x1){
				return 'on';
			}
			if(y === y2){
				if((x1 <= x && x2 >= x) || (x1 >= x && x2 <= x)){
					return 'on';
				}
				continue;
			}
		}
		if(
			((y1 < y && y2 >= y) || (y2 < y && y1 >= y))
			&& (x1 > x || x2 > x)
		){
			const _x = x1 + (y - y1) / (y2 - y1) * (x2 - x1);
			if(_x === x){
				return 'on';
			}
			if(_x > x){
				oddNodes = !oddNodes;
			}
		}
	}
	return oddNodes;
}
//endregion
//region 角度, 弧度互转
const DEG2RAD = Math.PI / 180;
function degToRad(degrees:number):number{
	return degrees * DEG2RAD;
}
function radToDeg(radians:number):number{
	return radians / DEG2RAD;
}
//endregion
//region 限制数值范围
function numberBetween(value:number, min:number, max:number):number{
	if(max < value){
		value = max;
	}
	if(min > value){
		value = min;
	}
	return value;
}
//endregion
//region platform
let _platform:PlatformInfo | undefined;
function platform():PlatformInfo{
	if(!_platform){
		_platform = {
			ie:/MSIE|Trident/.test(navigator.userAgent),
		};
	}
	return _platform;
}
//endregion
//region stringMap
function stringMap<K extends string, V>():Map<K, V>{
	if(platform().ie){
		return new ObjectMap<K, V>();
	}
	return new Map<K, V>();
}
//endregion
//region stringSet
function stringSet<T extends string>():Set<T>{
	if(platform().ie){
		return new ObjectSet<T>();
	}
	return new Set<T>();
}
//endregion

export {
	splitString,
	replaceString,
	decimalDigits,
	numberRound,
	numberCeil,
	numberFloor,
	numberAdd,
	numberAdds,
	numberMulti,
	numberMultis,
	numberToString,
	pointInPolygon,
	degToRad,
	radToDeg,
	numberBetween,
	stringMap,
	stringSet,
};