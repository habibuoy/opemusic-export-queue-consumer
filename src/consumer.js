/* eslint-disable wrap-iife */
/* eslint-disable func-names */

require('dotenv').config();
const amqp = require('amqplib');
const PlaylistService = require('./PlaylistService');
const MailSender = require('./MailSender');
const Listener = require('./Listener');

const exportQueue = 'export:playlists';

(async function () {
  const playlistService = new PlaylistService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistService, mailSender);

  const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue(exportQueue, {
    durable: true,
  });

  channel.consume(exportQueue, listener.listen, {
    noAck: true,
  });
})();
