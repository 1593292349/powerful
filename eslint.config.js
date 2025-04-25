import configs from '@powerful/eslint-config/vue3';

export default [
	{
		ignores:[
			'packages/*/lib/',
			'packages/*/node_modules/',
		],
	},
	...configs,
	{
		files:[
			'**/powerful.config.ts',
		],
		rules:{
			'@typescript-eslint/no-unused-vars':'off',
		},
	},
];