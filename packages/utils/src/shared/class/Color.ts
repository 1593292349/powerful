import type {
	RGB,
	HSV,
	HSL,
	HWB,
	ColorValue,
} from './type';
import {
	numberBetween,
	numberRound,
} from '../function';

//region 内部工具方法
function _convertPercentage(val:number | string, max = 255):number{
	let num;
	if(typeof val === 'string'){
		num = parseFloat(val);
		if(val.indexOf('%') !== -1){
			num *= max / 100;
		}
	}else{
		num = val;
	}
	return num
		? numberBetween(num, 0, max)
		: 0;
}
function _convertAngle(val:number | string):number{
	let num;
	if(typeof val === 'string'){
		num = parseFloat(val);
		if(val.indexOf('grad') !== -1){
			num *= 360 / 400;
		}else if(val.indexOf('rad') !== -1){
			num *= 360 / (Math.PI * 2);
		}else if(val.indexOf('turn') !== -1){
			num *= 360;
		}
	}else{
		num = val;
	}
	return !num
		? 0
		: num < 0
			? num % 360 + 360
			: num % 360;
}
function _scale(current:number, percent:number, max = 255):number{
	if(percent){
		if(percent < 0){
			return current * (percent + 1);
		}else{
			return (max - current) * percent + current;
		}
	}
	return current;
}
//endregion
export default class Color{
	//region 正则表达式
	static regExp = {
		hex:/^#?((?:[0-9a-f]{3}){1,2}|(?:[0-9a-f]{4}){1,2})$/i,
		rgb:/^rgba?\(\s*((?:\d+|\d*\.\d+)%?)\s*[\s,]\s*((?:\d+|\d*\.\d+)%?)\s*[\s,]\s*((?:\d+|\d*\.\d+)%?)(?:\s*[,/]\s*((?:\d+|\d*\.\d+)%?))?\s*\)$/i,
		hsl:/^hsla?\(\s*(-?(?:\d+|\d*\.\d+)(?:deg|grad|rad|turn)?)\s*[\s,]\s*((?:\d+|\d*\.\d+)%?)\s*[\s,]\s*((?:\d+|\d*\.\d+)%?)(?:\s*[,/]\s*((?:\d+|\d*\.\d+)%?))?\s*\)$/i,
		hsv:/^hsva?\(\s*(-?(?:\d+|\d*\.\d+)(?:deg|grad|rad|turn)?)\s*[\s,]\s*((?:\d+|\d*\.\d+)%?)\s*[\s,]\s*((?:\d+|\d*\.\d+)%?)(?:\s*[,/]\s*((?:\d+|\d*\.\d+)%?))?\s*\)$/i,
		hwb:/^hwb\(\s*(-?(?:\d+|\d*\.\d+)(?:deg|grad|rad|turn)?)\s+((?:\d+|\d*\.\d+)%?)\s+((?:\d+|\d*\.\d+)%?)(?:\s*\/\s*((?:\d+|\d*\.\d+)%?))?\s*\)$/i,
	};
	//endregion

	//red(0-255)
	r:number = 0;
	//green(0-255)
	g:number = 0;
	//blue(0-255)
	b:number = 0;
	//alpha, 小于1时表示[0,1), 大于等于1时表示[1-255]
	a:number = 255;

	//region 构造函数
	constructor();
	constructor(color:ColorValue);
	constructor(color?:ColorValue){
		if(color instanceof Color){
			this.copy(color);
		}else if(typeof color === 'number'){
			this.setHex(color);
		}else if(typeof color === 'string'){
			this.setHexString(color)
			|| this.setRgbString(color)
			|| this.setHwbString(color)
			|| this.setHslString(color)
			|| this.setHsvString(color);
		}else if(color){
			if('r' in color){
				this.setRgb(color);
			}else if('w' in color){
				this.setHwb(color);
			}else if('l' in color){
				this.setHsl(color);
			}else if('v' in color){
				this.setHsv(color);
			}
		}
	}
	//endregion

	//region 复制
	copy(color:Color):this{
		this.r = color.r;
		this.g = color.g;
		this.b = color.b;
		this.a = color.a;
		return this;
	}
	//endregion

	//region 比较
	equals(color:Color):boolean{
		return this.r === color.r
			&& this.g === color.g
			&& this.b === color.b
			&& this.alpha === color.alpha;
	}
	//endregion

	//region 设置 hex 值
	setHexString(raw:string):boolean{
		const match = Color.regExp.hex.exec(raw);
		if(match){
			let hex = match[1];
			if(hex.length === 3){
				hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
			}else if(hex.length === 4){
				hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
			}
			const num = parseInt(hex, 16);
			if(hex.length > 6){
				this.r = num >> 24 & 255;
				this.g = num >> 16 & 255;
				this.b = num >> 8 & 255;
				this.a = num & 255;
			}else{
				this.setHex(num);
			}
			return true;
		}
		return false;
	}

	setHex(num:number):this{
		this.r = num >> 16 & 255;
		this.g = num >> 8 & 255;
		this.b = num & 255;
		this.a = 255;
		return this;
	}
	//endregion

	//region 设置 rgb 值
	setRgbString(raw:string):boolean{
		const match = Color.regExp.rgb.exec(raw);
		if(match){
			this.setRgb({
				r:match[1],
				g:match[2],
				b:match[3],
				a:match[4],
			});
			return true;
		}
		return false;
	}

	setRgb(
		{
			r,
			g,
			b,
			a,
		}:RGB,
	):this{
		this.r = Math.round(_convertPercentage(r));
		this.g = Math.round(_convertPercentage(g));
		this.b = Math.round(_convertPercentage(b));
		if(a == null){
			this.a = 255;
		}else{
			this.alpha = a;
		}
		return this;
	}
	//endregion

	//region 规范 r, g, b, a
	normalize(r:number, g:number, b:number, a?:number | string):this{
		this.r = Math.round(r * 255);
		this.g = Math.round(g * 255);
		this.b = Math.round(b * 255);
		if(a == null){
			this.a = 255;
		}else{
			this.alpha = a;
		}
		return this;
	}
	//endregion

	//region 设置 hsv 值
	setHsvString(raw:string):boolean{
		const match = Color.regExp.hsv.exec(raw);
		if(match){
			this.setHsv({
				h:match[1],
				s:match[2],
				v:match[3],
				a:match[4],
			});
			return true;
		}
		return false;
	}

	setHsv(hsv:HSV):this{
		const s = _convertPercentage(hsv.s, 100) / 100;
		const v = _convertPercentage(hsv.v, 100) / 100;
		let r = 0,
			g = 0,
			b = 0;
		if(s === 0){
			r = g = b = v;
		}else if(v !== 0){
			const h = _convertAngle(hsv.h) / 360 * 6;
			const p = v * (1 - s);
			const t = v * (1 - s * Math.abs(h % 2 - 1));
			switch(Math.floor(h)){
				case 0:
					r = v;
					g = t;
					b = p;
					break;
				case 1:
					r = t;
					g = v;
					b = p;
					break;
				case 2:
					r = p;
					g = v;
					b = t;
					break;
				case 3:
					r = p;
					g = t;
					b = v;
					break;
				case 4:
					r = t;
					g = p;
					b = v;
					break;
				case 5:
					r = v;
					g = p;
					b = t;
					break;
			}
		}
		return this.normalize(r, g, b, hsv.a);
	}
	//endregion

	//region 设置 hsl 值
	setHslString(raw:string):boolean{
		const match = Color.regExp.hsl.exec(raw);
		if(match){
			this.setHsl({
				h:match[1],
				s:match[2],
				l:match[3],
				a:match[4],
			});
			return true;
		}
		return false;
	}

	setHsl(hsl:HSL):this{
		const s = _convertPercentage(hsl.s, 100) / 100;
		const l = _convertPercentage(hsl.l, 100) / 100;
		let r = 0,
			g = 0,
			b = 0;
		if(s === 0){
			r = g = b = l;
		}else if(l !== 0){
			const h = _convertAngle(hsl.h) / 360 * 6;
			const hc = (0.5 - Math.abs(l - 0.5)) * s;
			const v = l + hc;
			const p = l - hc;
			const t = l + 2 * hc * (0.5 - Math.abs(h % 2 - 1));
			switch(Math.floor(h)){
				case 0:
					r = v;
					g = t;
					b = p;
					break;
				case 1:
					r = t;
					g = v;
					b = p;
					break;
				case 2:
					r = p;
					g = v;
					b = t;
					break;
				case 3:
					r = p;
					g = t;
					b = v;
					break;
				case 4:
					r = t;
					g = p;
					b = v;
					break;
				case 5:
					r = v;
					g = p;
					b = t;
					break;
			}
		}
		return this.normalize(r, g, b, hsl.a);
	}
	//endregion

	//region 设置 hwb 值
	setHwbString(raw:string):boolean{
		const match = Color.regExp.hwb.exec(raw);
		if(match){
			this.setHwb({
				h:match[1],
				w:match[2],
				b:match[3],
				a:match[4],
			});
			return true;
		}
		return false;
	}

	setHwb(
		{
			h,
			w:white,
			b:black,
			a,
		}:HWB,
	):this{
		white = _convertPercentage(white, 100);
		black = _convertPercentage(black, 100);
		const t = white + black;
		let r = 0,
			g = 0,
			b = 0;
		if(t >= 100){
			r = g = b = white / t;
		}else{
			const s = 1 - white / (100 - black);
			const v = 1 - black / 100;
			if(s === 0){
				r = g = b = v;
			}else if(v !== 0){
				h = _convertAngle(h) / 360 * 6;
				const p = v * (1 - s);
				const t = v * (1 - s * Math.abs(h % 2 - 1));
				switch(Math.floor(h)){
					case 0:
						r = v;
						g = t;
						b = p;
						break;
					case 1:
						r = t;
						g = v;
						b = p;
						break;
					case 2:
						r = p;
						g = v;
						b = t;
						break;
					case 3:
						r = p;
						g = t;
						b = v;
						break;
					case 4:
						r = t;
						g = p;
						b = v;
						break;
					case 5:
						r = v;
						g = p;
						b = t;
						break;
				}
			}
		}
		return this.normalize(r, g, b, a);
	}
	//endregion

	//region 获取 hex 值
	toHexString(){
		const {
			r,
			g,
			b,
			a,
		} = this;
		const hexStr = `#${((b | g << 8 | r << 16) | 1 << 24).toString(16).slice(1)}`;
		if(a !== 255){
			const alphaNum = a < 1
				? Math.round(a * 255)
				: a;
			return `${hexStr}${(alphaNum | 1 << 8).toString(16).slice(1)}`;
		}
		return hexStr;
	}
	//endregion

	//region 获取 rgb 值
	toRgb():Omit<RGB<number>, 'a'>{
		return {
			r:this.r,
			g:this.g,
			b:this.b,
		};
	}

	toRgbString(){
		const rgb = this.toRgb();
		const a = this.a < 1
			? this.a
			: numberRound(this.a / 255, 2);
		if(a !== 1){
			return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
		}
		return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
	}
	//endregion

	//region 获取 hsv 值
	toHsv():Omit<HSV<number>, 'a'>{
		const {
			r,
			g,
			b,
		} = this;
		const min = Math.min(r, g, b);
		const max = Math.max(r, g, b);
		const d = max - min;
		const h = this.getHue({
			min,
			max,
			d,
		});
		const s = max === 0 ? 0 : d / max * 100;
		const v = max / 255 * 100;
		return {
			h,
			s,
			v,
		};
	}

	toHsvString(precision?:number){
		const hsv = this.toHsv();
		const h = numberRound(hsv.h, precision);
		const s = numberRound(hsv.s, precision);
		const v = numberRound(hsv.v, precision);
		const a = this.a < 1
			? this.a
			: numberRound(this.a / 255, 2);
		if(a !== 1){
			return `hsva(${h},${s}%,${v}%,${a})`;
		}else{
			return `hsv(${h},${s}%,${v}%)`;
		}
	}
	//endregion

	//region 获取 hsl 值
	toHsl():Omit<HSL<number>, 'a'>{
		const {
			r,
			g,
			b,
		} = this;
		const min = Math.min(r, g, b);
		const max = Math.max(r, g, b);
		const d = max - min;
		const h = this.getHue({
			min,
			max,
			d,
		});
		const l = (max + min) / (2 * 255) * 100;
		const s = max === min
			? 0
			: l > 50
				? d / (2 * 255 - max - min) * 100
				: d / (max + min) * 100;
		return {
			h,
			s,
			l,
		};
	}

	toHslString(precision?:number){
		const hsl = this.toHsl();
		const h = numberRound(hsl.h, precision);
		const s = numberRound(hsl.s, precision);
		const l = numberRound(hsl.l, precision);
		const a = this.a < 1
			? this.a
			: numberRound(this.a / 255, 2);
		if(a !== 1){
			return `hsla(${h},${s}%,${l}%,${a})`;
		}else{
			return `hsl(${h},${s}%,${l}%)`;
		}
	}
	//endregion

	//region 获取 hwb 值
	toHwb():Omit<HWB<number>, 'a'>{
		const {
			r,
			g,
			b,
		} = this;
		const min = Math.min(r, g, b);
		const max = Math.max(r, g, b);
		const d = max - min;
		const h = this.getHue({
			min,
			max,
			d,
		});
		const white = min / 255 * 100;
		const black = 100 - max / 255 * 100;
		return {
			h,
			w:white,
			b:black,
		};
	}

	toHwbString(precision?:number){
		const hwb = this.toHwb();
		const h = numberRound(hwb.h, precision);
		const w = numberRound(hwb.w, precision);
		const b = numberRound(hwb.b, precision);
		const a = this.a < 1
			? this.a
			: numberRound(this.a / 255, 2);
		if(a !== 1){
			return `hwb(${h} ${w}% ${b}% / ${a})`;
		}else{
			return `hwb(${h} ${w}% ${b}%)`;
		}
	}
	//endregion

	//region 色调 hue
	getHue(
		param?:{
			min:number;
			max:number;
			d:number;
		},
	):number{
		const {
			r,
			g,
			b,
		} = this;
		if(!param){
			const min = Math.min(r, g, b);
			const max = Math.max(r, g, b);
			param = {
				min,
				max,
				d:max - min,
			};
		}
		const {
			min,
			max,
			d,
		} = param;
		let h = 0;
		if(max === min){
			h = 0;
		}else{
			switch(max){
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
				default:
					break;
			}
			h *= 360 / 6;
		}
		return h;
	}

	get hue():number{
		return this.getHue();
	}
	//endregion

	//region 透明度 alpha
	get alpha():number{
		const {
			a,
		} = this;
		return a < 1
			? a
			: a / 255;
	}

	set alpha(a:number | string){
		a = _convertPercentage(a, 1);
		if(a >= 1){
			this.a = 255;
		}else{
			this.a = a;
		}
	}
	//endregion

	//region 颜色相关属性
	get isDark():boolean{
		return this.brightness < 128;
	}

	get isLight():boolean{
		return this.brightness >= 128;
	}

	get brightness():number{
		// http://www.w3.org/TR/AERT#color-contrast
		return (this.r * 299 + this.g * 587 + this.b * 114) / 1000;
	}

	get luminance():number{
		// http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
		const
			r = this.r / 255,
			g = this.g / 255,
			b = this.b / 255,
			R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
			G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
			B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
		return 0.2126 * R + 0.7152 * G + 0.0722 * B;
	}
	//endregion

	//region 调整颜色亮度
	/**
	 * @param percent   -1 ~ 1, 负数表示变暗, 正数表示变亮
	 * @param newly     是否返回新对象
	 */
	lighten(percent:number, newly?:boolean):Color{
		const color = newly
			? new Color(this)
			: this;
		if(percent){
			const {
				h,
				s,
				l,
			} = color.toHsl();
			const {a} = color;
			color.setHsl({
				h,
				s,
				l:percent < 0
					? l * (percent + 1)
					: (100 - l) * percent + l,
			});
			color.a = a;
		}
		return color;
	}

	scale(
		obj:{
			red?:number;
			green?:number;
			blue?:number;
			alpha?:number;
		} | {
			saturation?:number;
			lightness?:number;
			alpha?:number;
		} | {
			whiteness?:number;
			blackness?:number;
			alpha?:number;
		},
		newly?:boolean,
	):Color{
		const color = newly
			? new Color(this)
			: this;
		const a = obj.alpha
			? _scale(color.alpha, obj.alpha, 1)
			: color.a;
		if(
			'red' in obj
			|| 'green' in obj
			|| 'blue' in obj
		){
			const {
				r,
				g,
				b,
			} = color.toRgb();
			color.setRgb({
				r:_scale(r, obj.red || 0),
				g:_scale(g, obj.green || 0),
				b:_scale(b, obj.blue || 0),
			});
		}else if(
			'saturation' in obj
			|| 'lightness' in obj
		){
			const {
				h,
				s,
				l,
			} = color.toHsl();
			color.setHsl({
				h,
				s:_scale(s, obj.saturation || 0, 100),
				l:_scale(l, obj.lightness || 0, 100),
			});
		}else if(
			'whiteness' in obj
			|| 'blackness' in obj
		){
			const {
				h,
				w,
				b,
			} = color.toHwb();
			color.setHwb({
				h,
				w:_scale(w, obj.whiteness || 0, 100),
				b:_scale(b, obj.blackness || 0, 100),
			});
		}
		color.a = a;
		return color;
	}
	//endregion

	//region 混合颜色
	/**
	 * @param color
	 * @param amount    0 ~ 100, 0表示当前颜色
	 */
	mix(color:ColorValue, amount = 50):Color{
		const {
			r,
			g,
			b,
			alpha,
		} = this;
		const color2 = new Color(color);
		const p = amount / 100;
		color2.setRgb({
			r:(color2.r - r) * p + r,
			g:(color2.g - g) * p + g,
			b:(color2.b - b) * p + b,
			a:(color2.alpha - alpha) * p + alpha,
		});
		return color2;
	}

	onBackground(background:ColorValue):Color{
		const bg = new Color(background);
		bg.setRgb(Color.overlap(bg, this));
		return bg;
	}

	onForeground(foreground:ColorValue):Color{
		const fg = new Color(foreground);
		fg.setRgb(Color.overlap(this, fg));
		return fg;
	}
	//endregion

	static overlap(bg:Color, fg:Color):Required<RGB<number>>{
		const fgAlpha = fg.alpha;
		const bgAlpha = bg.alpha;
		const alpha = fgAlpha + bgAlpha * (1 - fgAlpha);
		return {
			r:(fg.r * fgAlpha + bg.r * bgAlpha * (1 - fgAlpha)) / alpha,
			g:(fg.g * fgAlpha + bg.g * bgAlpha * (1 - fgAlpha)) / alpha,
			b:(fg.b * fgAlpha + bg.b * bgAlpha * (1 - fgAlpha)) / alpha,
			a:alpha,
		};
	}
}