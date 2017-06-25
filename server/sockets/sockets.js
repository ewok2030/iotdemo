import { Client } from 'azure-event-hubs';

export default function (io, config) {
  io.on('connection', (socket) => {
    socket.emit('action', { type: 'server/CONNECTION_OPEN' });
    // Setup Event hub listener
    const eventHubClient = Client.fromConnectionString(config.messageEndpoint, 'sandboxatlas');

    eventHubClient.open()
      .then(() => eventHubClient.createReceiver(config.consumerGroup, '1', { startAfterTime: Date.now() }))
      .then((rx) => {
        // rx.on('errorReceived', (err) => { console.log(err); });
        rx.on('message', (message) => {
          socket.emit('action', { type: 'server/NEW_MESSAGE', data: { message: message.body } });
        });
      });

    socket.on('disconnect', () => {
      socket.emit('action', { type: 'server/CONNECTION_CLOSED' });
      eventHubClient.close();
    });
  });
}
