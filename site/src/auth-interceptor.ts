import { ServiceWorkerEvent } from './sw';

navigator.serviceWorker.addEventListener('message', async (event: ServiceWorkerEvent) => {
  if (event.data.type === 'unauthorized') {
    return logInUser(event);
  }
});

// Redirects the user to a login page whenever our API's return 401.
// This is instead of adding 401 handling to all data fetching.
async function logInUser(event: ServiceWorkerEvent) {
  const modal = document.getElementById('login-modal') as any;

  if (!modal) {
    throw new Error('unable to find login modal');
  }

  const link = document.getElementById('login-modal-continue')

  link.addEventListener('click', async event => {
    event.preventDefault();
    const resp = await fetch('/api/auth/login');
    const data = await resp.json();
    console.log('loggin in');
    window.location.href = data.next;
  });

  // modal.addEventListener('close', () => window.location.href = '/');

  modal.open();
}
