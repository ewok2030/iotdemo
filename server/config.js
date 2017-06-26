const config = {
  hub: '<iothub-host>',
  messageEndpoint: '<eventhub-endpoint>',
  messageNamespace: '<iothub-name>',
  consumerGroup: '<eventhub-consumer-group>',
  documentdbHost: '<documentdb-url>',
  documentdbCollectionUri: '<documentdb-collection-uri>',
  documentdbKey: '<documentdb-key>',
  port: process.env.PORT || 3000,
};
export default config;
