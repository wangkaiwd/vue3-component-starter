import { createApp } from 'vue';
import App from './App.vue';
import { WIcon } from '../dist/es/components';
import '@sppk/theme-chalk/css/index.less';

const app = createApp(App);
app.use(WIcon);
app.mount('#app');
