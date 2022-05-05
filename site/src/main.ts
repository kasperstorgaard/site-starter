import { registerSW } from 'virtual:pwa-register';

if (typeof window !== 'undefined') {
  import('./auth-interceptor')

  const updateSW = registerSW({
    onNeedRefresh() {},
    onOfflineReady() {
      console.log('Offline ready');
    },
  });

  updateSW();
}
