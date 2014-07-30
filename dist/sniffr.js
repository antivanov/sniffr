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

if (!Object.keys) {
  Object.keys = function(obj) {
    var ownKeys = [];

    for (var propertyName in obj) {
      if (obj.hasOwnProperty(propertyName)) {
        ownKeys.push(propertyName);
      }
    }
    return ownKeys;
  };
}
(function(host) {

  var properties = {
    browser: [
      [/msie ([\.\_\d]+)/, "ie"],
      [/trident\/.*?rv:([\.\_\d]+)/, "ie"],
      [/firefox\/([\.\_\d]+)/, "firefox"],
      [/chrome\/([\.\_\d]+)/, "chrome"],
      [/version\/([\.\_\d]+).*?safari/, "safari"],
      [/mobile safari ([\.\_\d]+)/, "safari"],
      [/android.*?version\/([\.\_\d]+).*?safari/, "com.android.browser"],
      [/opera mini.*?version\/([\.\_\d]+)/, "opera.mini"],
      [/crios\/([\.\_\d]+).*?safari/, "chrome"]
    ],
    os: [
      [/windows nt ([\.\_\d]+)/, "windows"],
      [/linux ()([a-z\.\_\d]+)/, "linux"],
      [/mac os.*?([\.\_\d]+)/, "macos"],
      [/os ([\.\_\d]+) like mac os/, "ios"],
      [/openbsd ()([a-z\.\_\d]+)/, "openbsd"],
      [/android ([a-z\.\_\d]+);/, "android"],
      [/android/, "android"],
      [/mozilla\/[a-z\.\_\d]+ \((?:mobile)|(?:tablet)/, "firefoxos"],
      [/windows phone.*?([\.\_\d]+)/, "windows.phone"],
      [/windows mobile/, "windows.mobile"]
    ],
    device: [
      [/ipad/, "ipad"],
      [/iphone/, "iphone"],
      [/htc/, "htc"],
      [/nexus/, "nexus"],
      [/galaxy nexus/, "galaxy.nexus"],
      [/nokia/, "nokia"],
      [/ gt\-/, "galaxy"],
      [/ sm\-/, "galaxy"]
    ]
  };

  var propertyNames = Object.keys(properties);

  function Sniffr() {
    var self = this;

    propertyNames.forEach(function(propertyName) {
      self[propertyName] = {
        name: "Unknown",
        version: [],
        versionString: "Unknown"
      };
    });
  }

  function determineProperty(self, propertyName, userAgent) {
    properties[propertyName].forEach(function(propertyMatcher) {
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

  Sniffr.prototype._sniff = function(userAgentString) {
    var self = this;
    var userAgent = (userAgentString || navigator.userAgent || "").toLowerCase();

    propertyNames.forEach(function(propertyName) {
      determineProperty(self, propertyName, userAgent);
    });
  };

  host.Sniffr = new Sniffr();
  host.Sniffr._sniff(navigator.userAgent);
})(this);