import {
	defineConfig,
} from 'eslint/config';
import getConfig from './base.js';
import ts from 'typescript-eslint';
import vue from 'eslint-plugin-vue';

export default getConfig(defineConfig([
	//region vue规则
	...vue.configs['flat/vue2-recommended'].map((config) => {
		return {
			...config,
			files:[
				'**/*.vue',
			],
		};
	}),
	{
		files:[
			'**/*.vue',
		],
		languageOptions:{
			parserOptions:{
				ecmaVersion:'latest',
				sourceType:'module',
				parser:{
					js:'espree',
					ts:'@typescript-eslint/parser',
				},
			},
		},
		plugins:{
			'@typescript-eslint':ts.plugin,
		},
		rules:{
			//prop默认值
			'vue/require-default-prop':'off',
			//多单词组件名
			'vue/multi-word-component-names':'off',
			//组件内容换行
			'vue/singleline-html-element-content-newline':'off',
			//插值符 {{ }} 内无空格
			'vue/mustache-interpolation-spacing':['error', 'never'],
			//tab缩进
			'vue/html-indent':['error', 'tab'],
			//标签名空格
			'vue/html-closing-bracket-spacing':['error', {
				startTag:'never',
				endTag:'never',
				selfClosingTag:'never',
			}],
			//一行只写一个属性
			'vue/max-attributes-per-line':'error',
			//属性必须换行写
			'vue/first-attribute-linebreak':'error',
			//标签内多个元素必须换行
			'vue/multiline-html-element-content-newline':'error',
			//属性必须中划线命名
			'vue/attribute-hyphenation':'error',
			//组件命名规范PascalCase
			'vue/component-definition-name-casing':'error',
			//标签 > 换行规则
			'vue/html-closing-bracket-newline':'error',
			//必须有结束标签
			'vue/html-end-tags':'error',
			//属性值用双引号包裹
			'vue/html-quotes':'error',
			//标签尽量自闭合
			'vue/html-self-closing':'error',
			//禁止连续多个空格
			'vue/no-multi-spaces':'error',
			//禁止 = 周围的空格
			'vue/no-spaces-around-equal-signs-in-attribute':'error',
			//禁止在嵌套中使用重复变量名
			'vue/no-template-shadow':'error',
			//单文件只能有一个根元素
			'vue/one-component-per-file':'error',
			//属性命名规范camelCase
			'vue/prop-name-casing':'error',
			//属性必须定义类型
			'vue/require-prop-types':'error',
			//v-bind简写
			'vue/v-bind-style':'error',
			//v-on简写
			'vue/v-on-style':'error',
			//v-slot简写
			'vue/v-slot-style':'error',
			//属性顺序
			'vue/attributes-order':'error',
			//顶级 template, script, style顺序
			'vue/block-order':'error',
			'vue/no-lone-template':'error',
			//作用域插槽只允许一个参数
			'vue/no-multiple-slot-args':'error',
			//组件选项顺序
			'vue/order-in-components':'error',
			//禁止模板中的this
			'vue/this-in-template':'error',
		},
	},
	//endregion
]));