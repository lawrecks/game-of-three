import rootPath from 'app-root-path';
import development from './development';

const { PORT, NODE_ENV } = process.env;

const currentEnv = {
  development,
}[NODE_ENV || 'development'];

export default {
  ...process.env,
  ...currentEnv,
  rootPath,
  PORT,
  NODE_ENV,
};