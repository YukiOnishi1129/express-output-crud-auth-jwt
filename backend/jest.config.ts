import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest', // TypeScriptをサポート
  testEnvironment: 'node', // Node.js環境でテストを実行
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest', // TypeScriptファイルをトランスパイル
  },
  testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).ts'], // テストファイルのマッチパターン
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // エイリアスの解決
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // テスト実行前に実行するファイル(e2eテストの実行は除く)
};

export default config;
