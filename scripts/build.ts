import {
	command,
} from '@powerful/utils/esm/node';

const data = await command('git rev-parse --abbrev-ref HEAD').promise;

console.log(data);