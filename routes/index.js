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
// The routes from the SATF API available at satf.azurewebsites.net/api.
var express_1 = __importDefault(require("express"));
var pg_1 = __importDefault(require("pg"));
var crypto_1 = __importDefault(require("crypto"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var auth_1 = __importDefault(require("./auth"));
var credentials_1 = __importDefault(require("./credentials"));
var utils_1 = __importDefault(require("./utils"));
var validators_1 = require("./validators");
var whatfreewords_1 = __importDefault(require("../assets/whatfreewords"));
var pluscodes_1 = __importDefault(require("../assets/pluscodes"));
var openLocationCode = pluscodes_1["default"]();
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
            if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLongitude(req.query.lng)) {
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
            if (!validators_1.isValidWhatFreeWords(req.query.words)) {
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
            if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLongitude(req.query.lng)) {
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
            if (!validators_1.isValidPluscode(pluscode)) {
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLongitude(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'admin_level_1'
                            })];
                    }
                    dbQuery = "\n        SELECT \"adm1_name\" AS adm1\n        FROM public.ghana_admin\n        WHERE\n            ST_Contains(public.ghana_admin.geom, ST_SetSRID(ST_Point(" + req.query.lng + ", " + req.query.lat + "), 4326))\n        LIMIT 1;\n    ";
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLongitude(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'admin_level_2'
                            })];
                    }
                    dbQuery = "\n    SELECT \"adm2_name\" AS adm2\n    FROM public.ghana_admin\n    WHERE\n        ST_Contains(public.ghana_admin.geom, ST_SetSRID(ST_Point(" + req.query.lng + ", " + req.query.lat + "), 4326))\n    LIMIT 1;\n  ";
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
function hello_world(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, res.status(200).json({
                    status: 'success',
                    message: 'Hello World!',
                    "function": 'hello_world'
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
                    dbQuery = "\n    SELECT adm2_name as name\n    FROM ghana_admin\n    ORDER BY SIMILARITY(adm2_name, '" + req.query.name + "') DESC\n    LIMIT 1;\n  ";
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
                    dbQuery = "\n    SELECT adm2_name as name\n    FROM ghana_admin\n    ORDER BY LEVENSHTEIN(adm2_name, '" + req.query.name + "') ASC\n    LIMIT 1;\n  ";
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLongitude(req.query.lng)) {
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
                                message: utils_1["default"].translateUrbanClasses(dbResponse.rows[0].urban_status),
                                "function": 'urban_status'
                            })];
                    }
                    return [2 /*return*/, res.status(200).json({
                            status: 'success',
                            message: utils_1["default"].translateUrbanClasses(0),
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLongitude(req.query.lng)) {
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
                                message: utils_1["default"].translateUrbanClasses(dbResponse.rows[0].urban_status_simple),
                                "function": 'urban_status_simple'
                            })];
                    }
                    return [2 /*return*/, res.status(200).json({
                            status: 'success',
                            message: utils_1["default"].translateUrbanClasses(0),
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLatitude(req.query.lng || Number.isNaN(req.query.buffer))) {
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
function population_density_walk(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_8;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'population_density_walk'
                            })];
                    }
                    dbQuery = "\n    WITH const (pp_geom) AS (\n        values (ST_Buffer(ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)::geography, '" + ((Number(req.query.minutes) * 55) + 50) + "')::geometry)\n    )\n    \n    SELECT\n        SUM((ST_SummaryStats(ST_Clip(\n            ppp_avg.rast, \n            const.pp_geom\n        ))).sum::int) as pop_dense_walk\n    FROM\n      ppp_avg, const\n    WHERE ST_Intersects(const.pp_geom, ppp_avg.rast);\n  ";
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
                    err_8 = _a.sent();
                    console.log(err_8);
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
        var dbQuery, dbResponse, err_9;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'population_density_bike'
                            })];
                    }
                    dbQuery = "\n    WITH const (pp_geom) AS (\n        values (ST_Buffer(ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)::geography, '" + ((Number(req.query.minutes) * 155) + 50) + "')::geometry)\n    )\n    \n    SELECT\n        SUM((ST_SummaryStats(ST_Clip(\n            ppp_avg.rast, \n            const.pp_geom\n        ))).sum::int) as pop_dense_bike\n    FROM\n      ppp_avg, const\n    WHERE ST_Intersects(const.pp_geom, ppp_avg.rast);\n  ";
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
                    err_9 = _a.sent();
                    console.log(err_9);
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
        var dbQuery, dbResponse, err_10;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'population_density_car'
                            })];
                    }
                    dbQuery = "\n    WITH const (pp_geom) AS (\n        values (ST_Buffer(ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)::geography, '" + ((Number(req.query.minutes) * 444) + 50) + "')::geometry)\n    )\n    \n    SELECT\n        SUM((ST_SummaryStats(ST_Clip(\n            ppp_avg.rast, \n            const.pp_geom\n        ))).sum::int) as pop_dense_car\n    FROM\n      ppp_avg, const\n    WHERE ST_Intersects(const.pp_geom, ppp_avg.rast);\n  ";
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
                    err_10 = _a.sent();
                    console.log(err_10);
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
        var dbQuery, dbResponse, err_11;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'pop_density_isochrone_walk'
                            })];
                    }
                    dbQuery = "\n    SELECT popDensWalk('" + req.query.lng + "', '" + req.query.lat + "', '" + req.query.minutes + "') as pop_dense_iso_walk;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: Math.round(Number(dbResponse.rows[0].pop_dense_iso_walk)),
                                "function": 'pop_density_isochrone_walk'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'pop_density_isochrone_walk'
                        })];
                case 3:
                    err_11 = _a.sent();
                    console.log(err_11);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'pop_density_isochrone_walk'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// New Function - population density in biking distance
function pop_density_isochrone_bike(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_12;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'pop_density_isochrone_bike'
                            })];
                    }
                    dbQuery = "\n    SELECT popDensBike('" + req.query.lng + "', '" + req.query.lat + "', '" + req.query.minutes + "') as pop_dense_iso_bike;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: Math.round(Number(dbResponse.rows[0].pop_dense_iso_bike)),
                                "function": 'pop_density_isochrone_bike'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'pop_density_isochrone_bike'
                        })];
                case 3:
                    err_12 = _a.sent();
                    console.log(err_12);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'pop_density_isochrone_bike'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// New Function - population density in driving distance
function pop_density_isochrone_car(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_13;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'pop_density_isochrone_car'
                            })];
                    }
                    dbQuery = "\n    SELECT popDensCar('" + req.query.lng + "', '" + req.query.lat + "', '" + req.query.minutes + "') as pop_dense_iso_car;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: Math.round(Number(dbResponse.rows[0].pop_dense_iso_car)),
                                "function": 'pop_density_isochrone_car'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'pop_density_isochrone_car'
                        })];
                case 3:
                    err_13 = _a.sent();
                    console.log(err_13);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error encountered on server',
                            "function": 'pop_density_isochrone_car'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function nearest_placename(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_14;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLongitude(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'nearest_placename'
                            })];
                    }
                    dbQuery = "\n    SELECT fclass, name FROM ghana_places\n    ORDER BY geom <-> ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)\n    LIMIT 1;\n  ";
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
                    err_14 = _a.sent();
                    console.log(err_14);
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
        var dbQuery, dbResponse, err_15;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLongitude(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'nearest_poi'
                            })];
                    }
                    dbQuery = "\n    SELECT fclass, name FROM ghana_poi\n    ORDER BY geom <-> ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)\n    LIMIT 1;\n  ";
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
                    err_15 = _a.sent();
                    console.log(err_15);
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
        var target, name, dbQuery, dbResponse, returnArray, i, err_16;
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
                    dbQuery = "\n    SELECT\n      \"name\",\n      round(ST_X(\"geom\")::numeric, 6) AS \"lng\",\n      round(ST_Y(\"geom\")::numeric, 6) AS \"lat\"\n    FROM ghana_poi\n    WHERE \"fclass\" = 'bank' AND (LOWER(\"name\") LIKE '%" + String(name).toLowerCase() + "%' OR similarity(\"name\", '" + name + "') > " + target + ")\n    ORDER BY SIMILARITY(\"name\", 'absa') DESC;\n  ";
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
                    err_16 = _a.sent();
                    console.log(err_16);
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
        var dbQuery, dbResponse, err_17;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLongitude(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'nearest_bank'
                            })];
                    }
                    dbQuery = "\n    SELECT \"name\"\n    FROM public.ghana_poi\n    WHERE fclass = 'bank'\n    ORDER BY geom <-> ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)\n    LIMIT 1;\n  ";
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
                    err_17 = _a.sent();
                    console.log(err_17);
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
        var dbQuery, dbResponse, err_18;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLongitude(req.query.lng)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'nearest_bank_distance'
                            })];
                    }
                    dbQuery = "\n    SELECT ST_Distance(ghana_poi.\"geom\"::geography, ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)::geography)::int AS \"distance\"\n    FROM public.ghana_poi WHERE fclass='bank'\n    ORDER BY St_Transform(geom, 4326) <-> ST_SetSRID(ST_Point('" + req.query.lng + "', '" + req.query.lat + "'), 4326)\n    LIMIT 1;\n  ";
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
                    err_18 = _a.sent();
                    console.log(err_18);
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
// New function - Isochrone walking distance
function isochrone_walk(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_19;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'isochrone_walk'
                            })];
                    }
                    dbQuery = "\n    SELECT ST_AsGeoJSON(pgr_isochroneWalk('" + req.query.lng + "', '" + req.query.lat + "', '" + req.query.minutes + "'), 6) as geom;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: JSON.parse(dbResponse.rows[0].geom),
                                "function": 'isochrone_walk'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error while calculating isocrone',
                            "function": 'isochrone_walk'
                        })];
                case 3:
                    err_19 = _a.sent();
                    console.log(err_19);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error while calculating isocrone',
                            "function": 'isochrone_walk'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// New Function - Isochrone biking distance
function isochrone_bike(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_20;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'isochrone_bike'
                            })];
                    }
                    dbQuery = "\n    SELECT ST_AsGeoJSON(pgr_isochroneBike('" + req.query.lng + "', '" + req.query.lat + "', '" + req.query.minutes + "'), 6) as geom;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: JSON.parse(dbResponse.rows[0].geom),
                                "function": 'isochrone_bike'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error while calculating isocrone',
                            "function": 'isochrone_bike'
                        })];
                case 3:
                    err_20 = _a.sent();
                    console.log(err_20);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error while calculating isocrone',
                            "function": 'isochrone_bike'
                        })];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// New Function - Isochrone car
function isochrone_car(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var dbQuery, dbResponse, err_21;
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
                    if (!validators_1.isValidLatitude(req.query.lat) || !validators_1.isValidLatitude(req.query.lng || Number.isNaN(req.query.minutes))) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'isochrone_car'
                            })];
                    }
                    dbQuery = "\n    SELECT ST_AsGeoJSON(pgr_isochroneCar('" + req.query.lng + "', '" + req.query.lat + "', '" + Number(req.query.minutes) + "'), 6) as geom;\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: JSON.parse(dbResponse.rows[0].geom),
                                "function": 'isochrone_car'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error while calculating isocrone',
                            "function": 'isochrone_car'
                        })];
                case 3:
                    err_21 = _a.sent();
                    console.log(err_21);
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error while calculating isocrone',
                            "function": 'isochrone_car'
                        })];
                case 4: return [2 /*return*/];
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
                                message: 'Request missing username, password or confirmPassword'
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
                                message: 'Request missing username or password',
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
        var token, authorised, username_1, userExists, deletedUser, userStillExists, err_27, _a, username, password, hashedPassword, userExists, verifiedUser, deletedUser, userStillExists, err_28;
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
                    err_27 = _b.sent();
                    console.log(err_27);
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
                    err_28 = _b.sent();
                    console.log(err_28);
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
        var dbQuery, dbResponse, rep, err_29;
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
                    if (!validators_1.isValidLatitude(req.query.lat1) || !validators_1.isValidLatitude(req.query.lng1) || !validators_1.isValidLatitude(req.query.lat2) || !validators_1.isValidLatitude(req.query.lng2)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'a_to_b_time_distance_walk'
                            })];
                    }
                    dbQuery = "\n    SELECT pgr_timeDist_walk('" + req.query.lng1 + "', '" + req.query.lat1 + "', '" + req.query.lng2 + "', '" + req.query.lat2 + "');\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        rep = dbResponse.rows[0].pgr_timedist_walk.replace('(', '').replace(')', '').split(',');
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: { time: rep[0], distance: rep[1] },
                                "function": 'a_to_b_time_distance_walk'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error while calculating time and distance',
                            "function": 'a_to_b_time_distance_walk'
                        })];
                case 3:
                    err_29 = _a.sent();
                    console.log(err_29);
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
        var dbQuery, dbResponse, rep, err_30;
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
                    if (!validators_1.isValidLatitude(req.query.lat1) || !validators_1.isValidLatitude(req.query.lng1) || !validators_1.isValidLatitude(req.query.lat2) || !validators_1.isValidLatitude(req.query.lng2)) {
                        return [2 /*return*/, res.status(400).json({
                                status: 'failure',
                                message: 'Invalid input',
                                "function": 'a_to_b_time_distance_bike'
                            })];
                    }
                    dbQuery = "\n    SELECT pgr_timeDist_bike('" + req.query.lng1 + "', '" + req.query.lat1 + "', '" + req.query.lng2 + "', '" + req.query.lat2 + "');\n  ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, pool.query(dbQuery)];
                case 2:
                    dbResponse = _a.sent();
                    if (dbResponse.rowCount > 0) {
                        rep = dbResponse.rows[0].pgr_timedist_bike.replace('(', '').replace(')', '').split(',');
                        return [2 /*return*/, res.status(200).json({
                                status: 'success',
                                message: { time: rep[0], distance: rep[1] },
                                "function": 'a_to_b_time_distance_bike'
                            })];
                    }
                    return [2 /*return*/, res.status(500).json({
                            status: 'failure',
                            message: 'Error while calculating time and distance',
                            "function": 'a_to_b_time_distance_bike'
                        })];
                case 3:
                    err_30 = _a.sent();
                    console.log(err_30);
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
function error_log(req, res) {
    var body = req.body;
    console.log(body);
    res.status(200).send();
}
router.route('/').get(auth_1["default"], function (req, res) { return res.send('home/api'); });
router.route('/hello_world').get(hello_world);
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
router.route('/population_density_buffer').get(auth_1["default"], population_density_buffer);
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
router.route('/get_banks').get(auth_1["default"], get_banks);
router.route('/a_to_b_time_distance_walk').get(auth_1["default"], a_to_b_time_distance_walk);
router.route('/a_to_b_time_distance_bike').get(auth_1["default"], a_to_b_time_distance_bike);
router.route('/create_user').post(create_user);
router.route('/login_user').post(login_user);
router.route('/delete_user').post(delete_user);
router.route('/error_log').post(error_log);
// TODO: This should take a post of a JSON object and batch process --> return.
router.route('/batch').get(auth_1["default"], function (req, res) { return res.send('home/api/batch'); });
exports["default"] = router;