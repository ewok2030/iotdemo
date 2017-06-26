import { Client } from 'azure-event-hubs';

export default function (io, config) {
  io.on('connection', (socket) => {
    // create Event Hub client to listen to messages
    let eventHubClient = null;
    socket.on('action', (action) => {
      switch (action.type) {
        case ('server/OPEN_CONNECTION'): {
          eventHubClient = Client.fromConnectionString(config.messageEndpoint, config.messageNamespace);
          // Connect to even hub and start listening
          eventHubClient.open()
            .then(() => eventHubClient.createReceiver(config.consumerGroup, '1', { startAfterTime: Date.now() }))
            .then((rx) => {
              // rx.on('errorReceived', (err) => { console.log(err); });
              socket.emit('action', { type: 'client/CONNECTION_OPEN' });
              rx.on('message', (message) => {
                socket.emit('action', { type: 'client/NEW_MESSAGE', data: { message: message.body } });
              });
            });
          break;
        }
        case ('server/CLOSE_CONNECTION'): {
          if (eventHubClient != null) {
            eventHubClient.close();
          }
          socket.emit('action', { type: 'client/CONNECTION_CLOSED' });
          break;
        }
        default:
          break;
      }
    });

    socket.on('disconnect', () => {
      if (eventHubClient != null) {
        eventHubClient.close();
      }
      socket.emit('action', { type: 'server/CONNECTION_CLOSED' });
    });
  });
}
