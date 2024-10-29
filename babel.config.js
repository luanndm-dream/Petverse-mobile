module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [ 
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.ts',
          '.tsx',
          '.json',
          '.svg',
          ".ios.tsx"
        ],
        alias: {
          '@': './src',
          '@/components': './src/components',
          '@/redux': './src/redux',
          // '@/redux': './src/redux',
          // '@/navigation': './src/navigation',
          // '@/screens': './src/screens/',
          // '@/constants': './src/constants',
          // '@/services': './src/services',
          // '@/icons': './src/assets/icons',
          // '@/data': './src/data',
          // '@/constants': './src/constants',
          // '@/hooks': './src/hooks',
          // '@/utils': './src/utils'
        },
      },
      
    ],
    'react-native-reanimated/plugin',
  ],
};
