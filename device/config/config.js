const config = {
  connectionString: 'HostName=<host>;DeviceId=<deviceId>;SharedAccessKey=<deviceKey>;',
  sensor: {
    type: 22,
    gpio: 16,
  },
  led: {
    gpio: 19,
    flashLength: 100,
  },
  message: {
    interval: {
      min: 1000,
      max: 3600000,
    },
  },
  fileupload: {
    counter: {
      min: 1,
      max: 1000,
    },
  },
};

export default config;
