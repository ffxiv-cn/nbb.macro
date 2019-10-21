module.exports = {
  productionSourceMap: false,
  chainWebpack: config => {
    config.output
      .filename('js/[name].[hash].js')
      .chunkFilename('js/[name].[hash].js')
  }
}
