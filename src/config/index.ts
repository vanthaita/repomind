import { ENV } from '@/constants/env';
import { developmentConfig } from './development';
import { productionConfig } from './production';

// Export config based on environment
export const config = ENV.IS_PRODUCTION ? productionConfig : developmentConfig;

// Export individual configs
export { developmentConfig, productionConfig };

// Type for config
export type AppConfig = typeof config; 