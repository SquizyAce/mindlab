import { createApp } from 'vue';
import App from './App.vue';
import ru from 'element-plus/dist/locale/ru.mjs';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

const app = createApp(App)

app.use(ElementPlus, {locale: ru}).mount('#app')

