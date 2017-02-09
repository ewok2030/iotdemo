const config = {
  eventHub: 'HostName=<host>;SharedAccessKeyName=<keyName>;SharedAccessKey=<key>',
  partition: '$Default',
  reduxAction: 'iotdemo/device/NEW_MESSAGE',
  port: process.env.PORT || 3000,
};

export default config;
