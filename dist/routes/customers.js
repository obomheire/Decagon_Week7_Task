"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var jwt = require('jsonwebtoken');
var modules_1 = require("./modules");
var router = express_1.default.Router();
var key = [];
router.get('/', function (req, res, next) {
    if (key.length === 0)
        res.render('login');
    else {
        var data = (0, modules_1.readDbData)();
        res.render('index_customers', {
            title: 'CUSTOMER RELASHIONSHIP MANAGEMENT SYSTEM',
            customers: data
        });
    }
});
router.get('/login', function (req, res, next) {
    res.render('login');
    key.pop();
});
router.post('/login', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userRecord, _a, username, password, result, loginUser, validatePassword, data;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userRecord = (0, modules_1.readDbUser)();
                _a = req.body, username = _a.username, password = _a.password;
                result = (0, modules_1.joiShemaLog)().validate({ username: username, password: password });
                if (!result.error) return [3 /*break*/, 1];
                res.render('error', {
                    error: result.error.details[0].message
                });
                return [3 /*break*/, 3];
            case 1:
                loginUser = userRecord.find(function (value) { return value.username === username; });
                if (!loginUser) return [3 /*break*/, 3];
                return [4 /*yield*/, bcrypt_1.default.compare(password, loginUser.password)];
            case 2:
                validatePassword = _b.sent();
                if (!validatePassword)
                    res.render('incorrect_login');
                else {
                    (0, modules_1.createToken)(username, res);
                    data = (0, modules_1.readDbData)();
                    res.render('index_customers', {
                        title: 'CUSTOMER RELASHIONSHIP MANAGEMENT SYSTEM',
                        customers: data
                    });
                    key.push(1);
                }
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
router.post('/register', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userRecord, _a, username, email, password1, password2, result, salt, hashed, user, regData;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userRecord = (0, modules_1.readDbUser)();
                _a = req.body, username = _a.username, email = _a.email, password1 = _a.password1, password2 = _a.password2;
                result = (0, modules_1.joiShemaReg)().validate({ username: username, email: email, password: password1, repeat_password: password2 });
                if (!result.error) return [3 /*break*/, 1];
                res.render('error', {
                    error: result.error.details[0].message
                });
                return [3 /*break*/, 4];
            case 1: return [4 /*yield*/, bcrypt_1.default.genSalt(10)];
            case 2:
                salt = _b.sent();
                return [4 /*yield*/, bcrypt_1.default.hash(password1, salt)];
            case 3:
                hashed = _b.sent();
                user = {
                    id: Date.now().toString(),
                    username: username,
                    email: email,
                    password: hashed
                };
                regData = userRecord.find(function (value) { return value.username === username || value.email === email; });
                if (!regData) {
                    userRecord.push(user);
                    (0, modules_1.writeUser)(userRecord);
                    res.redirect('/login');
                }
                else
                    res.render('user_exist');
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
router.get('/add', modules_1.authenticateToken, function (req, res, next) {
    res.render('add_customer', {
        title: 'CUSTOMER RELASHIONSHIP MANAGEMENT SYSTEM'
    });
});
router.post('/save', function (req, res, next) {
    var data = (0, modules_1.readDbData)();
    var _a = req.body, fullname = _a.fullname, email = _a.email, gender = _a.gender, phone = _a.phone, address = _a.address, notes = _a.notes;
    var customer = {
        customerid: parseInt(Date.now().toString()),
        fullname: fullname,
        email: email,
        gender: gender,
        phone: phone,
        address: address,
        notes: notes
    };
    data.push(customer);
    (0, modules_1.writeData)(data);
    res.status(201);
    res.redirect('/');
    key.push(1);
});
router.get('/edit/:id', modules_1.authenticateToken, function (req, res, next) {
    var data = (0, modules_1.readDbData)();
    var customerData = data.find(function (value) { return value.customerid === parseInt(req.params.id); });
    res.render('update_customer', {
        title: 'CUSTOMER RELASHIONSHIP MANAGEMENT SYSTEM',
        customer: customerData
    });
});
router.post('/update', function (req, res, next) {
    var data = (0, modules_1.readDbData)();
    var customer = data.find(function (value) { return value.customerid === parseInt(req.body.id); });
    if (!customer)
        return res.status(404).send("Customer not found!");
    var _a = req.body, fullname = _a.fullname, email = _a.email, gender = _a.gender, phone = _a.phone, address = _a.address, notes = _a.notes;
    customer.fullname = fullname ? fullname : customer.fullname,
        customer.email = email ? email : customer.email,
        customer.gender = gender ? gender : customer.gender,
        customer.phone = phone ? phone : customer.phone,
        customer.address = address ? address : customer.addres,
        customer.notes = notes ? notes : customer.notes;
    (0, modules_1.writeData)(data);
    res.status(202);
    res.redirect('/');
    key.push(1);
});
router.get('/delete/:id', modules_1.authenticateToken, function (req, res, next) {
    var data = (0, modules_1.readDbData)();
    var customer = data.find(function (value) { return value.customerid === parseInt(req.params.id); });
    console.log(typeof req.params.id);
    if (!customer)
        return res.status(404).send('Customer not found!');
    var index = data.indexOf(customer);
    data.splice(index, 1);
    (0, modules_1.writeData)(data);
    res.status(200);
    res.redirect('/');
    key.push(1);
});
exports.default = router;
