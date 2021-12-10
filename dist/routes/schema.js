"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeUser = exports.writeData = exports.readDbUser = exports.readDbData = exports.createToken = exports.authenticateToken = exports.joiShemaLog = exports.joiShemaReg = void 0;
var joi_1 = __importDefault(require("joi"));
var fs_1 = __importStar(require("fs"));
var jwt = require('jsonwebtoken');
var path_1 = __importDefault(require("path"));
var dbpath = path_1.default.resolve('src/database.json');
var dbpath2 = path_1.default.resolve('src/user.json');
var joiShemaReg = function () {
    var schema = joi_1.default.object({
        username: joi_1.default.string().min(3).max(45).required(),
        email: joi_1.default.string().min(5).max(45).email().required(),
        password: joi_1.default.string().min(5).max(45).required(),
        repeat_password: joi_1.default.ref('password')
    });
    return schema;
};
exports.joiShemaReg = joiShemaReg;
var joiShemaLog = function () {
    var schema = joi_1.default.object({
        username: joi_1.default.string().min(3).max(45).required(),
        password: joi_1.default.string().min(5).max(45).required(),
    });
    return schema;
};
exports.joiShemaLog = joiShemaLog;
var authenticateToken = function (req, res, next) {
    var token = req.cookies.jwtToken;
    if (!token)
        return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (error, user) {
        if (error)
            return res.sendStatus(403);
        req.user = user;
        // console.log(req.user)
        next();
    });
};
exports.authenticateToken = authenticateToken;
var createToken = function (username, res) {
    var user = { user_name: username };
    //require('crypto').randomBytes(64).toString('hex')
    var accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.cookie('jwtToken', accessToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 1000 // 1 day
    });
};
exports.createToken = createToken;
var readDbData = function () {
    var data = JSON.parse((0, fs_1.readFileSync)(dbpath, { encoding: 'utf-8' }));
    return data;
};
exports.readDbData = readDbData;
var readDbUser = function () {
    var userRecord = JSON.parse((0, fs_1.readFileSync)(dbpath2, { encoding: 'utf8' }));
    return userRecord;
};
exports.readDbUser = readDbUser;
var writeData = function (file) {
    return fs_1.default.writeFileSync(dbpath, JSON.stringify(file, null, 4));
};
exports.writeData = writeData;
var writeUser = function (record) {
    return fs_1.default.writeFileSync(dbpath2, JSON.stringify(record, null, 4));
};
exports.writeUser = writeUser;
