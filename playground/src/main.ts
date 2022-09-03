import { createApp } from 'vue'
import App from './App.vue'
import InstallPlugin from 'auto-typer-vue';
import '../../src/styles/main.scss';


const app = createApp(App);
app.use(InstallPlugin());
createApp(App).mount('#app')
