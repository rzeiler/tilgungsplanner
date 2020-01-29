module.exports = {
  outputDir: "docs",
  publicPath: '/docs/',
  pwa: {
    name: 'Tilgungsplanner',
    theme_color: "#42b983",
    background_color: "#42b983",
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    // configure the workbox plugin
    manifestPath: "public/manifest.json"

  }

};
