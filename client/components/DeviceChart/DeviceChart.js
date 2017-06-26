import React from 'react';
import ReactHighcharts from 'react-highcharts';


export default class DeviceChart extends React.Component {
  static propTypes = {
    messages: React.PropTypes.array.isRequired,
  }

  render() {
    const config = {
      title: { text: '' },
      xAxis: { type: 'datetime' },
      yAxis: [{ title: { text: 'Temperature' }, opposite: false }, { title: { text: 'Humidity' }, opposite: false }],
      series: [{
        name: 'Temperature',
        marker: { enabled: true, radius: 4 },
        data: this.props.messages.map(x => [new Date(x.sourceTimestamp).getTime(), x.temperature]),
        tooltip: {
          valueDecimals: 2,
          valueSuffix: ' C',
        },
        animation: false,
        yAxis: 0,
      },
      {
        name: 'Humidity',
        marker: { enabled: true, radius: 4 },
        data: this.props.messages.map(x => [new Date(x.sourceTimestamp).getTime(), x.humidity]),
        tooltip: {
          valueDecimals: 2,
          valueSuffix: ' %',
        },
        animation: false,
        yAxis: 1,
      }],
      rangeSelector: { enabled: false },
    };
    return (
      <div>
        <ReactHighcharts config={config} />
      </div>
    );
  }
}
