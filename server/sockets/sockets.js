import { Client } from 'azure-event-hubs';

export default function (io, config) {
  io.on('connection', (socket) => {
    // Setup Event hub listener
    const eventHubClient = Client.fromConnectionString(config.hub, 'sandboxatlas');

    eventHubClient.open()
      .then(() => eventHubClient.createReceiver(config.consumerGroup, '1', { startAfterTime: Date.now() }))
      .then((rx) => {
        // rx.on('errorReceived', (err) => { console.log(err); });
        rx.on('message', (message) => {
          // console.log(`message received: ${JSON.stringify(message.body)}`);
          socket.emit('action', { type: config.actionType, data: { message: message.body } });
        });
      });
  });
}
