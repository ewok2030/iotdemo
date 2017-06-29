const config = {
  connectionString: 'HostName=<host>;DeviceId=<deviceId>;SharedAccessKey=<deviceKey>;',
  sensor: {
    type: 22,
    gpio: 16
  },
  led: {
    gpio: 19,
    flashLength: 100
  },
  message: {
    interval: {
      min: 1000,
      max: 3600000
    }
  },
  fileupload: {
    interval: {
      min: 1000,
      max: 86400000
    }
  }
};

export default config;