"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var body_parser_1 = __importDefault(require("body-parser"));
var morgan_1 = __importDefault(require("morgan"));
var compression_1 = __importDefault(require("compression"));
// Custom routes
var routes_1 = __importDefault(require("./routes"));
// Define app
var app = express_1["default"]();
// Middleware
app.use(morgan_1["default"]('dev'));
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: false }));
app.use(body_parser_1["default"].urlencoded({ extended: true }));
app.use(cookie_parser_1["default"]());
// Set headers
app.use(function (req, res, next) {
    // Cors
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    // Nocache
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});
app.use(compression_1["default"]());
// Serve
app.use('/api', routes_1["default"]);
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("HTTP server running on port: " + port);
});