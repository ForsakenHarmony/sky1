module.exports = function(api) {
  api.cache(() => process.env.NODE_ENV);

  const isProd = process.env.NODE_ENV;

  return {
    babelrc: false,
    presets: [
      [
        require.resolve('@babel/preset-env'),
        {
          loose: true,
          modules: false,
          targets: {
            browsers: ['>0.5%'],
          },
          exclude: ['transform-regenerator', 'transform-async-to-generator'],
        },
      ],
    ],
    plugins: [
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('@babel/plugin-transform-object-assign'),
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      require.resolve('@babel/plugin-proposal-class-properties'),
      require.resolve('@babel/plugin-proposal-object-rest-spread'),
      require.resolve('@babel/plugin-transform-react-constant-elements'),
      isProd &&
        require.resolve('babel-plugin-transform-react-remove-prop-types'),
      [require.resolve('@babel/plugin-transform-react-jsx'), { pragma: 'h' }],
      require.resolve('fast-async'),
    ].filter(Boolean),
    env: {
      production: {
        plugins: [['emotion', { hoist: true }]],
      },
      development: {
        plugins: [['emotion', { sourceMap: true, autoLabel: true }]],
      },
    },
  };
};
