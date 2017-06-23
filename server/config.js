const config = {
  hub: '<endpoint>',
  consumerGroup: '$Default',
  actionType: 'iotdemo/device/NEW_MESSAGE',
  port: process.env.PORT || 3000,
};

export default config;
