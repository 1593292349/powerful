import {
	defineConfig,
} from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default function(vueConfig:ReturnType<typeof defineConfig>){
	return defineConfig([
		//region 全局配置
		{
			ignores:[
				'static/',
			],
		},
		{
			languageOptions:{
				globals:{
					...globals.node,
					...globals.browser,
					...globals.es2026,
				},
			},
			linterOptions:{
				noInlineConfig:true,
				reportUnusedDisableDirectives:'error',
			},
		},
		//endregion
		//region js规则
		js.configs.recommended,
		{
			rules:{
				//禁止var
				'no-var':'error',
				//禁止使用arguments,而使用剩余参数
				'prefer-rest-params':'error',
				//比较相等用 ===
				eqeqeq:['error', 'always', {
					null:'ignore',
				}],
				//条件测试不能用常量表达式(循环除外)
				'no-constant-condition':['error', {
					checkLoops:false,
				}],
			},
		},
		//endregion
		//region ts规则
		...ts.configs.recommended.map((config) => {
			return {
				...config,
				files:[
					'**/*.ts',
					'**/*.vue',
				],
			};
		}),
		{
			files:[
				'**/*.ts',
				'**/*.vue',
			],
			rules:{
				'@typescript-eslint/no-this-alias':'off',
				'@typescript-eslint/no-empty-function':'off',
				'@typescript-eslint/no-explicit-any':'off',
				'@typescript-eslint/ban-ts-comment':'off',
				'@typescript-eslint/no-non-null-assertion':'off',
				'@typescript-eslint/no-unused-expressions':'off',
			},
		},
		//endregion
		...vueConfig,
		//region 代码风格
		stylistic.configs.customize({
			//缩进
			indent:'tab',
			//字符串
			quotes:'single',
			//分号
			semi:true,
			jsx:true,
			//箭头函数
			arrowParens:true,
			//大括号样式
			braceStyle:'1tbs',
			//块之间空格
			blockSpacing:false,
			//对象字面值属性是否加引号
			quoteProps:'as-needed',
			//尾逗号
			commaDangle:'always-multiline',
		}),
		{
			plugins:{
				'@stylistic':stylistic,
			},
			rules:{
				//注释中一致的空格
				'@stylistic/spaced-comment':'off',
				//不允许花括号内出现多余的空格
				'@stylistic/object-curly-spacing':['error', 'never'],
				//语句块前不能有多余的空格
				'@stylistic/space-before-blocks':['error', 'never'],
				//函数的参数括号前不能有多余的空格
				'@stylistic/space-before-function-paren':['error', {
					anonymous:'never',
					named:'never',
					asyncArrow:'always',
				}],
				//对象字面值,键值对和冒号间不能有空格
				'@stylistic/key-spacing':['error', {
					beforeColon:false,
					afterColon:false,
				}],
				//逗号前后不能有空格
				'@stylistic/comma-spacing':['error', {
					before:false,
					after:true,
				}],
				//关键字周围的空格
				'@stylistic/keyword-spacing':['error', {
					before:true,
					after:true,
					overrides:{
						switch:{after:false, before:false},
						if:{after:false, before:false},
						else:{after:false, before:false},
						for:{after:false, before:false},
						do:{after:false, before:false},
						while:{after:false, before:false},
						default:{after:true, before:false},
						this:{after:false, before:false},
						try:{after:false, before:false},
						catch:{after:false, before:false},
						finally:{after:false, before:false},
						await:{after:false, before:false},
					},
				}],
				//生成器函数,*前不能有空格,*后面必须有空格
				'@stylistic/generator-star-spacing':['error', {
					before:false,
					after:true,
				}],
				//yield*表达式,*前不能有空格,*后面必须有空格
				'@stylistic/yield-star-spacing':['error', {
					before:false,
					after:true,
				}],
				//类型声明周围的空格
				'@stylistic/type-annotation-spacing':['error', {
					before:false,
					after:false,
					overrides:{
						arrow:{
							before:true,
							after:true,
						},
					},
				}],
				//文件末尾追加换行符
				'@stylistic/eol-last':['error', 'never'],
				//缩进
				'@stylistic/indent':['error', 'tab', {
					ArrayExpression:1,
					CallExpression:{arguments:1},
					flatTernaryExpressions:false,
					FunctionDeclaration:{body:1, parameters:1},
					FunctionExpression:{body:1, parameters:1},
					ignoreComments:true,
					ImportDeclaration:1,
					MemberExpression:1,
					ObjectExpression:1,
					offsetTernaryExpressions:false,
					outerIIFEBody:1,
					SwitchCase:1,
					VariableDeclarator:1,
					ignoredNodes:[
						'TemplateLiteral *',
						'JSXElement',
						'JSXElement > *',
						'JSXAttribute',
						'JSXIdentifier',
						'JSXNamespacedName',
						'JSXMemberExpression',
						'JSXSpreadAttribute',
						'JSXExpressionContainer',
						'JSXOpeningElement',
						'JSXClosingElement',
						'JSXFragment',
						'JSXOpeningFragment',
						'JSXClosingFragment',
						'JSXText',
						'JSXEmptyExpression',
						'JSXSpreadChild',
						'TSUnionType',
						'TSIntersectionType',
						'TSTypeParameterInstantiation',
						'FunctionExpression > .params[decorators.length > 0]',
						'FunctionExpression > .params > :matches(Decorator, :not(:first-child))',
						'ClassBody.body > PropertyDefinition[decorators.length > 0] > .key',
					],
				}],
			},
		},
		//endregion
	]);
};