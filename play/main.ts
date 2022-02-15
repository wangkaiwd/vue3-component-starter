import { createApp } from 'vue';
import App from './App.vue';
import Icon from '@sppk/components/icon';

const app = createApp(App);
app.use(Icon);
app.mount('#app');
