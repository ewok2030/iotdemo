import React from 'react';

export default class DashboardMetric extends React.Component {
  static propTypes = {
    icon: React.PropTypes.element,
    main: React.PropTypes.string.isRequired,
    sub: React.PropTypes.string.isRequired,
    backgroundStyle: React.PropTypes.string,
  }

  static defaultProps = {
    icon: null,
    backgroundStyle: 'bg-default',
  }

  render() {
    const style = { padding: '5px', textAlign: 'center' };
    return (
      <div className={this.props.backgroundStyle} style={style}>
        <div>{this.props.icon}</div>
        <h2>{this.props.main}</h2>
        <p className="text-muted">{this.props.sub}</p>
      </div>
    );
  }
}
