if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    var mapped = [];

    for (var i = 0; i < this.length; i++) {
      mapped.push(callback.call(thisArg, this[i], i, this));
    }
    return mapped;
  };
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

(function(host) {

  var matchers = {
    browser: [
      [/msie ([\.\_\d]+)/, "ie"],
      [/trident\/.*?rv:([\.\_\d]+)/, "ie"],
      [/firefox\/([\.\_\d]+)/, "firefox"],
      [/chrome\/([\.\_\d]+)/, "chrome"],
      [/version\/([\.\_\d]+).*?safari/, "safari"],
      [/mobile safari ([\.\_\d]+)/, "safari"]
    ],
    os: [
      [/windows nt ([\.\_\d]+)/, "windows"],
      [/linux ()([a-z\.\_\d]+)/, "linux"],
      [/mac os.*?([\.\_\d]+)/, "macos"],
      [/os ([\.\_\d]+) like mac os/, "ios"],
      [/openbsd ()([a-z\.\_\d]+)/, "openbsd"]
    ],
    device: [
      [/ipad/, "ipad"],
      [/iphone/, "iphone"]
    ]
  };

  function Sniffr() {
    this.browser = getDefaultProperty();
    this.os = getDefaultProperty();
    this.device = getDefaultProperty();
  }

  function getDefaultProperty() {
    return {
      name: "Unknown",
      version: [],
      versionString: "Unknown"
    };
  }

  function determineProperty(self, propertyName, userAgent) {
    matchers[propertyName].forEach(function(propertyMatcher) {
      var propertyRegex = propertyMatcher[0];
      var propertyValue = propertyMatcher[1];

      var match = userAgent.match(propertyRegex);

      if (match) {
        self[propertyName].name = propertyValue;

        if (match[2]) {
          self[propertyName].versionString = match[2];
          self[propertyName].version = [];
        } else if (match[1]) {
          self[propertyName].versionString = match[1].replace(/_/g, ".");
          self[propertyName].version = parseVersion(match[1]);
        }
      }
    });
  }

  function parseVersion(versionString) {
    return versionString.split(/[\._]/).map(function(versionPart) {
      return parseInt(versionPart);
    });
  }

  Sniffr.prototype.sniff = function(userAgentString) {
    var self = this;
    var userAgent = (userAgentString || navigator.userAgent || "").toLowerCase();

    ["os", "browser", "device"].forEach(function(propertyName) {
      determineProperty(self, propertyName, userAgent);
    });
  };

  Sniffr.prototype.getBrowser = function() {
    return this.browser;
  };

  Sniffr.prototype.getOS = function() {
    return this.os;
  };

  Sniffr.prototype.getDevice = function() {
    return this.device;
  };

  host.Sniffr = Sniffr;
})(this);