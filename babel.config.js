module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.ts',
          '.tsx',
          '.json',
          '.png',
        ],
        alias: {
          '*': '.',
          '@src': './src',
          '@assets': './assets',
          '@components': './src/components',
          '@data': './src/data/index.ts',
          '@screens': './src/screens',
          '@entity': './src/entity',
          '@navigation': './src/navigation/index.ts',
          '@theme': './src/theme/index.ts',
        },
      },
    ],
  ],
};
