"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var path = require('path');

var fs = require('fs');

var removeQueryString = function removeQueryString(filePath) {
  return filePath.replace(/\?.+/, '');
};

var ResolveReplacementPlugin =
/*#__PURE__*/
function () {
  function ResolveReplacementPlugin(options) {
    (0, _classCallCheck2.default)(this, ResolveReplacementPlugin);
    this.sourceDirectory = options.sourceDirectory;
    this.targetDirectory = options.targetDirectory;
    this.sourceRootPath = null;
  }

  (0, _createClass2.default)(ResolveReplacementPlugin, [{
    key: "getTargetFilePath",
    value: function () {
      var _getTargetFilePath = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(sourceFilePath, targetDirectoryPath) {
        var relativetargetFilePath, targetFilePath, targetFileExists;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                relativetargetFilePath = sourceFilePath.replace(this.sourceRootPath, '');
                targetFilePath = `${targetDirectoryPath}${relativetargetFilePath}`;
                _context.next = 4;
                return fs.existsSync(removeQueryString(targetFilePath));

              case 4:
                targetFileExists = _context.sent;

                if (!targetFileExists) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt("return", targetFilePath);

              case 9:
                throw new Error(`Target file not found: ${targetDirectoryPath}`);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getTargetFilePath(_x, _x2) {
        return _getTargetFilePath.apply(this, arguments);
      }

      return getTargetFilePath;
    }()
  }, {
    key: "getTargetDirectoryPath",
    value: function () {
      var _getTargetDirectoryPath = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(sourceFilePath) {
        var sourceDirectoryPath, targetDirectoryPath, targetDirectoryExists;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                sourceDirectoryPath = path.resolve(sourceFilePath, '..');
                targetDirectoryPath = `${sourceDirectoryPath}/${this.targetDirectory}`;
                _context2.next = 4;
                return fs.existsSync(targetDirectoryPath);

              case 4:
                targetDirectoryExists = _context2.sent;

                if (!targetDirectoryExists) {
                  _context2.next = 8;
                  break;
                }

                this.sourceRootPath = sourceDirectoryPath;
                return _context2.abrupt("return", targetDirectoryPath);

              case 8:
                if (!(sourceDirectoryPath === this.sourceDirectory)) {
                  _context2.next = 10;
                  break;
                }

                throw new Error(`Target directory not found: ${targetDirectoryPath}`);

              case 10:
                _context2.next = 12;
                return this.getTargetDirectoryPath(sourceDirectoryPath);

              case 12:
                return _context2.abrupt("return", _context2.sent);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getTargetDirectoryPath(_x3) {
        return _getTargetDirectoryPath.apply(this, arguments);
      }

      return getTargetDirectoryPath;
    }()
  }, {
    key: "apply",
    value: function apply(resolver) {
      var _this = this;

      resolver.hooks.resolve.tapAsync("ResolveReplacementPlugin",
      /*#__PURE__*/
      function () {
        var _ref = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee3(resolveData, resolveContext, callback) {
          var sourceFilePath, targetDirectoryPath, targetFilePath, updatedResolve;
          return _regenerator.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  sourceFilePath = path.resolve(resolveData.path, resolveData.request);

                  if (!sourceFilePath.includes(_this.sourceDirectory)) {
                    _context3.next = 18;
                    break;
                  }

                  _context3.prev = 2;
                  _context3.next = 5;
                  return _this.getTargetDirectoryPath(sourceFilePath);

                case 5:
                  targetDirectoryPath = _context3.sent;
                  _context3.next = 8;
                  return _this.getTargetFilePath(sourceFilePath, targetDirectoryPath);

                case 8:
                  targetFilePath = _context3.sent;
                  updatedResolve = (0, _objectSpread2.default)({}, resolveData, {
                    request: targetFilePath
                  });
                  resolver.doResolve(resolver.hooks.resolve, updatedResolve, null, resolveContext, callback);
                  _context3.next = 16;
                  break;

                case 13:
                  _context3.prev = 13;
                  _context3.t0 = _context3["catch"](2);
                  callback();

                case 16:
                  _context3.next = 19;
                  break;

                case 18:
                  callback();

                case 19:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3, null, [[2, 13]]);
        }));

        return function (_x4, _x5, _x6) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }]);
  return ResolveReplacementPlugin;
}();

var _default = ResolveReplacementPlugin;
exports.default = _default;
module.exports = exports.default;