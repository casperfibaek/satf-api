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
exports.__esModule = true;
exports.validatePermissionLevel = void 0;
/*
  This script tries to read the token from the header of the request.
  If the token header is found in the in-ram database it is forwarded.

  The token needs the signature: "username:token"
  */
var pg_1 = __importDefault(require("pg"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var credentials_1 = __importDefault(require("./credentials"));
var pool = new pg_1["default"].Pool(credentials_1["default"]);
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var urlPath, funcLevel, satf_token, _a, userId, token, decodedToken, isTokenValidated, validatedFunctionPermissions, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    urlPath = req.url.split('/')[1].split('?')[0];
                    if (urlPath === undefined || urlPath === '') {
                        res.status(401).json({
                            status: 'Error',
                            message: 'Unable to read URL'
                        });
                    }
                    funcLevel = getFunctionLevel(urlPath);
                    if (funcLevel === 0) {
                        //'authorization not needed, authorization passed';
                        return [2 /*return*/, next()];
                    }
                    else if (funcLevel === -1) {
                        res.status(401).json({
                            status: 'Error',
                            message: 'Unable to find function'
                        });
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    satf_token = req.headers.authorization;
                    _a = satf_token.split(':'), userId = _a[0], token = _a[1];
                    decodedToken = jsonwebtoken_1["default"].verify(token, credentials_1["default"].admin_key);
                    console.log('decodedToken:', decodedToken);
                    isTokenValidated = userId === decodedToken.userId;
                    return [4 /*yield*/, validatePermissionLevel(satf_token, urlPath)];
                case 2:
                    validatedFunctionPermissions = _c.sent();
                    // console.log('satf_token:', satf_token);
                    // console.log('funcName:', funcName);
                    // console.log(validatedToken, validatedFunctionPermissions);
                    if (isTokenValidated && validatedFunctionPermissions) {
                        return [2 /*return*/, next()];
                    }
                    else {
                        res.status(401).json({
                            status: 'Error',
                            message: 'User Unauthorised.'
                        });
                    }
                    return [3 /*break*/, 4];
                case 3:
                    _b = _c.sent();
                    res.status(401).json({
                        status: 'Error',
                        message: 'User unauthorised or unable to read token.'
                    });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports["default"] = auth;
var getFunctionLevel = function (functionName) {
    var functionLookup = {
        api_version: 0,
        latlng_to_what3words: 0,
        what3words_to_latlng: 0,
        latlng_to_pluscode: 0,
        pluscode_to_latlng: 0,
        population_density_walk: 0,
        population_density_bike: 0,
        population_density_car: 0,
        pop_density_isochrone_walk: 1,
        pop_density_isochrone_bike: 1,
        pop_density_isochrone_car: 1,
        isochrone_walk: 1,
        isochrone_bike: 1,
        isochrone_car: 1,
        nightlights: 1,
        demography: 1,
        population_density_buffer: 0,
        population_buffer: 1,
        urban_status: 0,
        urban_status_simple: 0,
        admin_level_1: 0,
        admin_level_2: 0,
        admin_level_2_fuzzy_tri: 0,
        admin_level_2_fuzzy_lev: 0,
        nearest_placename: 0,
        nearest_poi: 0,
        nearest_poi_location: 1,
        nearest_bank: 0,
        nearest_bank_distance: 0,
        nearest_bank_location: 1,
        nearest_waterbody: 0,
        nearest_waterbody_location: 1,
        get_banks: 1,
        a_to_b_time_distance_walk: 1,
        a_to_b_time_distance_bike: 1,
        a_to_b_time_distance_car: 1,
        network_coverage: 1,
        oci_coverage: 1,
        mce_coverage: 1,
        get_forecast: 1,
        get_api_isochrone: 1,
        get_api_directions: 1,
        login_user_get: 0,
        login_user: 0,
        create_user: 2,
        delete_user: 2,
        // error_log: 0,
        NDVI_monthly: 1,
        avg_NDVI: 1,
        vegetation_monitoring: 1,
        get_user_layer_metadata: 1,
        get_layer_geoms: 1,
        delete_layer: 1,
        update_layer_data: 1,
        create_layer: 1
    };
    if (!(functionName in functionLookup)) {
        return -1;
    }
    return functionLookup[functionName];
};
var getUserLevel = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userName, _, dbQuery, dbResponse, level, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('getUserLevel:', token);
                _a = token.split(':'), userName = _a[0], _ = _a[1];
                if (userName === 'guest_satf') {
                    return [2 /*return*/, 0];
                }
                dbQuery = "SELECT level FROM organizations org\n         LEFT JOIN users u ON org.org_name=u.org\n         WHERE username = '".concat(userName, "'");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, pool.query(dbQuery)];
            case 2:
                dbResponse = _b.sent();
                level = dbResponse.rows[0].level;
                // console.log('level:', level)
                return [2 /*return*/, level];
            case 3:
                err_1 = _b.sent();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
function validatePermissionLevel(token, functionName) {
    return __awaiter(this, void 0, void 0, function () {
        var userLevel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getUserLevel(token)];
                case 1:
                    userLevel = _a.sent();
                    if (userLevel >= getFunctionLevel(functionName)) {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
            }
        });
    });
}
exports.validatePermissionLevel = validatePermissionLevel;
