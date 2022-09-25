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
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentEvent = void 0;
var syncIMDB_1 = require("../commands/syncIMDB");
var constants_1 = require("../utils/constants");
var writeFileToGithub_1 = require("../utils/writeFileToGithub");
var documentEvent = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var dataWithRate, error_1;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                if (!(((_b = (_a = ctx.update.message) === null || _a === void 0 ? void 0 : _a.reply_to_message) === null || _b === void 0 ? void 0 : _b.text) ===
                    constants_1.REQUEST_IMDB_EXPORTED_FILE_MESSAGE)) return [3 /*break*/, 6];
                _c.label = 1;
            case 1:
                _c.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, syncIMDB_1.getDataWithRate)(ctx)];
            case 2:
                dataWithRate = _c.sent();
                ctx.reply("Please wait while I'm syncing your watchlist...");
                return [4 /*yield*/, (0, writeFileToGithub_1.writeFileToGithub)(JSON.stringify(dataWithRate), "src/data/imdb.json")];
            case 3:
                _c.sent();
                ctx.reply("done! 🎉");
                return [3 /*break*/, 5];
            case 4:
                error_1 = _c.sent();
                ctx.reply("Error: " + error_1.message);
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 7];
            case 6:
                ctx.reply("ايه يا زوز اومال لو مكنتش انت اللي عاملني 😂😂😂 انت باعت فايل من غير ما تقول ده لايه");
                _c.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.documentEvent = documentEvent;
//# sourceMappingURL=document.js.map