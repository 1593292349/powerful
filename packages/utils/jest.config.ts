import {
	type JestConfigWithTsJest,
	createJsWithTsPreset,
	pathsToModuleNameMapper,
} from 'ts-jest';
import {
	compilerOptions,
} from './tsconfig.json';

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