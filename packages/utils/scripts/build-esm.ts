import {
	rm,
} from 'node:fs/promises';
import chalk from 'chalk';
import {
	command,
} from '../src/node';

try{
	console.log(chalk.green('删除 lib/types、lib/esm'));
	await Promise.all([
		rm('lib/types', {
			recursive:true,
			force:true,
		}),
		rm('lib/esm', {
			recursive:true,
			force:true,
		}),
	]);
	console.log(chalk.green('生成 lib/types、lib/esm'));
	const msg = await command('tsc --project tsconfig.dts.json').promise;
	console.log(msg);
}catch (error){
	console.error(error);
}