import {
	readFileSync,
} from 'node:fs';
import path from 'node:path';

const msgPath = path.resolve('.git/COMMIT_EDITMSG');
const msg = readFileSync(msgPath, 'utf-8').trim();

if(!/^(revert: )?(feat|fix|docs|style|refactor|perf|test|build|ci|chore)(\(.+\))?: .{1,50}/.test(msg)){
	console.error('git提交信息不符合 angular 规范');
	process.exit(1);
}