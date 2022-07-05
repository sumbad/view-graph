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

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = process.env.NODE_ENV != null ? process.env.NODE_ENV === 'production' : !process.env.ROLLUP_WATCH;

const plug = {
  replace: replace({
    'process.env.NODE_ENV': production ? JSON.stringify('production') : JSON.stringify('development'),
    preventAssignment: true,
  }),
  resolve: resolve(),
  ts: typescriptPlugin({
    tsconfig: `./tsconfig.${production ? 'prod' : 'dev'}.json`,
    useTsconfigDeclarationDir: true,
  }),
  ts_skip_dts: typescriptPlugin({
    tsconfig: `./tsconfig.${production ? 'prod' : 'dev'}.json`,
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
    plug.replace, //
    plug.resolve,
    plug.commonjs,
    plug.json,
    plug.ts,
    plug.babel,
    plug.postcss,
  ],
};

const PROD = {
  input: './src/index.ts',
  output: {
    file: './lib/index.es.js',
    format: 'es',
    sourcemap: true,
  },
  plugins: [
    plug.replace,
    plug.resolve,
    plug.commonjs,
    plug.json,
    plug.ts,
    plug.babel,
    plug.postcss,
    ...plug.minify,
    // visualizer(),
  ],
  // indicate which modules should be treated as external
  external: [/lit-html/, 'react', '@web-companions/react-adapter'],
};

const PROD_IIFE = {
  ...PROD,
  output: {
    file: './lib/index.js',
    format: 'iife',
    name: 'ViewGraph',
    sourcemap: true,
  },
  plugins: [
    plug.replace, //
    plug.resolve,
    plug.commonjs,
    plug.json,
    plug.ts_skip_dts,
    plug.babel,
    plug.postcss,
    ...plug.minify,
  ],
  external: ['react', '@web-companions/react-adapter'],
};

export const PROD_REACT_ADAPTER = {
  input: './src/adapters/view-graph-react.tsx',
  output: [
    {
      file: './lib/adapters/view-graph-react.js',
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    plug.replace, //
    plug.resolve,
    plug.commonjs,
    plug.json,
    plug.ts_skip_dts,
    plug.babel,
    plug.postcss,
    ...plug.minify,
  ],
  // indicate which modules should be treated as external
  external: [/lit-html/, 'react'],
};

export default production
  ? [
      PROD, 
      PROD_IIFE,
      PROD_REACT_ADAPTER,
    ]
  : [DEV];
