var _ = require('underscore');
var React = require('react/addons');
var metrics = require('../utils/MetricsUtil');
var ContainerUtil = require('../utils/ContainerUtil');
var containerActions = require('../actions/ContainerActions');

var ContainerSettingsAdvanced = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  contextTypes: {
    router: React.PropTypes.func
  },

  getInitialState: function () {
    let [tty, openStdin] = ContainerUtil.mode(this.props.container) || [true, true];
    let [device, devicePath] =  ContainerUtil.device(this.props.container) || [false, ""];
    return {
      tty: tty,
      openStdin: openStdin,
      device: device,
      devicePath: devicePath
    };
  },

  handleSaveAdvancedOptions: function () {
    metrics.track('Saved Advanced Options');
    let tty = this.state.tty;
    let openStdin = this.state.openStdin;
    containerActions.update(this.props.container.Name, {Tty: tty, OpenStdin: openStdin});
  },

  handleChangeTty: function () {
    this.setState({
      tty: !this.state.tty
    });
  },

  handleChangeOpenStdin: function () {
    this.setState({
      openStdin: !this.state.openStdin
    });
  },

  handleSaveDeviceOptions: function () {
    metrics.track('Saved Device Options');
    let device = this.state.device;
    let devicePath = this.state.devicePath;
    var hostConfig = _.clone(this.props.container.HostConfig);
    hostConfig = _.extend(hostConfig, {Devices: {PathOnHost: devicePath, PathInContainer: devicePath, CgroupPermissions: "mrw"} });
    containerActions.update(this.props.container.Name, {HostConfig: hostConfig});
  },

  handleChangeDevice: function () {
    this.setState({
      device: !this.state.device
    });
  },

  handleChangeDevicePath: function (event) {
    let devicePath = event.target.value;
    this.setState({
      devicePath: devicePath
    });
  },

  render: function () {
    if (!this.props.container) {
      return false;
    }

    return (
      <div className="settings-panel">
        <div className="settings-section">
          <h3>Advanced Options</h3>
          <div className="checkboxes">
            <p><input type="checkbox" checked={this.state.tty} onChange={this.handleChangeTty}/>Allocate a TTY for this container</p>
            <p><input type="checkbox" checked={this.state.openStdin} onChange={this.handleChangeOpenStdin}/>Keep STDIN open even if not attached</p>
          </div>
          <a className="btn btn-action" disabled={this.props.container.State.Updating} onClick={this.handleSaveAdvancedOptions}>Save</a>
        </div>
        <div className="settings-section">
          <h3>Device Options</h3>
          <div className="checkboxes">
            <p><input type="checkbox" checked={this.state.device} onChange={this.handleChangeDevice}/>Run the below device in this container</p>
            <input type="text" className="key line" placeholder="/dev/ttyUSB0" defaultValue={this.state.devicePath} onChange={this.handleChangeDevicePath}></input>
          </div>
          <a className="btn btn-action" disabled={this.props.container.State.Updating} onClick={this.handleSaveDeviceOptions}>Save</a>
        </div>
      </div>
    );
  }
});

module.exports = ContainerSettingsAdvanced;
