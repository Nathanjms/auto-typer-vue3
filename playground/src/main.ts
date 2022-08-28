import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import InstallPlugin from 'auto-typer-vue';


const app = createApp(App);
app.use(InstallPlugin());
createApp(App).mount('#app')
