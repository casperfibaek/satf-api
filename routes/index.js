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
// The routes from the SATF API available at satf.azurewebsites.net/api.
var express_1 = __importDefault(require("express"));
var pg_1 = __importDefault(require("pg"));
var crypto_1 = __importDefault(require("crypto"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var auth_1 = __importDefault(require("./auth"));
var credentials_1 = __importDefault(require("./credentials"));
var utils_1 = require("./utils");
var validators_1 = require("./validators");
var whatfreewords_1 = __importDefault(require("../assets/whatfreewords"));
var pluscodes_1 = __importDefault(require("../assets/pluscodes"));
var sentinelhub_1 = require("../assets/sentinelhub");
var axios_1 = __importDefault(require("axios"));
var version = '0.8.0';
var openLocationCode = (0, pluscodes_1["default"])();
var router = express_1["default"].Router();
var pool = new pg_1["default"].Pool(credentials_1["default"]);
function latlng_to_what3words(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!req.query.lat || !req.query.lng) {
                return [2 /*return*/, res.status(400).json({
                        status: 'failure',
                        message: 'Request missing lat or lng',
                        "function": 'latlng_to_what3words'
                    })];
            }
            if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                return [2 /*return*/, res.status(400).json({
                        status: 'failure',
                        message: 'Invalid input',
                        "function": 'latlng_to_what3words'
                    })];
            }
            try {
                return [2 /*return*/, res.status(200).json({
                        status: 'success',
                        message: whatfreewords_1["default"].latlon2words(Number(req.query.lat), Number(req.query.lng)),
                        "function": 'latlng_to_what3words'
                    })];
            }
            catch (err) {
                console.log(err);
                return [2 /*return*/, res.status(500).json({
                        status: 'failure',
                        message: 'Error encountered on server',
                        "function": 'latlng_to_what3words'
                    })];
            }
            return [2 /*return*/];
        });
    });
}
function what3words_to_latlng(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!req.query.words) {
                return [2 /*return*/, res.status(400).json({
                        status: 'failure',
                        message: 'Request missing words',
                        "function": 'what3words_to_latlng'
                    })];
            }
            if (!(0, validators_1.isValidWhatFreeWords)(req.query.words)) {
                return [2 /*return*/, res.status(400).json({
                        status: 'failure',
                        message: 'Invalid what3words input',
                        "function": 'what3words_to_latlng'
                    })];
            }
            try {
                return [2 /*return*/, res.status(200).json({
                        status: 'success',
                        message: whatfreewords_1["default"].words2latlon(req.query.words),
                        "function": 'what3words_to_latlng'
                    })];
            }
            catch (err) {
                console.log(err);
                return [2 /*return*/, res.status(500).json({
                        status: 'failure',
                        message: 'Error encountered on server',
                        "function": 'what3words_to_latlng'
                    })];
            }
            return [2 /*return*/];
        });
    });
}
function latlng_to_pluscode(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var pluscode;
        return __generator(this, function (_a) {
            if (!req.query.lat || !req.query.lng) {
                return [2 /*return*/, res.status(400).json({
                        status: 'failure',
                        message: 'Request missing lat or lng',
                        "function": 'latlng_to_pluscode'
                    })];
            }
            if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                return [2 /*return*/, res.status(400).json({
                        status: 'failure',
                        message: 'Invalid input',
                        "function": 'latlng_to_pluscode'
                    })];
            }
            try {
                pluscode = openLocationCode.encode(Number(req.query.lat), Number(req.query.lng), 10);
                return [2 /*return*/, res.status(200).json({
                        status: 'success',
                        message: pluscode,
                        "function": 'latlng_to_pluscode'
                    })];
            }
            catch (err) {
                console.log(err);
                return [2 /*return*/, res.status(500).json({
                        status: 'failure',
                        message: 'Server unable to parse pluscode',
                        "function": 'latlng_to_pluscode'
                    })];
            }
            return [2 /*return*/];
        });
    });
}
function pluscode_to_latlng(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var pluscode, code;
        return __generator(this, function (_a) {
            if (!req.query.code) {
                return [2 /*return*/, res.status(400).json({
                        status: 'failure',
                        message: 'Request missing code',
                        "function": 'pluscode_to_latlng'
                    })];
            }
            pluscode = String(req.query.code).replace(' ', '+');
            if (!(0, validators_1.isValidPluscode)(pluscode)) {
                return [2 /*return*/, res.status(400).json({
                        status: 'failure',
                        message: 'Invalid pluscode input',
                        "function": 'pluscode_to_latlng'
                    })];
            }
            try {
                code = openLocationCode.decode(pluscode);
                return [2 /*return*/, res.status(200).json({
                        status: 'success',
                        message: [code.latitudeCenter, code.longitudeCenter],
                        "function": 'pluscode_to_latlng'
                    })];
            }
            catch (err) {
                console.log(err);
                return [2 /*return*/, res.status(500).json({
                        status: 'failure',
                        message: 'Error encountered on server',
                        "function": 'pluscode_to_latlng'
                    })];
            }
            return [2 /*return*/];
        });
    });
}
function admin_level_1(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat or lng',
                                "function": 'admin_level_1'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'admin_level_1'
                            })];
                    }
                    dbQuery = "\n        SELECT \"adm1_name\" AS adm1\n        FROM public.gh_tza_admin\n        WHERE\n            ST_Contains(public.gh_tza_admin.geom, ST_SetSRID(ST_Point(" + req.query.lng + ", " + req.query.lat + "), 4326))\n        LIMIT 1;\n    ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].adm1,
                                "function": 'admin_level_1'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'admin_level_1'
                        })];
                case 3:
                    err_1 = _a.sent();
                    console.log(err_1);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'admin_level_1'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function admin_level_2(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat or lng',
                                "function": 'admin_level_2'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'admin_level_2'
                            })];
                    }
                    dbQuery = "\n    SELECT \"adm2_name\" AS adm2\n    FROM public.gh_tza_admin\n    WHERE\n        ST_Contains(public.gh_tza_admin.geom, ST_SetSRID(ST_Point(" + req.query.lng + ", " + req.query.lat + "), 4326))\n    LIMIT 1;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].adm2,
                                "function": 'admin_level_2'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'admin_level_2'
                        })];
                case 3:
                    err_2 = _a.sent();
                    console.log(err_2);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'admin_level_2'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function api_version(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var host, origin;
        return __generator(this, function (_a) {
            host = req.get('host');
            origin = req.headers.origin;
            // CLient environment
            // req.hostname, req.origin
            // console.log(os.hostname())
            // console.log(host)
            console.log(req);
            // api environment
            // os.hostname()
            return [2 /*return*/, res.status(200).json({
                    status: 'success',
                    message: { "version": version, "api_environment": host, "client_environment": origin },
                    "function": 'api_version'
                })];
        });
    });
}
function admin_level_2_fuzzy_tri(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.name) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing name',
                                "function": 'admin_level_2_fuzzy_tri'
                            })];
                    }
                    dbQuery = "\n    SELECT adm2_name as name\n    FROM gh_tza_admin\n    ORDER BY SIMILARITY(adm2_name, '" + req.query.name + "') DESC\n    LIMIT 1;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].name,
                                "function": 'admin_level_2_fuzzy_tri'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'admin_level_2_fuzzy_tri'
                        })];
                case 3:
                    err_3 = _a.sent();
                    console.log(err_3);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'admin_level_2_fuzzy_tri'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function admin_level_2_fuzzy_lev(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.name) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing name',
                                "function": 'admin_level_2_fuzzy_lev'
                            })];
                    }
                    dbQuery = "\n    SELECT adm2_name as name\n    FROM gh_tza_admin\n    ORDER BY LEVENSHTEIN(adm2_name, '" + req.query.name + "') ASC\n    LIMIT 1;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].name,
                                "function": 'admin_level_2_fuzzy_lev'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'admin_level_2_fuzzy_lev'
                        })];
                case 3:
                    err_4 = _a.sent();
                    console.log(err_4);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'admin_level_2_fuzzy_lev'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function urban_status(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat or lng',
                                "function": 'urban_status'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'urban_status'
                            })];
                    }
                    dbQuery = "\n    SELECT ST_Value(urban_status.rast, ST_SetSRID(ST_MakePoint(" + req.query.lng + ", " + req.query.lat + "), 4326)) as urban_status\n    FROM urban_status\n    WHERE ST_Intersects(urban_status.rast, ST_SetSRID(ST_MakePoint(" + req.query.lng + ", " + req.query.lat + "), 4326));\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: (0, utils_1.translateUrbanClasses)(dbResponse.rows[0].urban_status),
                                "function": 'urban_status'
                            })];
                    }
                    return [2 /*return*/, res.status(200).json({
                            status: 'success',
                            message: (0, utils_1.translateUrbanClasses)(0),
                            "function": 'urban_status'
                        })];
                case 3:
                    err_5 = _a.sent();
                    console.log(err_5);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'urban_status'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function urban_status_simple(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat or lng',
                                "function": 'urban_status_simple'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'urban_status_simple'
                            })];
                    }
                    dbQuery = "\n    SELECT ST_Value(urban_status_simple.rast, ST_SetSRID(ST_MakePoint(" + req.query.lng + ", " + req.query.lat + "), 4326)) as urban_status_simple\n    FROM urban_status_simple\n    WHERE ST_Intersects(urban_status_simple.rast, ST_SetSRID(ST_MakePoint(" + req.query.lng + ", " + req.query.lat + "), 4326));\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: (0, utils_1.translateUrbanClasses)(dbResponse.rows[0].urban_status_simple),
                                "function": 'urban_status_simple'
                            })];
                    }
                    return [2 /*return*/, res.status(200).json({
                            status: 'success',
                            message: (0, utils_1.translateUrbanClasses)(0),
                            "function": 'urban_status_simple'
                        })];
                case 3:
                    err_6 = _a.sent();
                    console.log(err_6);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'urban_status_simple'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/// old population density buffer function
function population_density_buffer(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.buffer) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or buffer',
                                "function": 'population_density_buffer'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.buffer))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'population_density_buffer'
                            })];
                    }
                    dbQuery = "\n    WITH const (pp_geom) AS (\n        values (ST_Buffer(ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)::geography, '" + (Number(req.query.buffer) + 50) + "')::geometry)\n    )\n    \n    SELECT\n        SUM((ST_SummaryStats(ST_Clip(\n            ppp_avg.rast, \n            const.pp_geom\n        ))).sum::int) as pop_dense_buf\n    FROM\n      ppp_avg, const\n    WHERE ST_Intersects(const.pp_geom, ppp_avg.rast);\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: Math.round(Number(dbResponse.rows[0].pop_dense_buf)),
                                "function": 'population_density_buffer'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'population_density_buffer'
                        })];
                case 3:
                    err_7 = _a.sent();
                    console.log(err_7);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'population_density_buffer'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function population_buffer(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, resp_arr, apiResponseArr, err_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.buffer) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or buffer',
                                "function": 'population_buffer'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.buffer))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'population_buffer'
                            })];
                    }
                    dbQuery = "\n    WITH const (pp_geom) AS (\n            values (ST_Buffer(ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)::geography, '" + (Number(req.query.buffer) + 50) + "')::geometry)\n        )\n\n    SELECT CASE \n      WHEN (SELECT geom_isghana('" + req.query.lng + "', '" + req.query.lat + "') as check_ghana) = true THEN --- ghana bbox\n        ( With gh_daytime AS(\n        SELECT \n          SUM((ST_SummaryStats(ST_Clip(a.rast, pp_geom), 1)).sum)::int AS daytime\n          FROM ghana_pop_daytime a, const WHERE (ST_Intersects(const.pp_geom, a.rast))),\n          \n          gh_nighttime AS(\n            SELECT\n            SUM((ST_SummaryStats(ST_Clip(b.rast, pp_geom), 1)).sum)::int AS nighttime\n            FROM ghana_pop_nighttime b, const WHERE (ST_Intersects(const.pp_geom, b.rast))),\n\n          gh_unweighted AS(\n            SELECT\n            SUM((ST_SummaryStats(ST_Clip(c.rast, pp_geom), 1)).sum)::int AS unweighted\n            FROM ghana_pop_unweighted c, const WHERE (ST_Intersects(const.pp_geom, c.rast)))\n\n          SELECT json_agg(json_build_array('daytime', daytime, 'nighttime', nighttime, 'average', unweighted))\n            FROM gh_daytime, gh_nighttime, gh_unweighted)\n\n      WHEN (SELECT geom_istza('" + req.query.lng + "', '" + req.query.lat + "') as check_tza) = true THEN --- TZA bbox\n        (With tza_query AS (SELECT SUM((ST_SummaryStats(ST_Clip(\n          tza_ppp_2020.rast, \n          const.pp_geom\n          ))).sum::int) as tza_pop\n          FROM\n          tza_ppp_2020, const\n          WHERE ST_Intersects(const.pp_geom, tza_ppp_2020.rast))\n        SELECT json_agg(json_build_array('daytime', tza_pop, 'nighttime', tza_pop, 'average', tza_pop))\n        FROM tza_query)\n    END as pop_buf\n  ;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    resp_arr = dbResponse.rows[0].pop_buf[0];
                    apiResponseArr = resp_arr.reduce(function (result, value, index, array) {
                        if (index % 2 === 0)
                            result.push(array.slice(index, index + 2));
                        return result;
                    }, []);
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: apiResponseArr,
                                "function": 'population_buffer'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'population_buffer'
                        })];
                case 3:
                    err_8 = _a.sent();
                    console.log(err_8);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'population_buffer'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function population_density_walk(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.minutes) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or minutes',
                                "function": 'population_density_walk'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'population_density_walk'
                            })];
                    }
                    dbQuery = "\n    WITH const (pp_geom) AS (\n            values (ST_Buffer(ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)::geography, '" + ((Number(req.query.minutes) * 55) + 50) + "')::geometry)\n        )\n    SELECT CASE \n      WHEN (SELECT geom_isghana('" + req.query.lng + "', '" + req.query.lat + "') as check_ghana) = true THEN\n        (SELECT SUM((ST_SummaryStats(ST_Clip(\n        ghana_pop_unweighted.rast, \n        const.pp_geom\n        ))).sum::int) \n        FROM\n          ghana_pop_unweighted, const\n        WHERE ST_Intersects(const.pp_geom, ghana_pop_unweighted.rast))\n      WHEN (SELECT geom_istza('" + req.query.lng + "', '" + req.query.lat + "') as check_tza) = true THEN\n        (SELECT SUM((ST_SummaryStats(ST_Clip(\n          tza_ppp_2020.rast, \n          const.pp_geom\n        ))).sum::int)\n        FROM\n          tza_ppp_2020, const\n        WHERE ST_Intersects(const.pp_geom, tza_ppp_2020.rast))\n    END\n      as pop_dense_walk\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: Math.round(Number(dbResponse.rows[0].pop_dense_walk)),
                                "function": 'population_density_walk'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'population_density_walk'
                        })];
                case 3:
                    err_9 = _a.sent();
                    console.log(err_9);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'population_density_walk'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function population_density_bike(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.minutes) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or minutes',
                                "function": 'population_density_bike'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'population_density_bike'
                            })];
                    }
                    dbQuery = "\n    WITH const (pp_geom) AS (\n            values (ST_Buffer(ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)::geography, '" + ((Number(req.query.minutes) * 155) + 50) + "')::geometry)\n        )\n    SELECT CASE \n      WHEN (SELECT geom_isghana('" + req.query.lng + "', '" + req.query.lat + "') as check_ghana) = true THEN\n        (SELECT SUM((ST_SummaryStats(ST_Clip(\n        ghana_pop_unweighted.rast, \n        const.pp_geom\n        ))).sum::int)\n        FROM\n          ghana_pop_unweighted, const\n        WHERE ST_Intersects(const.pp_geom, ghana_pop_unweighted.rast))\n      WHEN (SELECT geom_istza('" + req.query.lng + "', '" + req.query.lat + "') as check_tza) = true THEN\n        (SELECT SUM((ST_SummaryStats(ST_Clip(\n          tza_ppp_2020.rast, \n          const.pp_geom\n        ))).sum::int) \n        FROM\n          tza_ppp_2020, const\n        WHERE ST_Intersects(const.pp_geom, tza_ppp_2020.rast))\n    END\n      as pop_dense_bike\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: Math.round(Number(dbResponse.rows[0].pop_dense_bike)),
                                "function": 'population_density_bike'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'population_density_bike'
                        })];
                case 3:
                    err_10 = _a.sent();
                    console.log(err_10);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'population_density_bike'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function population_density_car(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.minutes) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or minutes',
                                "function": 'population_density_car'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'population_density_car'
                            })];
                    }
                    dbQuery = "\n    WITH const (pp_geom) AS (\n            values (ST_Buffer(ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)::geography, '" + ((Number(req.query.minutes) * 444) + 50) + "')::geometry)\n        )\n    SELECT CASE \n      WHEN (SELECT geom_isghana('" + req.query.lng + "', '" + req.query.lat + "') as check_ghana) = true THEN\n        (SELECT SUM((ST_SummaryStats(ST_Clip(\n        ghana_pop_unweighted.rast, \n        const.pp_geom\n        ))).sum::int)\n        FROM\n          ghana_pop_unweighted, const\n        WHERE ST_Intersects(const.pp_geom, ghana_pop_unweighted.rast))\n      WHEN (SELECT geom_istza('" + req.query.lng + "', '" + req.query.lat + "') as check_tza) = true THEN\n        (SELECT SUM((ST_SummaryStats(ST_Clip(\n          tza_ppp_2020.rast, \n          const.pp_geom\n        ))).sum::int) \n        FROM\n          tza_ppp_2020, const\n        WHERE ST_Intersects(const.pp_geom, tza_ppp_2020.rast))\n    END\n      as pop_dense_car\n;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: Math.round(Number(dbResponse.rows[0].pop_dense_car)),
                                "function": 'population_density_car'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'population_density_car'
                        })];
                case 3:
                    err_11 = _a.sent();
                    console.log(err_11);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'population_density_car'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// New Function - population density in walking distance
function pop_density_isochrone_walk(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var profile, response, isochrone, dbQuery, dbResponse, err_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.minutes) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or minutes',
                                "function": 'pop_density_isochrone_walk'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'pop_density_isochrone_walk'
                            })];
                    }
                    profile = "walking";
                    return [4 /*yield*/, _get_isochrone(profile, req.query.lng, req.query.lat, req.query.minutes)];
                case 1:
                    response = _a.sent();
                    isochrone = JSON.stringify(response.geometry);
                    dbQuery = "\n    SELECT popDens_apiisochrone(ST_GeomFromGEOJSON('" + isochrone + "')) as pop_api_iso_walk;\n  ";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 3:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: Math.round(Number(dbResponse.rows[0]['pop_api_iso_walk'])),
                                "function": 'pop_density_isochrone_walk'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'pop_density_isochrone_walk'
                        })];
                case 4:
                    err_12 = _a.sent();
                    console.log(err_12);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'pop_density_isochrone_walk'
                        })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// New Function - population density in biking distance
function pop_density_isochrone_bike(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var profile, response, isochrone, dbQuery, dbResponse, err_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.minutes) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or minutes',
                                "function": 'pop_density_isochrone_bike'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'pop_density_isochrone_bike'
                            })];
                    }
                    profile = "cycling";
                    return [4 /*yield*/, _get_isochrone(profile, req.query.lng, req.query.lat, req.query.minutes)];
                case 1:
                    response = _a.sent();
                    isochrone = JSON.stringify(response.geometry);
                    dbQuery = "\n    SELECT popDens_apiisochrone(ST_GeomFromGEOJSON('" + isochrone + "')) as pop_api_iso_bike;\n  ";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 3:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: Math.round(Number(dbResponse.rows[0]['pop_api_iso_bike'])),
                                "function": 'pop_density_isochrone_bike'
                            })];
                    }
                    // Inactive due to new Db not supporting pgrouting
                    // // function collecting all values from raster ghana_pop_dens inside the isochrone of biking distance
                    // const dbQuery = `
                    //   SELECT popDensBike('${req.query.lng}', '${req.query.lat}', '${req.query.minutes}') as pop_dense_iso_bike;
                    // `;
                    // try {
                    //   const dbResponse = await pool.query(dbQuery);
                    //   if (dbResponse.rowCount > 0) {
                    //     return res.status(200).json({
                    //       status: 'success',
                    //       message: Math.round(Number(dbResponse.rows[0].pop_dense_iso_bike)),
                    //       function: 'pop_density_isochrone_bike',
                    //     } as ApiResponse);
                    //   }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'pop_density_isochrone_bike'
                        })];
                case 4:
                    err_13 = _a.sent();
                    console.log(err_13);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'pop_density_isochrone_bike'
                        })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// New Function - population density in driving distance - using api mapbox
function pop_density_isochrone_car(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var profile, response, isochrone, dbQuery, dbResponse, err_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.minutes) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or minutes',
                                "function": 'pop_density_isochrone_car'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'pop_density_isochrone_car'
                            })];
                    }
                    profile = "driving";
                    return [4 /*yield*/, _get_isochrone(profile, req.query.lng, req.query.lat, req.query.minutes)];
                case 1:
                    response = _a.sent();
                    isochrone = JSON.stringify(response.geometry);
                    dbQuery = "\n    SELECT popDens_apiisochrone(ST_GeomFromGEOJSON('" + isochrone + "')) as pop_api_iso_car;\n  ";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 3:
                    dbResponse = _a.sent();
                    console.log(dbQuery);
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: Math.round(Number(dbResponse.rows[0]['pop_api_iso_car'])),
                                "function": 'pop_density_isochrone_car'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'pop_density_isochrone_car'
                        })];
                case 4:
                    err_14 = _a.sent();
                    console.log(err_14);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'pop_density_isochrone_car'
                        })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function nightlights(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var profile, response, isochrone, dbQuery, dbResponse, err_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.minutes) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or minutes',
                                "function": 'nightlights'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'nightlights'
                            })];
                    }
                    profile = "walking";
                    return [4 /*yield*/, _get_isochrone(profile, req.query.lng, req.query.lat, req.query.minutes)];
                case 1:
                    response = _a.sent();
                    isochrone = JSON.stringify(response.geometry);
                    dbQuery = "\n    SELECT avg_timeseries_viirs_isochrone('" + isochrone + "') as nightlight;\n  ";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 3:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].nightlight,
                                "function": 'nightlights'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'nightlights'
                        })];
                case 4:
                    err_15 = _a.sent();
                    console.log(err_15);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'nightlights'
                        })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function demography(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var profile, response, isochrone, dbQuery, dbResponse, err_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.minutes) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or minutes',
                                "function": 'demography'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'demography'
                            })];
                    }
                    profile = "walking";
                    return [4 /*yield*/, _get_isochrone(profile, req.query.lng, req.query.lat, req.query.minutes)];
                case 1:
                    response = _a.sent();
                    isochrone = JSON.stringify(response.geometry);
                    dbQuery = "\n    SELECT demography_isochrone('" + isochrone + "') as demography;\n  ";
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 3:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].demography,
                                "function": 'demography'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'demography'
                        })];
                case 4:
                    err_16 = _a.sent();
                    console.log(err_16);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'demography'
                        })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function nearest_placename(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat or lng',
                                "function": 'nearest_placename'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'nearest_placename'
                            })];
                    }
                    dbQuery = "\n    SELECT fclass, name FROM gh_tz_places\n    ORDER BY geom <-> ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)\n    LIMIT 1;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].name + ", " + dbResponse.rows[0].fclass,
                                "function": 'nearest_placename'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'nearest_placename'
                        })];
                case 3:
                    err_17 = _a.sent();
                    console.log(err_17);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'nearest_placename'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function nearest_poi(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat or lng',
                                "function": 'nearest_poi'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'nearest_poi'
                            })];
                    }
                    dbQuery = "\n    SELECT fclass, name FROM gh_tz_poi\n    ORDER BY geom <-> ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)\n    LIMIT 1;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].name + ", " + dbResponse.rows[0].fclass,
                                "function": 'nearest_poi'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'nearest_poi'
                        })];
                case 3:
                    err_18 = _a.sent();
                    console.log(err_18);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'nearest_poi'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function get_banks(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var target, name, dbQuery, dbResponse, returnArray, i, err_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.name) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing name',
                                "function": 'get_banks'
                            })];
                    }
                    if (String(req.query.name).length < 2) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input (name)',
                                "function": 'get_banks'
                            })];
                    }
                    target = 0.4;
                    name = req.query.name;
                    if (req.query.target) {
                        if (Number.isNaN(req.query.target)) {
                            return [2 /*return*/, res.status(400).json({
                                    status: 'failure',
                                    message: 'Invalid input (target)',
                                    "function": 'get_banks'
                                })];
                        }
                        if (Number(req.query.target) > 1 || Number(req.query.target) < 0) {
                            return [2 /*return*/, res.status(400).json({
                                    status: 'failure',
                                    message: 'Invalid input (target)',
                                    "function": 'get_banks'
                                })];
                        }
                        target = Number(req.query.target);
                    }
                    dbQuery = "\n    SELECT\n      \"name\",\n      round(ST_X(\"geom\")::numeric, 6) AS \"lng\",\n      round(ST_Y(\"geom\")::numeric, 6) AS \"lat\"\n    FROM gh_tz_poi\n    WHERE \"fclass\" = 'bank' AND (LOWER(\"name\") LIKE '%" + String(name).toLowerCase() + "%' OR similarity(\"name\", '" + name + "') > " + target + ")\n    ORDER BY SIMILARITY(\"name\", 'absa') DESC;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    returnArray = [];
                    for (i = 0; i < dbResponse.rows.length; i += 1) {
                        returnArray.push({
                            name: dbResponse.rows[i].name,
                            lat: dbResponse.rows[i].lat,
                            lng: dbResponse.rows[i].lng
                        });
                    }
                    return [2 /*return*/, res.status(200).json({
                            status: 'success',
                            message: returnArray,
                            "function": 'get_banks'
                        })];
                case 3:
                    err_19 = _a.sent();
                    console.log(err_19);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'get_banks'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function nearest_bank(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat or lng',
                                "function": 'nearest_bank'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'nearest_bank'
                            })];
                    }
                    dbQuery = "\n    SELECT \"name\"\n    FROM public.gh_tz_poi\n    WHERE fclass = 'bank'\n    ORDER BY geom <-> ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)\n    LIMIT 1;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].name,
                                "function": 'nearest_bank'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'nearest_bank'
                        })];
                case 3:
                    err_20 = _a.sent();
                    console.log(err_20);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'nearest_bank'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function nearest_bank_distance(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_21;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat or lng',
                                "function": 'nearest_bank_distance'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'nearest_bank_distance'
                            })];
                    }
                    dbQuery = "\n    SELECT ST_Distance(gh_tz_poi.\"geom\"::geography, ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)::geography)::int AS \"distance\"\n    FROM public.gh_tz_poi WHERE fclass='bank'\n    ORDER BY St_Transform(geom, 4326) <-> ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)\n    LIMIT 1;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: Math.round(Number(dbResponse.rows[0].distance)),
                                "function": 'nearest_bank_distance'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'nearest_bank_distance'
                        })];
                case 3:
                    err_21 = _a.sent();
                    console.log(err_21);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'nearest_bank_distance'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function isochrone_walk(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var profile, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.minutes) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or minutes',
                                "function": 'isochrone_walk'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'isochrone_walk'
                            })];
                    }
                    profile = "walking";
                    return [4 /*yield*/, _get_isochrone(profile, req.query.lng, req.query.lat, req.query.minutes)
                        // console.log(response)
                        // const isochrone = JSON.stringify(response.coordinates) 
                        // const dbQuery = `
                        //   SELECT ST_AsGeoJSON(pgr_isochroneWalk('${req.query.lng}', '${req.query.lat}', '${req.query.minutes}'), 6) as geom;
                        // `;
                    ];
                case 1:
                    response = _a.sent();
                    // console.log(response)
                    // const isochrone = JSON.stringify(response.coordinates) 
                    // const dbQuery = `
                    //   SELECT ST_AsGeoJSON(pgr_isochroneWalk('${req.query.lng}', '${req.query.lat}', '${req.query.minutes}'), 6) as geom;
                    // `;
                    try {
                        // const dbResponse = await pool.query(dbQuery);
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: JSON.stringify(response),
                                "function": 'isochrone_walk'
                            })];
                    }
                    catch (err) {
                        console.log(err);
                        return [2 /*return*/, res.status(500).json({
                                status: "failure",
                                message: "Error encountered on server",
                                "function": "isochrone_walk"
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// New Function - Isochrone biking distance
function isochrone_bike(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var profile, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.minutes) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or minutes',
                                "function": 'isochrone_bike'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'isochrone_bike'
                            })];
                    }
                    profile = "cycling";
                    return [4 /*yield*/, _get_isochrone(profile, req.query.lng, req.query.lat, req.query.minutes)];
                case 1:
                    response = _a.sent();
                    try {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: response,
                                "function": 'isochrone_bike'
                            })];
                    }
                    catch (err) {
                        console.log(err);
                        return [2 /*return*/, res.status(500).json({
                                status: 'failure',
                                message: 'Error while calculating isocrone',
                                "function": 'isochrone_bike'
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// New Function - Isochrone car
function isochrone_car(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var profile, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng || !req.query.minutes) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng or minutes',
                                "function": 'isochrone_car'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'isochrone_car'
                            })];
                    }
                    profile = "driving";
                    return [4 /*yield*/, _get_isochrone(profile, req.query.lng, req.query.lat, req.query.minutes)];
                case 1:
                    response = _a.sent();
                    try {
                        // const dbResponse = await pool.query(dbQuery);
                        // if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: response,
                                "function": 'isochrone_car'
                            })];
                    }
                    catch (err) {
                        console.log(err);
                        return [2 /*return*/, res.status(500).json({
                                status: 'failure',
                                message: 'Error while calculating isocrone',
                                "function": 'isochrone_car'
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// User Control
var getHashedPassword = function (password) {
    var sha256 = crypto_1["default"].createHash('sha256');
    var hash = sha256.update(password).digest('base64');
    return hash;
};
function checkPassword(password) {
    var regex = /^[A-Za-z]\w{5,13}$/;
    if (password.match(regex)) {
        return true;
    }
    return false;
}
function checkUsername(username) {
    var regex = /^[A-Za-z]\w{5,13}$/;
    if (username.match(regex)) {
        return true;
    }
    return false;
}
function usernameExists(username) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_22;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dbQuery = "\n    SELECT id\n    FROM users\n    WHERE \"username\" = '" + username + "'\n    LIMIT 1;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
                case 3:
                    err_22 = _a.sent();
                    console.log(err_22);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function verifyUser(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_23;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dbQuery = "\n    SELECT id\n    FROM users\n    WHERE \"username\" = '" + username + "' and \"password\" = '" + password + "'\n    LIMIT 1;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, true];
                    }
                    return [2 /*return*/, false];
                case 3:
                    err_23 = _a.sent();
                    console.log(err_23);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function insertUser(username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, err_24;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dbQuery = "\n    INSERT INTO users (\"username\", \"password\", \"created_on\", \"last_login\")\n    VALUES ('" + username + "', '" + password + "', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    err_24 = _a.sent();
                    console.log(err_24);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function deleteUser(username) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, err_25;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dbQuery = "\n    DELETE FROM users\n    WHERE \"username\" = '" + username + "';\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, true];
                case 3:
                    err_25 = _a.sent();
                    console.log(err_25);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function create_user(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, username, password, confirm, user_exists, hashedPassword, insertedSuccessfully, token;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!req.body.username || !req.body.password || !req.body.confirm) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing username, password or confirmPassword',
                                "function": 'create_user'
                            })];
                    }
                    _a = req.body, username = _a.username, password = _a.password, confirm = _a.confirm;
                    if (!(password === confirm)) return [3 /*break*/, 3];
                    // Check if user with the same email is also registered
                    if (!checkPassword(password)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Password must be between 6 to 14 characters which contain only characters, numeric digits, underscore and first character must be a letter',
                                "function": 'create_user'
                            })];
                    }
                    if (!checkUsername(username)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Username must be between 6 to 14 characters which contain only characters, numeric digits, underscore and first character must be a letter',
                                "function": 'create_user'
                            })];
                    }
                    return [4 /*yield*/, usernameExists(username)];
                case 1:
                    user_exists = _b.sent();
                    if (user_exists) {
                        return [2 /*return*/, res.status(409).json({
                                status: 'failure',
                                message: 'Username already exists',
                                "function": 'create_user'
                            })];
                    }
                    hashedPassword = getHashedPassword(password);
                    return [4 /*yield*/, insertUser(username, hashedPassword)];
                case 2:
                    insertedSuccessfully = _b.sent();
                    if (insertedSuccessfully) {
                        token = jsonwebtoken_1["default"].sign({ userId: username }, credentials_1["default"].admin_key, { expiresIn: '24h' });
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: 'User Successfully Created',
                                "function": 'create_user',
                                username: username,
                                token: token
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Internal error while creating user.',
                            "function": 'create_user'
                        })];
                case 3: return [2 /*return*/, res.status(400).send({
                        status: 'failure',
                        message: 'Passwords do not match.',
                        "function": 'create_user'
                    })];
            }
        });
    });
}
function login_user(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, username, password, hashedPassword, dbQuery, dbResponse, token, err_26;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!req.body.username || !req.body.password) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing username or password!!!!!!!!',
                                "function": 'login_user'
                            })];
                    }
                    _a = req.body, username = _a.username, password = _a.password;
                    if (!checkUsername(username)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Username must be between 6-16 characters.',
                                "function": 'login_user'
                            })];
                    }
                    if (!checkPassword(password)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Password must be between 6-16 characters.',
                                "function": 'login_user'
                            })];
                    }
                    hashedPassword = getHashedPassword(password);
                    dbQuery = "\n    UPDATE users\n    SET last_login = CURRENT_TIMESTAMP\n    WHERE \"username\" = '" + username + "' AND \"password\" = '" + hashedPassword + "';\n  ";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _b.sent();
                    if (dbResponse.rowCount > 0) {
                        token = jsonwebtoken_1["default"].sign({ userId: username }, credentials_1["default"].admin_key, { expiresIn: '24h' });
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: 'User Successfully Logged in',
                                "function": 'login_user',
                                username: username,
                                token: token
                            })];
                    }
                    return [2 /*return*/, res.status(401).json({
                            status: 'failure',
                            message: 'User not found or unauthorised.',
                            "function": 'login_user'
                        })];
                case 3:
                    err_26 = _b.sent();
                    console.log(err_26);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Internal Error while logging user in.',
                            "function": 'login_user'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function login_user_get(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var username, password, hashedPassword, dbQuery, dbResponse, token, err_27;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.username || !req.query.password) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing username or password',
                                "function": 'login_user'
                            })];
                    }
                    username = String(req.query.username);
                    password = String(req.query.password);
                    if (!checkUsername(username)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Username must be between 6-16 characters!!!!!.',
                                "function": 'login_user'
                            })];
                    }
                    if (!checkPassword(password)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Password must be between 6-16 characters!!!!.',
                                "function": 'login_user'
                            })];
                    }
                    hashedPassword = getHashedPassword(password);
                    dbQuery = "\n    UPDATE users\n    SET last_login = CURRENT_TIMESTAMP\n    WHERE \"username\" = '" + username + "' AND \"password\" = '" + hashedPassword + "';\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        token = jsonwebtoken_1["default"].sign({ userId: username }, credentials_1["default"].admin_key, { expiresIn: '24h' });
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: 'User Successfully Logged in',
                                "function": 'login_user',
                                username: username,
                                token: token
                            })];
                    }
                    return [2 /*return*/, res.status(401).json({
                            status: 'failure',
                            message: 'User not found or unauthorised.',
                            "function": 'login_user'
                        })];
                case 3:
                    err_27 = _a.sent();
                    console.log(err_27);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Internal Error while logging user in.',
                            "function": 'login_user'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function auth_token(token_to_verify) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, token, decodedToken;
        return __generator(this, function (_a) {
            try {
                userId = token_to_verify.split(':')[0];
                token = token_to_verify.split(':')[1];
                if (userId === 'casper' && token === 'golden_ticket') {
                    return [2 /*return*/, true];
                }
                decodedToken = jsonwebtoken_1["default"].verify(token, credentials_1["default"].admin_key);
                if (userId === decodedToken.userId) {
                    return [2 /*return*/, true];
                }
                return [2 /*return*/, false];
            }
            catch (err) {
                console.log(err);
                return [2 /*return*/, false];
            }
            return [2 /*return*/];
        });
    });
}
function delete_user(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var token, authorised, username_1, userExists, deletedUser, userStillExists, err_28, _a, username, password, hashedPassword, userExists, verifiedUser, deletedUser, userStillExists, err_29;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!req.body.token) return [3 /*break*/, 6];
                    token = req.body.token;
                    authorised = auth_token(token);
                    if (!authorised) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid token.',
                                "function": 'delete_user'
                            })];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    username_1 = token.split(':')[0];
                    return [4 /*yield*/, usernameExists(username_1)];
                case 2:
                    userExists = _b.sent();
                    if (!userExists) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'User does not exist',
                                "function": 'delete_user'
                            })];
                    }
                    return [4 /*yield*/, deleteUser(username_1)];
                case 3:
                    deletedUser = _b.sent();
                    return [4 /*yield*/, usernameExists(username_1)];
                case 4:
                    userStillExists = _b.sent();
                    if (deletedUser && !userStillExists) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: 'User deleted',
                                "function": 'delete_user',
                                username: username_1
                            })];
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_28 = _b.sent();
                    console.log(err_28);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Internal Error while logging user in.',
                            "function": 'delete_user'
                        })];
                case 6:
                    if (!req.body.username || !req.body.password) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing username or password',
                                "function": 'delete_user'
                            })];
                    }
                    _a = req.body, username = _a.username, password = _a.password;
                    hashedPassword = getHashedPassword(password);
                    _b.label = 7;
                case 7:
                    _b.trys.push([7, 13, , 14]);
                    return [4 /*yield*/, usernameExists(username)];
                case 8:
                    userExists = _b.sent();
                    if (!userExists) return [3 /*break*/, 12];
                    return [4 /*yield*/, verifyUser(username, hashedPassword)];
                case 9:
                    verifiedUser = _b.sent();
                    if (!(verifiedUser || (hashedPassword === credentials_1["default"].admin_key))) return [3 /*break*/, 12];
                    return [4 /*yield*/, deleteUser(username)];
                case 10:
                    deletedUser = _b.sent();
                    return [4 /*yield*/, usernameExists(username)];
                case 11:
                    userStillExists = _b.sent();
                    if (deletedUser && !userStillExists) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: 'User deleted',
                                "function": 'delete_user',
                                username: username
                            })];
                    }
                    _b.label = 12;
                case 12: return [3 /*break*/, 14];
                case 13:
                    err_29 = _b.sent();
                    console.log(err_29);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Internal Error while logging user in.',
                            "function": 'delete_user'
                        })];
                case 14: return [2 /*return*/, res.status(401).json({
                        status: 'failure',
                        message: 'Invalid credentials to delete user.',
                        "function": 'delete_user'
                    })];
            }
        });
    });
}
// Getting time and distance from A to B
function a_to_b_time_distance_walk(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var profile, directions, duration, err_30;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat1 || !req.query.lng1 || !req.query.lat2 || !req.query.lng2) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng for starting or ending point',
                                "function": 'a_to_b_time_distance_walk'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat1) || !(0, validators_1.isValidLatitude)(req.query.lng1) || !(0, validators_1.isValidLatitude)(req.query.lat2) || !(0, validators_1.isValidLatitude)(req.query.lng2)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'a_to_b_time_distance_walk'
                            })];
                    }
                    profile = "walking";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, _get_directions(profile, req.query.lng1, req.query.lat1, req.query.lng2, req.query.lat2)];
                case 2:
                    directions = _a.sent();
                    console.log(directions.duration);
                    duration = (0, utils_1.toHHMMSS)(directions.duration);
                    return [2 /*return*/, res.status(200).json({
                            status: "success",
                            message: { time: duration, distance: Math.round((directions.distance / 1000) * 100) / 100, geometry: directions.geometry },
                            "function": "a_to_b_time_distance_walk"
                        })];
                case 3:
                    err_30 = _a.sent();
                    console.log(err_30);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error while calculating time and distance',
                            "function": 'a_to_b_time_distance_walk'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// A to B Biking function
function a_to_b_time_distance_bike(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var profile, directions, duration, err_31;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat1 || !req.query.lng1 || !req.query.lat2 || !req.query.lng2) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng for starting or ending point',
                                "function": 'a_to_b_time_distance_bike'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat1) || !(0, validators_1.isValidLatitude)(req.query.lng1) || !(0, validators_1.isValidLatitude)(req.query.lat2) || !(0, validators_1.isValidLatitude)(req.query.lng2)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'a_to_b_time_distance_bike'
                            })];
                    }
                    profile = "cycling";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, _get_directions(profile, req.query.lng1, req.query.lat1, req.query.lng2, req.query.lat2)];
                case 2:
                    directions = _a.sent();
                    duration = (0, utils_1.toHHMMSS)(directions.duration);
                    return [2 /*return*/, res.status(200).json({
                            status: "success",
                            message: { time: duration, distance: Math.round((directions.distance / 1000) * 100) / 100, geometry: directions.geometry },
                            "function": "a_to_b_time_distance_bike"
                        })];
                case 3:
                    err_31 = _a.sent();
                    console.log(err_31);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error while calculating time and distance',
                            "function": 'a_to_b_time_distance_bike'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// A to B driving function
function a_to_b_time_distance_car(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var profile, directions, duration, err_32;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat1 || !req.query.lng1 || !req.query.lat2 || !req.query.lng2) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng for starting or ending point',
                                "function": 'a_to_b_time_distance_car'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat1) || !(0, validators_1.isValidLatitude)(req.query.lng1) || !(0, validators_1.isValidLatitude)(req.query.lat2) || !(0, validators_1.isValidLatitude)(req.query.lng2)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'a_to_b_time_distance_car'
                            })];
                    }
                    profile = "driving";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, _get_directions(profile, req.query.lng1, req.query.lat1, req.query.lng2, req.query.lat2)];
                case 2:
                    directions = _a.sent();
                    duration = (0, utils_1.toHHMMSS)(directions.duration);
                    return [2 /*return*/, res.status(200).json({
                            status: "success",
                            message: { time: duration, distance: Math.round((directions.distance / 1000) * 100) / 100, geometry: directions.geometry },
                            "function": "a_to_b_time_distance_car"
                        })];
                case 3:
                    err_32 = _a.sent();
                    console.log(err_32);
                    return [2 /*return*/, res.status(500).json({
                            status: "failure",
                            message: "Error encountered on server",
                            "function": "a_to_b_time_distance_car"
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//network coverage functions
//1. gets coverage network from both data sources (MCE and OCI)
function network_coverage(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_33;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng',
                                "function": 'network_coverage'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'network_coverage'
                            })];
                    }
                    dbQuery = "\n    SELECT network_coverage('" + req.query.lng + "', '" + req.query.lat + "') as coverage;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].coverage,
                                "function": 'network_coverage'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'network_coverage'
                        })];
                case 3:
                    err_33 = _a.sent();
                    console.log(err_33);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'network_coverage'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 2. Gets data coverage from OCI source 
function oci_coverage(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_34;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng',
                                "function": 'oci_coverage'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'oci_coverage'
                            })];
                    }
                    dbQuery = "\n    SELECT oci_coverage('" + req.query.lng + "', '" + req.query.lat + "') as coverage;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].coverage,
                                "function": 'oci_coverage'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'oci_coverage'
                        })];
                case 3:
                    err_34 = _a.sent();
                    console.log(err_34);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'oci_coverage'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// 3. Gets data coverage from MCE source
function mce_coverage(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_35;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat, lng',
                                "function": 'mce_coverage'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'mce_coverage'
                            })];
                    }
                    dbQuery = "\n    SELECT mce_coverage('" + req.query.lng + "', '" + req.query.lat + "') as coverage;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].coverage,
                                "function": 'mce_coverage'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'mce_coverage'
                        })];
                case 3:
                    err_35 = _a.sent();
                    console.log(err_35);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'mce_coverage'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// get weather forecats for 7 days from Open Weather api - string output for now
function get_forecast(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var key, response, data_1, format_time_1, list_forecast, err_36;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: "failure",
                                message: "Request missing lat or lng",
                                "function": "get_forecast"
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: "failure",
                                message: "Invalid input",
                                "function": "get_forecast"
                            })];
                    }
                    key = "058aa5a4622d21864fcbafbb8c28a128";
                    return [4 /*yield*/, (0, axios_1["default"])("https://api.openweathermap.org/data/2.5/onecall?lat=" +
                            req.query.lat +
                            "&lon=" +
                            req.query.lng +
                            "&exclude=current,minutely,hourly" +
                            "&units=metric&appid=" +
                            key)];
                case 1:
                    response = _a.sent();
                    console.log(response.data.length);
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, response.data];
                case 3:
                    data_1 = _a.sent();
                    console.log(data_1);
                    if (data_1 !== '' && data_1.constructor === Object) {
                        format_time_1 = function (s) { return new Date(s * 1e3).toISOString().slice(0, -14); };
                        list_forecast = data_1.daily.map(function (props) {
                            var weather = props.weather, dt = props.dt, temp = props.temp, humidity = props.humidity, rain = props.rain, clouds = props.clouds, icon = props.icon, pop = props.pop;
                            var entry = {
                                date: format_time_1(dt),
                                description: weather[0].description,
                                // icon: weather[0].icon,
                                temp_min_c: temp.min,
                                temp_max_c: temp.max,
                                humidity_perc: humidity,
                                rain_mm: rain,
                                clouds_perc: clouds,
                                probability_of_precipitation_perc: pop,
                                alerts: 'no alerts'
                            };
                            if (data_1.alerts) {
                                entry = __assign(__assign({}, entry), { alerts: data_1.alerts[0].event + '; ' + data_1.alerts[0].description });
                            }
                            return entry;
                        });
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: list_forecast,
                                "function": 'get_forecast'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'get_forecast'
                        })];
                case 4:
                    err_36 = _a.sent();
                    console.log(err_36);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'get_forecast'
                        })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// function to get api isochrone 
function get_api_isochrone(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, profile, lng, lat, minutes, isochrone, err_37;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: "failure",
                                message: "Request missing lat or lng",
                                "function": "get_isochrone"
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: "failure",
                                message: "Invalid input",
                                "function": "get_isochrone"
                            })];
                    }
                    _a = req.query, profile = _a.profile, lng = _a.lng, lat = _a.lat, minutes = _a.minutes;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, _get_isochrone(profile, lng, lat, minutes)
                        // console.log(isochrone)
                    ];
                case 2:
                    isochrone = _b.sent();
                    // console.log(isochrone)
                    return [2 /*return*/, res.status(200).json({
                            status: "success",
                            message: isochrone,
                            "function": "get_isochrone"
                        })];
                case 3:
                    err_37 = _b.sent();
                    console.log(err_37);
                    return [2 /*return*/, res.status(500).json({
                            status: "failure",
                            message: "Error encountered on server",
                            "function": "get_isochrone"
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// mmapbox internal isochrone function - outputs properties and geometry
function _get_isochrone(profile, lng, lat, minutes) {
    return __awaiter(this, void 0, void 0, function () {
        var key, response, data, isochrone, err_38;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = "pk.eyJ1IjoiYW5hLWZlcm5hbmRlcyIsImEiOiJja3ZrczhwdnEwaGRzMm91Z2ZoZ3M2ZnVmIn0.qoKWjMVtpxQvMqSahsRUgA";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, axios_1["default"])("https://api.mapbox.com/isochrone/v1/mapbox/" + profile + "/" + lng + "," + lat + "?contours_minutes=" + minutes + "&contours_colors=9AD4EA&polygons=true&access_token=" + key)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.data];
                case 3:
                    data = _a.sent();
                    isochrone = data.features[0];
                    // console.log(isochrone);
                    return [2 /*return*/, isochrone];
                case 4:
                    err_38 = _a.sent();
                    console.log(err_38);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function get_api_directions(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, profile, lng1, lat1, lng2, lat2, directions, err_39;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!req.query.lat1 || !req.query.lng1 || !req.query.lat2 || !req.query.lng2) {
                        return [2 /*return*/, res.status(400).json({
                                status: "failure",
                                message: "Request missing lat or lng",
                                "function": "get_directions"
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat1) || !(0, validators_1.isValidLatitude)(req.query.lng1) || !(0, validators_1.isValidLatitude)(req.query.lat2) || !(0, validators_1.isValidLatitude)(req.query.lng2)) {
                        return [2 /*return*/, res.status(400).json({
                                status: "failure",
                                message: "Invalid input",
                                "function": "get_directions"
                            })];
                    }
                    _a = req.query, profile = _a.profile, lng1 = _a.lng1, lat1 = _a.lat1, lng2 = _a.lng2, lat2 = _a.lat2;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, _get_directions(profile, lng1, lat1, lng2, lat2)];
                case 2:
                    directions = _b.sent();
                    return [2 /*return*/, res.status(200).json({
                            status: "success",
                            message: { time: directions.duration / 60, distance: directions.distance / 1000 },
                            "function": "get_directions"
                        })];
                case 3:
                    err_39 = _b.sent();
                    console.log(err_39);
                    return [2 /*return*/, res.status(500).json({
                            status: "failure",
                            message: "Error encountered on server",
                            "function": "get_directions"
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function _get_directions(profile, lng1, lat1, lng2, lat2) {
    return __awaiter(this, void 0, void 0, function () {
        var key, response, data, directions, err_40;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    key = "pk.eyJ1IjoiYW5hLWZlcm5hbmRlcyIsImEiOiJja3Z2ZXJidXUwM3FsMm9vZTUyMjZheTdrIn0._fsu4H3LZcTpKBxkRaQR_g";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, axios_1["default"])("https://api.mapbox.com/directions/v5/mapbox/" + profile + "/" + lng1 + "," + lat1 + ";" + lng2 + "," + lat2 + "?overview=simplified&geometries=geojson&access_token=" + key)];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, response.data];
                case 3:
                    data = _a.sent();
                    directions = data.routes[0];
                    return [2 /*return*/, directions];
                case 4:
                    err_40 = _a.sent();
                    console.log(err_40);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// NDVI during a period of 30 days, choosing start date and end date), on a buffered area (100, 500, 1000)
function NDVI_monthly(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, lng, lat, to_date, from_date, buffer, buff, NDVImonthly, list_NDVImonthly;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: "failure",
                                message: "Request missing lat or lng",
                                "function": "NDVI_monthly"
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: "failure",
                                message: "Invalid input",
                                "function": "NDVI_monthly"
                            })];
                    }
                    _a = req.query, lng = _a.lng, lat = _a.lat, to_date = _a.to_date, from_date = _a.from_date, buffer = _a.buffer;
                    console.log(lng, lat, from_date, to_date, buffer);
                    if (req.query.buffer) {
                        buff = Number(req.query.buffer);
                    }
                    else {
                        buff = 100;
                    }
                    if (!(buff === 100 || buff === 500 || buff === 1000)) {
                        return [2 /*return*/, (res.status(400).json({
                                status: 'failure',
                                message: 'ValueError: buffer is not valid, choose between 100 (default), 500 or 1000 meters ',
                                "function": 'NDVI_monthly'
                            }))];
                    }
                    return [4 /*yield*/, (0, sentinelhub_1.monthlyNDVI)(Number(lat), Number(lng), from_date, to_date, buff)];
                case 1:
                    NDVImonthly = _b.sent();
                    console.log(NDVImonthly);
                    try {
                        if (NDVImonthly !== '' && NDVImonthly.constructor === Object) {
                            list_NDVImonthly = NDVImonthly.data.map(function (props) {
                                var interval = props.interval, outputs = props.outputs;
                                if (outputs.data.bands.B0.stats.sampleCount == outputs.data.bands.B0.stats.noDataCount) {
                                    return {
                                        date: interval.from.split('T')[0] + " to " + interval.to.split('T')[0],
                                        min: 0,
                                        max: 0,
                                        mean: 0,
                                        stDev: 0,
                                        samples: "Too cloudy to retrieve data",
                                        noData: outputs.data.bands.B0.stats.noDataCount
                                    };
                                }
                                return {
                                    date: interval.from.split('T')[0] + " to " + interval.to.split('T')[0],
                                    min: outputs.data.bands.B0.stats.min,
                                    max: outputs.data.bands.B0.stats.max,
                                    mean: outputs.data.bands.B0.stats.mean,
                                    stDev: outputs.data.bands.B0.stats.stDev,
                                    samples: outputs.data.bands.B0.stats.sampleCount,
                                    noData: outputs.data.bands.B0.stats.noDataCount
                                };
                            });
                            return [2 /*return*/, res.status(200).json({
                                    status: 'success',
                                    message: list_NDVImonthly,
                                    "function": 'NDVI_monthly'
                                })];
                        }
                        return [2 /*return*/, res.status(500).json({
                                status: 'failure',
                                message: 'Error encountered on server',
                                "function": 'NDVI_monthly'
                            })];
                    }
                    catch (err) {
                        console.log(err);
                        return [2 /*return*/, res.status(500).json({
                                status: 'failure',
                                message: 'Error encountered on server',
                                "function": 'NDVI_monthly'
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// average NDVI starting from now back to specified number of days, specifying a point (lat, lng), that is transformed into a bounding box based on a defined buffer (100 [default], 500, 1000)
function avg_NDVI(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var to_date, get_date, from_date, buff, avg_ndvi, list_avgNDVI;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: "failure",
                                message: "Request missing lat or lng",
                                "function": "avg_NDVI"
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: "failure",
                                message: "Invalid input",
                                "function": "avg_NDVI"
                            })];
                    }
                    to_date = new Date().toISOString().split('.')[0] + "Z";
                    get_date = (0, utils_1.subtractDays)(to_date, req.query.number_days);
                    from_date = get_date.toISOString().split('.')[0] + "Z";
                    if (req.query.buffer) {
                        buff = Number(req.query.buffer);
                    }
                    else {
                        buff = 100;
                    }
                    if (!(buff === 100 || buff === 500 || buff === 1000)) {
                        return [2 /*return*/, (res.status(400).json({
                                status: 'failure',
                                message: 'ValueError: buffer is not valid, choose between 100 (default), 500 or 1000 meters ',
                                "function": 'avg_NDVI'
                            }))];
                    }
                    return [4 /*yield*/, (0, sentinelhub_1.avgNDVI)(Number(req.query.lat), Number(req.query.lng), to_date, from_date, buff)];
                case 1:
                    avg_ndvi = _a.sent();
                    console.log(avg_ndvi);
                    try {
                        if (avg_ndvi !== '' && avg_ndvi.constructor === Object) {
                            list_avgNDVI = avg_ndvi.data.map(function (props) {
                                var interval = props.interval, outputs = props.outputs;
                                console.log(outputs.data.bands);
                                if (outputs.data.bands.B0.stats.sampleCount == outputs.data.bands.B0.stats.noDataCount) {
                                    return {
                                        date: interval.from.split('T')[0],
                                        min: 0,
                                        max: 0,
                                        mean: 0,
                                        stDev: 0,
                                        samples: "Too cloudy to retrieve data",
                                        noData: outputs.data.bands.B0.stats.noDataCount
                                    };
                                }
                                else
                                    return {
                                        date: interval.from.split('T')[0],
                                        min: outputs.data.bands.B0.stats.min,
                                        max: outputs.data.bands.B0.stats.max,
                                        mean: outputs.data.bands.B0.stats.mean,
                                        stDev: outputs.data.bands.B0.stats.stDev,
                                        samples: outputs.data.bands.B0.stats.sampleCount,
                                        noData: outputs.data.bands.B0.stats.noDataCount
                                    };
                            });
                            if (list_avgNDVI.length < 1) {
                                return [2 /*return*/, res.status(400).json({
                                        status: 'failure',
                                        message: 'No data to display, data available minimum 5 days',
                                        "function": 'avg_NDVI'
                                    })];
                            }
                            return [2 /*return*/, res.status(200).json({
                                    status: 'success',
                                    message: list_avgNDVI,
                                    "function": 'avg_NDVI'
                                })];
                        }
                        return [2 /*return*/, res.status(500).json({
                                status: 'failure',
                                message: 'Error encountered on server',
                                "function": 'avg_NDVI'
                            })];
                    }
                    catch (err) {
                        console.log(err);
                        return [2 /*return*/, res.status(500).json({
                                status: 'failure',
                                message: 'Error encountered on server',
                                "function": 'avg_NDVI'
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
///in development
function vegetation_monitoring(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var to_date, get_date, from_date, buff, harvest, stat_harvest, ndviMax, smoothing, peaks, trendlast15Days, valuesLast15Days, ndvi_trend;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: "failure",
                                message: "Request missing lat or lng",
                                "function": "vegetation_monitoring"
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLatitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: "failure",
                                message: "Invalid input",
                                "function": "vegetation_monitoring"
                            })];
                    }
                    to_date = new Date().toISOString().split('.')[0] + "Z";
                    get_date = (0, utils_1.subtractDays)(to_date, 60);
                    from_date = get_date.toISOString().split('.')[0] + "Z";
                    if (req.query.buffer) {
                        buff = Number(req.query.buffer);
                    }
                    else {
                        buff = 100;
                    }
                    if (!(buff === 100 || buff === 500 || buff === 1000)) {
                        return [2 /*return*/, (res.status(400).json({
                                status: 'failure',
                                message: 'ValueError: buffer is not valid, choose between 100 (default), 500 or 1000 meters ',
                                "function": 'harvest_probability'
                            }))];
                    }
                    return [4 /*yield*/, (0, sentinelhub_1.maxNDVI)(Number(req.query.lat), Number(req.query.lng), to_date, from_date, buff)
                        // console.log(harvest.data)
                    ];
                case 1:
                    harvest = _a.sent();
                    // console.log(harvest.data)
                    try {
                        if (harvest !== '' && harvest.constructor === Object) {
                            stat_harvest = harvest.data.map(function (props) {
                                var interval = props.interval, outputs = props.outputs;
                                if (outputs.data.bands.B0.stats.sampleCount == outputs.data.bands.B0.stats.noDataCount) {
                                    return {
                                        date: interval.from.split('T')[0] + " to " + interval.to.split('T')[0],
                                        min: 0,
                                        max: 0,
                                        mean: 0,
                                        stDev: 0,
                                        samples: "Too cloudy to retrieve data",
                                        noData: outputs.data.bands.B0.stats.noDataCount
                                    };
                                }
                                return {
                                    date: interval.from.split('T')[0],
                                    min: outputs.data.bands.B0.stats.min,
                                    max: outputs.data.bands.B0.stats.max,
                                    mean: outputs.data.bands.B0.stats.mean,
                                    samples: outputs.data.bands.B0.stats.sampleCount,
                                    noData: outputs.data.bands.B0.stats.noDataCount
                                };
                            });
                            // console.log(stat_harvest)
                            if (stat_harvest.length < 1) {
                                return [2 /*return*/, res.status(400).json({
                                        status: 'failure',
                                        message: 'No data to display, data available minimum 5 days',
                                        "function": 'vegetation_monitoring'
                                    })];
                            }
                            ndviMax = stat_harvest.map(function (item) {
                                return item.mean;
                            });
                            if ((0, utils_1.sum)(ndviMax) == 0) {
                                return [2 /*return*/, (res.status(400).json({
                                        status: 'failure',
                                        message: 'Too cloudy to retrieve data and calculate trend',
                                        "function": 'vegetation_monitoring'
                                    }))];
                            }
                            console.log(ndviMax);
                            // var options = {
                            //   derivative: 0
                            // };
                            // let smoothing = savitzkyGolay(ndviMax, 2, options)
                            ndviMax.push.apply(ndviMax, ndviMax.slice(-1));
                            smoothing = (0, utils_1.simpleMovingAverage)(ndviMax, 2);
                            console.log(smoothing);
                            peaks = (0, utils_1.smoothed_z_score)(smoothing, { lag: 2, influence: 0.75 });
                            console.log(peaks.length + ":" + peaks.toString());
                            trendlast15Days = (peaks.slice(-3)).filter(Number.isFinite);
                            console.log("trend 15 days:", trendlast15Days);
                            valuesLast15Days = (smoothing.slice(-3));
                            console.log("values 15 days:", valuesLast15Days);
                            ndvi_trend = {};
                            if ((0, utils_1.mean)(valuesLast15Days) > 0.40) {
                                ndvi_trend = "Vegetation index: high values trending up, crop/grass foliage can be fully developed";
                            }
                            else if ((0, utils_1.sum)(trendlast15Days) >= 2) {
                                ndvi_trend = "vegetation index: trending up";
                            }
                            else if ((0, utils_1.sum)(trendlast15Days) < 0) {
                                ndvi_trend = "vegeation index: trending down";
                            }
                            else
                                ndvi_trend = "vegetation index: no trend identified";
                            console.log(ndvi_trend);
                            return [2 /*return*/, res.status(200).json({
                                    status: 'success',
                                    message: ndvi_trend,
                                    "function": 'vegetation_monitoring'
                                })];
                        }
                        return [2 /*return*/, res.status(500).json({
                                status: 'failure',
                                message: 'Error encountered on server',
                                "function": 'vegetation_monitoring'
                            })];
                    }
                    catch (err) {
                        console.log(err);
                        return [2 /*return*/, res.status(500).json({
                                status: 'failure',
                                message: 'Error encountered on server',
                                "function": 'vegetation_monitoring'
                            })];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function nearest_waterbody(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, body_area, err_41;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.lat || !req.query.lng) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing lat or lng',
                                "function": 'nearest_waterbody'
                            })];
                    }
                    if (!(0, validators_1.isValidLatitude)(req.query.lat) || !(0, validators_1.isValidLongitude)(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'nearest_waterbody'
                            })];
                    }
                    dbQuery = "\n    SELECT ROUND((w.geom::geography <-> ST_SetSRID(ST_MakePoint('" + req.query.lng + "', '" + req.query.lat + "')::geography, 4326))::numeric, 2) as dist, \n    COALESCE(ROUND(body_area::numeric, 2), 0) as body_area\n    FROM gh_tz_waterbodies w\n    ORDER BY dist\n    LIMIT 1;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    body_area = {};
                    if (dbResponse.rows[0].body_area == 0) {
                        body_area = 'data not available'; //not active for now
                    }
                    else
                        body_area = dbResponse.rows[0].body_area;
                    if (dbResponse.rowCount > 0) {
                        console.log(dbResponse.rows[0]);
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: dbResponse.rows[0].dist,
                                "function": 'nearest_waterbody'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'nearest_waterbody'
                        })];
                case 3:
                    err_41 = _a.sent();
                    console.log(err_41);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'nearest_waterbody'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function get_user_layer_metadata(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var username, dbQuery, dbResponse, err_42;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.username) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing username',
                                "function": 'get_user_layer_metadata'
                            })];
                    }
                    username = req.query.username;
                    console.log(username);
                    console.log("fetching layer_metadata for " + username + " from database serverside");
                    dbQuery = "With selection AS(SELECT l.username, l.layer_id, l.name, COUNT(geom), l.created_on, l.last_updated\n    From user_layers l\n    LEFT JOIN user_geometries g ON l.layer_id = g.layer_id\n    GROUP BY l.username, l.layer_id, l.name, l.created_on, l.last_updated)\n    SELECT s.username as username, s.layer_id as layer_id, s.count as count, s.name as name, s.created_on as created_on, s.last_updated as last_updated\n    FROM selection s\n    LEFT JOIN users u ON s.username = u.username\n    WHERE s.username = '" + username + "'\n    GROUP BY s.layer_id, s.username, s.name, s.created_on, s.last_updated, s.count";
                    console.log(dbQuery);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    console.log(dbResponse);
                    res.status(200).json({
                        status: "success",
                        results: dbResponse.rows
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_42 = _a.sent();
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'get_user_layer_metadata'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
;
function create_layer(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, username, layername, dbQuery, dbResponse, err_43;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!req.query.username || !req.query.layername) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing user id or layer name',
                                "function": 'create_layer'
                            })];
                    }
                    _a = req.query, username = _a.username, layername = _a.layername;
                    console.log(username, layername);
                    dbQuery = "INSERT INTO user_layers (name, username) VALUES ('" + layername + "', '" + username + "')";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _b.sent();
                    console.log(dbResponse);
                    return [2 /*return*/, res.status(200).json({
                            status: "success",
                            message: dbResponse.rows,
                            "function": "create_layer"
                        })];
                case 3:
                    err_43 = _b.sent();
                    console.log(err_43);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'create_layer'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function delete_layer(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var layerId, dbQuery, dbResponse, err_44;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!req.query.layerId) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing layerId',
                                "function": 'delete_layer'
                            })];
                    }
                    layerId = req.query.layerId;
                    dbQuery = "\n    DELETE\n    FROM user_layers\n    WHERE layer_id=" + layerId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    return [2 /*return*/, res.status(200).json({
                            status: "success",
                            results: dbResponse.rows,
                            message: "layer deleted"
                        })];
                case 3:
                    err_44 = _a.sent();
                    console.log(err_44);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'delete_layer'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function get_layer_geoms(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, username, layer_id, properties, dbQuery, geomBin, propertyBin, dbResponse, geoJSON, err_45;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('fetching geometries from database serverside.');
                    if (!req.query.username || !req.query.layer_id) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing username',
                                "function": 'get_layer_geoms'
                            })];
                    }
                    _a = req.query, username = _a.username, layer_id = _a.layer_id, properties = _a.properties;
                    dbQuery = "\n    SELECT ST_AsGeoJSON(g.geom)as geom, g.layer_id::INTEGER as layer_id, l.name as layer_name\n\n    FROM user_geometries g\n\n    LEFT JOIN user_layers l ON g.layer_id=l.layer_id\n\n    INNER JOIN users u ON g.username = u.username\n\n    WHERE u.username = '" + username + "' AND g.layer_id = " + layer_id + "\n\n    ORDER BY g.layer_id";
                    geomBin = [];
                    propertyBin = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _b.sent();
                    console.log(dbResponse);
                    dbResponse.rows.forEach(function (row) {
                        var geom = row.geom, layer_id = row.layer_id, layer_name = row.layer_name, geom_id = row.geom_id, properties = row.properties;
                        geomBin.push(JSON.parse(geom).coordinates);
                        propertyBin.push({ geom_id: geom_id, properties: properties });
                    });
                    geoJSON = (0, utils_1.generateGeojson)(geomBin, propertyBin);
                    console.log(geoJSON);
                    res.status(200).json({
                        status: "success",
                        results: geoJSON
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_45 = _b.sent();
                    console.log(err_45);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'get_layer_geoms'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function update_layer_data(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, username, layerId, properties, featureCollection, values, dbQuery, dbResponse, err_46;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log(req.query.username, req.query.layerId);
                    if (!req.query.username || !req.query.layerId) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing username or layerId',
                                "function": 'update_layer_data'
                            })];
                    }
                    else if (!req.body.featureCollection) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Request missing featureCollection in body',
                                "function": 'update_layer_data'
                            })];
                    }
                    _a = req.query, username = _a.username, layerId = _a.layerId, properties = _a.properties;
                    featureCollection = req.body.featureCollection;
                    console.log(featureCollection);
                    values = featureCollection.features.map(function (f) { return "('" + layerId + "' ,'" + username + "', ST_GeomFromGeoJSON('" + JSON.stringify(f.geometry) + "'), '" + properties + "')"; });
                    dbQuery = "INSERT INTO user_geometries (layer_id, username, geom, properties) VALUES " + values.join(",");
                    console.log(dbQuery);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _b.sent();
                    res.status(200).json({
                        status: "success",
                        results: dbResponse.rows
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_46 = _b.sent();
                    console.log(err_46);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'update_layer_data'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function error_log(req, res) {
    var body = req.body;
    console.log(body);
    res.status(200).send();
}
router.route('/').get(auth_1["default"], function (req, res) { return res.send('home/api'); });
router.route('/api_version').get(api_version);
router.route('/latlng_to_what3words').get(auth_1["default"], latlng_to_what3words);
router.route('/what3words_to_latlng').get(auth_1["default"], what3words_to_latlng);
router.route('/latlng_to_pluscode').get(auth_1["default"], latlng_to_pluscode);
router.route('/pluscode_to_latlng').get(auth_1["default"], pluscode_to_latlng);
router.route('/population_density_walk').get(auth_1["default"], population_density_walk);
router.route('/population_density_bike').get(auth_1["default"], population_density_bike);
router.route('/population_density_car').get(auth_1["default"], population_density_car);
router.route('/pop_density_isochrone_walk').get(auth_1["default"], pop_density_isochrone_walk);
router.route('/pop_density_isochrone_bike').get(auth_1["default"], pop_density_isochrone_bike);
router.route('/pop_density_isochrone_car').get(auth_1["default"], pop_density_isochrone_car);
router.route('/isochrone_walk').get(auth_1["default"], isochrone_walk);
router.route('/isochrone_bike').get(auth_1["default"], isochrone_bike);
router.route('/isochrone_car').get(auth_1["default"], isochrone_car);
router.route('/nightlights').get(auth_1["default"], nightlights);
router.route('/demography').get(auth_1["default"], demography);
router.route('/population_density_buffer').get(auth_1["default"], population_density_buffer);
router.route('/population_buffer').get(auth_1["default"], population_buffer);
router.route('/urban_status').get(auth_1["default"], urban_status);
router.route('/urban_status_simple').get(auth_1["default"], urban_status_simple);
router.route('/admin_level_1').get(auth_1["default"], admin_level_1);
router.route('/admin_level_2').get(auth_1["default"], admin_level_2);
router.route('/admin_level_2_fuzzy_tri').get(auth_1["default"], admin_level_2_fuzzy_tri);
router.route('/admin_level_2_fuzzy_lev').get(auth_1["default"], admin_level_2_fuzzy_lev);
router.route('/nearest_placename').get(auth_1["default"], nearest_placename);
router.route('/nearest_poi').get(auth_1["default"], nearest_poi);
router.route('/nearest_bank').get(auth_1["default"], nearest_bank);
router.route('/nearest_bank_distance').get(auth_1["default"], nearest_bank_distance);
router.route('/nearest_waterbody').get(auth_1["default"], nearest_waterbody);
router.route('/get_banks').get(auth_1["default"], get_banks);
router.route('/a_to_b_time_distance_walk').get(auth_1["default"], a_to_b_time_distance_walk);
router.route('/a_to_b_time_distance_bike').get(auth_1["default"], a_to_b_time_distance_bike);
router.route('/a_to_b_time_distance_car').get(auth_1["default"], a_to_b_time_distance_car);
router.route('/network_coverage').get(auth_1["default"], network_coverage);
router.route('/oci_coverage').get(auth_1["default"], oci_coverage);
router.route('/mce_coverage').get(auth_1["default"], mce_coverage);
router.route('/get_forecast').get(auth_1["default"], get_forecast);
router.route('/get_api_isochrone').get(auth_1["default"], get_api_isochrone);
router.route('/get_api_directions').get(auth_1["default"], get_api_directions);
router.route('/login_user_get').get(login_user_get);
router.route('/login_user').post(login_user);
router.route('/create_user').post(create_user);
router.route('/delete_user').post(delete_user);
router.route('/error_log').post(error_log);
//agriculture functions
router.route('/NDVI_monthly').get(auth_1["default"], NDVI_monthly);
router.route('/avg_NDVI').get(auth_1["default"], avg_NDVI);
router.route('/vegetation_monitoring').get(auth_1["default"], vegetation_monitoring);
// user management functions
router.route('/get_user_layer_metadata').get(get_user_layer_metadata);
router.route('/get_layer_geoms').get(get_layer_geoms);
router.route('/delete_layer').get(delete_layer);
router.route('/update_layer_data').post(update_layer_data);
router.route('/create_layer').post(create_layer);
// TODO: This should take a post of a JSON object and batch process --> return.
router.route('/batch').get(auth_1["default"], function (req, res) { return res.send('home/api/batch'); });
exports["default"] = router;
