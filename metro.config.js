const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'), // Sử dụng react-native-svg-transformer
  },
  resolver: {
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'), // Loại bỏ svg khỏi assetExts
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'], // Thêm svg vào sourceExts
  },
};

module.exports = mergeConfig(defaultConfig, config);