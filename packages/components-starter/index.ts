import { WIcon } from '@sppk/components';
import { App } from 'vue';

const components = [
  WIcon
];

const install = (app: App) => {
  components.forEach(component => app.use(component));
};

export default install;

export * from '@sppk/components';
