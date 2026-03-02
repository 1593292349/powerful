import {
	type JestConfigWithTsJest,
	createJsWithTsPreset,
	pathsToModuleNameMapper,
} from 'ts-jest';
import {
	readFileSync,
} from 'node:fs';
import {
	fileURLToPath,
} from 'node:url';
import {
	dirname,
	join,
} from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const tsconfigPath = join(__dirname, 'tsconfig.json');
const {
	compilerOptions,
} = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));

const presetConfig = createJsWithTsPreset({
});

const jestConfig:JestConfigWithTsJest = {
	projects:[
		{
			...presetConfig,
			displayName:'node',
			setupFilesAfterEnv:['<rootDir>/jest.setup.ts'],
			testEnvironment:'node',
			testMatch:['<rootDir>/src/**/*.node.test.[jt]s'],
			moduleNameMapper:pathsToModuleNameMapper(compilerOptions.paths, {
				prefix:'<rootDir>/',
			}),
		},
		{
			...presetConfig,
			displayName:'browser',
			setupFilesAfterEnv:['<rootDir>/jest.setup.ts'],
			testEnvironment:'jsdom',
			testMatch:['<rootDir>/src/**/*.browser.test.[jt]s'],
			moduleNameMapper:pathsToModuleNameMapper(compilerOptions.paths, {
				prefix:'<rootDir>/',
			}),
		},
	],
};

export default jestConfig;