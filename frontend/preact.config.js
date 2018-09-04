import { DefinePlugin } from 'webpack';
import typescript from 'preact-cli-plugin-typescript';
import { resolve } from 'path';

const { required } = require('dotenv-safe').config();

export default function(config, env, helpers) {
  const { rule } = helpers.getLoadersByName(config, 'babel-loader')[0];
  const babelConfig = rule.options;
  //
  // // emotion
  // {
  //   babelConfig.env = {
  //     production: {
  //       plugins: [['emotion', { hoist: true }]],
  //     },
  //     development: {
  //       plugins: [['emotion', { sourceMap: true, autoLabel: true }]],
  //     },
  //   };
  // }
  //
  // fast-async
  {
    // Blacklist regenerator within env preset:
    babelConfig.presets[0][1].exclude.push('transform-async-to-generator');
    // Add fast-async
    babelConfig.plugins.push([require.resolve('fast-async'), { spec: true }]);
  }
  //
  // // typescript plugin
  // {
  //   config.module.rules.unshift({
  //     enforce: 'pre',
  //     test: /\.tsx?$/,
  //     loader: 'awesome-typescript-loader',
  //   });
  //
  //   config.module.rules[1].test = /\.[tj]sx?$/;
  //
  //   config.resolve.alias['preact-cli-entrypoint'] = resolve(process.cwd(), 'src', 'index')
  // }
  //
  // // typescript preset
  // {
  //   // babelConfig.presets.push(['@babel/preset-typescript']);
  // }
  //
  // // dotenv injection
  // {
  //   if (required) {
  //     config.plugins.push(
  //       new DefinePlugin({
  //         'process.env': Object.keys(required).reduce(
  //           (env, key) =>
  //             Object.assign(env, {
  //               [key]: JSON.stringify(required[key]),
  //             }),
  //           {}
  //         ),
  //       })
  //     );
  //   }
  // }

  // graphql-tag loader
  {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
  }
}
