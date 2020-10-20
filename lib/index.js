"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var ramda_1 = require("ramda");
var newline_1 = __importDefault(require("newline"));
var args = require('parse-cmd-args')();
var saveParsedCSVToFile = function (data) {
    var buf = Buffer.from(JSON.stringify(data));
    fs_1.writeFileSync(path_1.resolve(process.cwd(), args.input.split('.')[0] + "-parsed.json"), buf);
};
var parseWithSubObjects = function (rows, columns) {
    return rows.reduce(function (prev, curr, i) {
        if (i === 0)
            return prev;
        var newArr = __spreadArrays(prev);
        newArr.push(curr.split(';').reduce(function (prev, curr, j) {
            var _a, _b;
            var newObj = __assign({}, prev);
            var currFixedValForNumber = curr.replace(',', '.');
            var splitColumn = columns[j].split('_');
            if (splitColumn.length > 1) {
                newObj[splitColumn[0]] = newObj[splitColumn[0]]
                    ? __assign(__assign({}, newObj[splitColumn[0]]), (_a = {}, _a[splitColumn[1]] = currFixedValForNumber, _a)) : (_b = {}, _b[splitColumn[1]] = currFixedValForNumber, _b);
            }
            else {
                newObj[columns[j]] = currFixedValForNumber;
            }
            return newObj;
        }, {}));
        return newArr;
    }, []);
};
var parseRegularly = function (rows, columns) {
    return rows.reduce(function (prev, currRow, i) {
        if (i === 0)
            return prev;
        var newArr = __spreadArrays(prev);
        newArr.push(currRow.split(';').reduce(function (prev, currColumn, i) {
            var newObj = __assign({}, prev);
            var currFixedValForNumber = currColumn.replace(',', '.');
            newObj[columns[i]] = currFixedValForNumber;
            return newObj;
        }, {}));
        return newArr;
    }, []);
};
var csvParser = function () {
    var buf = fs_1.readFileSync(path_1.resolve(process.cwd(), "" + args.input));
    var file = buf.toString('utf-8');
    var parsedLines = newline_1.default.set(file, 'LF');
    var rows = parsedLines.split('\n');
    var columns = rows[0].split(';');
    if (args.flags['--sub-objects'])
        ramda_1.compose(saveParsedCSVToFile, parseWithSubObjects)(rows, columns);
    else
        ramda_1.compose(saveParsedCSVToFile, parseRegularly)(rows, columns);
};
exports.default = csvParser;
