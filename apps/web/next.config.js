const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.resolve.alias['@react-native-async-storage/async-storage'] = path.resolve(__dirname, 'lib/shims/asyncStorage.ts');
    config.resolve.alias['pino-pretty'] = path.resolve(__dirname, 'lib/shims/pinoPretty.ts');
    return config;
  }
};

module.exports = nextConfig;
