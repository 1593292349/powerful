import {
	type ExecOptions,
	type ChildProcess,
	exec,
} from 'node:child_process';

//region TextDecoder
const decoder = new TextDecoder(
	process.platform === 'win32'
		? 'gbk'
		: undefined,
);
//endregion
//region command
function command(cmd:string, option?:Omit<ExecOptions, 'encoding'> | undefined | null){
	let childProcess:ChildProcess;
	const promise = new Promise<string>((resolve, reject) => {
		childProcess = exec(cmd, {
			...option,
			encoding:'buffer',
		}, (error, stdout, stderr) => {
			if(error != null){
				reject(new Error(`命令执行失败: ${cmd}\n\n${decoder.decode(stdout)}${decoder.decode(stderr)}`));
			}else{
				resolve(decoder.decode(stdout));
			}
		});
	});
	return {
		promise,
		//@ts-ignore
		childProcess,
	};
}
//endregion

export * from '../shared';
export {
	decoder,
	command,
};