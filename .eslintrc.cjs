const { join } = require('node:path');
const config = require('@sapphire/eslint-config');

module.exports = {
    ...config,
    parserOptions: {
        ...config.parserOptions,
        project: join(__dirname, 'tsconfig.eslint.json')
    },
    rules: {
        ...config.rules,
        '@typescript-eslint/no-base-to-string': 0,
        '@typescript-eslint/no-throw-literal': 0,
        'no-catch-shadow': 0,
        '@typescript-eslint/no-extraneous-class': 0
    }
};
