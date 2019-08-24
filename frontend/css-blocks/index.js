const MODULE_TYPE = "css/blocks";
const pluginName = "css-blocks-plugin";

class CssBlocksPlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.thisCompilation.tap(pluginName, compilation => {
      compilation.hooks.normalModuleLoader.tap(pluginName, (lc, m) => {
        const loaderContext = lc;
        const module = m;
        loaderContext[MODULE_TYPE] = content => {};
      });
    });
    compiler.hooks.normalModuleFactory.tap(pluginName, factory => {
      factory.hooks.parser
        .for("javascript/auto")
        .tap(pluginName, (parser, options) => {
          parser.hooks.import.tap(pluginName, (statement, source) => {
            console.log(parser, options, statement, source);
          });
        });
    });
  }
}

CssBlocksPlugin.cssLoader = require.resolve("./css-loader");
CssBlocksPlugin.jsLoader = require.resolve("./js-loader");

module.exports = CssBlocksPlugin;
