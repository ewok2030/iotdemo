import React from 'react';
import ReactHighcharts from 'react-highcharts';


export default class DeviceChart extends React.Component {
  static propTypes = {
    messages: React.PropTypes.array.isRequired,
    tempInputUnits: React.PropTypes.string.isRequired,
    tempDisplayUnits: React.PropTypes.string.isRequired,
  }

  render() {
    // temperature
    let temp = this.props.messages.map(x => [new Date(x.sourceTimestamp).getTime(), x.temperature]);
    if (this.props.tempInputUnits.toLowerCase() !== this.props.tempDisplayUnits.toLowerCase()) {
      if (this.props.tempDisplayUnits.toLowerCase() === 'f') {
        temp = this.props.messages.map(x => [new Date(x.sourceTimestamp).getTime(), (x.temperature * (9 / 5)) + 32]);
      } else {
        temp = this.props.messages.map(x => [new Date(x.sourceTimestamp).getTime(), (x.temperature + 32) + (5 / 9)]);
      }
    }

    // humidity
    const humid = this.props.messages.map(x => [new Date(x.sourceTimestamp).getTime(), x.humidity]);

    const config = {
      title: { text: '' },
      xAxis: { type: 'datetime' },
      yAxis: [{ title: { text: 'Temperature' }, opposite: false }, { title: { text: 'Humidity' }, opposite: false }],
      series: [{
        name: 'Temperature',
        marker: { enabled: true, radius: 4 },
        data: temp,
        tooltip: {
          valueDecimals: 2,
          valueSuffix: ` ${this.props.tempDisplayUnits.toUpperCase()}`,
        },
        animation: false,
        yAxis: 0,
      },
      {
        name: 'Humidity',
        marker: { enabled: true, radius: 4 },
        data: humid,
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
