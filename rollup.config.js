import { InputOptions } from 'rollup';
import path from 'path';

import typescriptPlugin from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

import minifyHTML from 'rollup-plugin-minify-html-literals';
import minifyTaggedCSSTemplate from 'rollup-plugin-minify-tagged-css-template';
const terser = require('rollup-plugin-terser').terser;

import { visualizer } from 'rollup-plugin-visualizer';

import { DEFAULT_EXTENSIONS } from '@babel/core';

const atImport = require('postcss-import');

/** @type {'dev' | 'lib' | 'prod'} */
let mode = 'dev';

const plugins = {
  replace: replace({
    'process.env.NODE_ENV': process.env.NODE_ENV === 'development' ? JSON.stringify('development') : JSON.stringify('production'),
    preventAssignment: true,
  }),
  resolve: resolve(),
  ts: typescriptPlugin({
    tsconfig: `./tsconfig.${mode}.json`,
    useTsconfigDeclarationDir: true,
  }),
  ts_skip_dts: typescriptPlugin({
    tsconfig: `./tsconfig.${mode}.json`,
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      compilerOptions: {
        declaration: false,
        declarationDir: null,
      },
    },
  }),
  babel: babel({
    babelHelpers: 'bundled',
    extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    exclude: 'node_modules/**',
  }),
  postcss: postcss({
    inject: false,
    extensions: ['.css', '.pcss', '.scss'],
    plugins: [atImport()],
  }),
  commonjs: commonjs(), // convert CommonJS modules to ES6 (for dagre)
  json: json(), // convert CommonJS modules to ES6 (for dagre)
  minify: [
    minifyHTML({
      options: {
        // minifyOptions: {
        //   minifyCSS: false
        // },
        shouldMinifyCSS: () => false,
      },
    }),
    minifyTaggedCSSTemplate({
      parserOptions: {
        sourceType: 'module', // treat files as ES6 modules
        plugins: [
          'syntax-dynamic-import', // handle dynamic imports
          [
            'decorators', // use decorators proposal plugin
            { decoratorsBeforeExport: true },
          ],
        ],
      },
    }),
    terser(),
  ],
};

/** @type InputOptions */
const DEV = {
  input: './www/src/index.tsx',
  output: {
    dir: './www',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
    sourcemap: 'inline',
    sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
      // will replace relative paths with absolute paths
      return path.resolve(path.dirname(sourcemapPath), relativeSourcePath);
    },
  },
  plugins: [
    plugins.replace, //
    plugins.resolve,
    plugins.commonjs,
    plugins.json,
    plugins.ts,
    plugins.babel,
    plugins.postcss,
  ],
};

/** @type InputOptions */
const LIB = {
  input: './src/index.ts',
  output: {
    file: './lib/index.es.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    plugins.replace,
    plugins.resolve,
    plugins.commonjs,
    plugins.json,
    plugins.ts,
    plugins.babel,
    plugins.postcss,
    ...plugins.minify,
    // visualizer(),
  ],
  // indicate which modules should be treated as external
  external: [/lit-html/, 'react', '@web-companions/react-adapter'],
};

/** @type InputOptions */
const LIB_IIFE = {
  ...LIB,
  output: {
    file: './lib/index.js',
    format: 'iife',
    name: 'ViewGraph',
    sourcemap: true,
  },
  plugins: [
    plugins.replace, //
    plugins.resolve,
    plugins.commonjs,
    plugins.json,
    plugins.ts_skip_dts,
    plugins.babel,
    plugins.postcss,
    ...plugins.minify,
  ],
  external: ['react', '@web-companions/react-adapter'],
};

/** @type InputOptions */
const LIB_REACT_ADAPTER = {
  input: './src/adapters/view-graph-react.tsx',
  output: [
    {
      file: './lib/adapters/view-graph-react.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    plugins.replace, //
    plugins.resolve,
    plugins.commonjs,
    plugins.json,
    plugins.ts_skip_dts,
    plugins.babel,
    plugins.postcss,
    ...plugins.minify,
  ],
  // indicate which modules should be treated as external
  external: [/lit-html/, 'react'],
};

/** @type InputOptions */
const WWW = {
  input: './www/src/index.tsx',
  output: {
    dir: './www',
    format: 'iife', // immediately-invoked function expression — suitable for <script> tags
  },
  plugins: [
    plugins.replace, //
    plugins.resolve,
    plugins.commonjs,
    plugins.json,
    plugins.ts,
    plugins.babel,
    plugins.postcss,
    ...plugins.minify
  ],
};

export default (commandLineArgs) => {
  console.log('CONFIG MODE', commandLineArgs.configMode);

  mode = commandLineArgs.configMode ?? mode;


  switch (mode) {
    case 'prod':
      return [WWW];
    case 'dev':
      return [DEV];
    case 'lib':
      return [LIB, LIB_IIFE, LIB_REACT_ADAPTER];
  }
};
