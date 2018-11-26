module.exports = function (w) {

    return {
        files: [
            'src/**/*.ts',
            'package.json',
            'tsconfig.json',
            '!src/**/__tests__/*.ts'
        ],

        tests: [
            'src/**/__tests__/*.ts'
        ],

        env: {
            type: 'node',
            runner: 'node'
        },

        testFramework: 'jest'
    };
};
