var _ = require('underscore');
var $ = require('jquery');
var fs = require('fs');
var path = require('path');
var docker = require('../utils/DockerUtil');
var results;
var apiFile = path.join(__dirname, '../../repo/', 'api.json');

var ContainerUtil = {
  env: function (container) {
    if (!container || !container.Config || !container.Config.Env) {
      return [];
    }
    return _.map(container.Config.Env, env => {
      var i = env.indexOf('=');
      var splits = [env.slice(0, i), env.slice(i + 1)];
      return splits;
    });
  },

  // TODO: inject host here instead of requiring Docker
  ports: function (container) {
    if (!container || !container.NetworkSettings) {
      return {};
    }
    var res = {};
    var ip = docker.host;
    _.each(container.NetworkSettings.Ports, function (value, key) {
      var dockerPort = key.split('/')[0];
      var localUrl = null;
      var localUrlDisplay = null;
      if (value && value.length) {
        var port = value[0].HostPort;
        localUrl = 'http://' + ip + ':' + port;
        localUrlDisplay = ip + ':' + port;
      }
      res[dockerPort] = {
        url: localUrl,
        display: localUrlDisplay
      };
    });
    return res;
  },


  search: function (query) {
    if (localStorage.getItem('settings.localRepoEnabled') !== 'true') {
      results = $.get('https://registry.hub.docker.com/v1/search?q=' + query);
    } else {
      results = $.ajax({
        url: apiFile,
        cache: false,
        dataType: 'json',
        dataFilter: function (data, dataType) {
          try {
            var apiData = JSON.parse(data);
            return JSON.stringify(apiData.search[query]);
          } catch (err) {
            console.log("Error: %o", err);
            return _.map([]);
          }
        }
      });
    }
    return results;
  },

  getRecommended: function () {
    if (localStorage.getItem('settings.localRepoEnabled') !== 'true') {
      var results = $.ajax({
        url: 'https://kitematic.com/recommended.json',
        cache: false,
        dataType: 'json'
      });
    } else {
      results = $.ajax({
        url: apiFile,
        cache: false,
        dataType: 'json',
        dataFilter: function (data, dataType) {
          try {
            var apiData = JSON.parse(data);
            return JSON.stringify(apiData.landing);
          } catch (err) {
            console.log("Error: %o", err);
            return _.map([]);
          }
        }
      });
    }
    return results;
  },

  repoInfo: function (query) {
    if (localStorage.getItem('settings.localRepoEnabled') !== 'true') {
      results = $.get('https://registry.hub.docker.com/v1/repositories_info/' + query);
    } else {
      results = $.ajax({
        url: apiFile,
        cache: false,
        dataType: 'json',
        dataFilter: function (data, dataType) {
          try {
            var apiData = JSON.parse(data);
            return JSON.stringify(apiData.info[query]);
          } catch (err) {
            console.log("Error: %o", err);
            return _.map([]);
          }
        }
      });

    }
    return results;
  }

};

module.exports = ContainerUtil;
