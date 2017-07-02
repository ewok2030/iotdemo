const config = {
  hub: process.env.IOTHUB_HOST || '<iothub-host>',
  messageEndpoint: process.env.MESSAGE_ENDPOINT || '<eventhub-endpoint>',
  messageNamespace: process.env.MESSAGE_NAMESPACE || '<iothub-name>',
  messageConsumerGroup: process.env.MESSAGE_CONSUMERGROUP || '<eventhub-consumer-group>',
  documentdbHost: process.env.DOCUMENTDB_HOST || '<documentdb-url>',
  documentdbCollectionUri: process.env.DOCUMENTDB_COLLECTION_URI || '<documentdb-collection-uri>',
  documentdbKey: process.env.DOCUMENTDB_KEY || '<documentdb-key>',
  port: process.env.PORT || 3000,
};
export default config;
