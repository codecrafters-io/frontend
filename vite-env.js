import * as Config from './config/environment.js';
const makeConfig = Config.default || Config;
// Check if makeConfig is a function, if not, maybe it's nested
const fn = typeof makeConfig === 'function' ? makeConfig : makeConfig.default;
const config = fn(import.meta.env.MODE || 'production');
export default config;
