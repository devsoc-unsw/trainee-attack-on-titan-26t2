import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
    js.configs.recommended,
    prettierConfig,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                process: 'readonly',
                console: 'readonly',
            },
        },
        plugins: {
            prettier,
        },
        rules: {
            'prettier/prettier': 'warn',
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'no-undef': 'error',
        },
    },
];
