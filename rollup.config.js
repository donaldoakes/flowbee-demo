// TODO: stay on plugin-typescript 3.x pending this issue:
// https://github.com/rollup/plugins/issues/287
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default [
    // browser UMD build
    {
        input: 'src/main.ts',
        output: {
            name: 'flowbee-demo',
            file: 'public/js/index.js',
            format: 'umd',
            sourcemap: true
        },
        plugins: [
            resolve(),
            commonjs(),
            typescript()
        ]
    }
];
