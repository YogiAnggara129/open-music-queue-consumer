require('dotenv').config();
const amqp = require('amqplib');

const PlaylistSongsService = require('./services/PlaylistSongsService');
const MailSenderService = require('./services/MailSenderService');
const Listener = require('./listener');

const init = async () => {
  const playlistSongsService = new PlaylistSongsService();
  const mailSenderService = new MailSenderService();
  const listener = new Listener(playlistSongsService, mailSenderService);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlists', {
    durable: true,
  });
  channel.consume('export:playlists', listener.listen, { noAck: true });
};
init();
