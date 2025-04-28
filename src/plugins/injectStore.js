// plugins/injectStore.js
import { useSnackStore } from '@/store/snackStore';

export default {
  install(app) {
    app.config.globalProperties.$snackStore = useSnackStore();
  },
};