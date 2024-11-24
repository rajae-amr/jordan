import Pusher from 'pusher';

if (!process.env.PUSHER_APP_ID) {
  throw new Error('PUSHER_APP_ID is required');
}

if (!process.env.PUSHER_APP_KEY) {
  throw new Error('PUSHER_APP_KEY is required');
}

if (!process.env.PUSHER_APP_SECRET) {
  throw new Error('PUSHER_APP_SECRET is required');
}

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_CLUSTER || 'eu',
  useTLS: true,
});

export default pusher;