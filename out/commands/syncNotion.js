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
exports.syncNotion = void 0;
var convert_name_1 = require("../utils/convert-name");
var writeFileToGithub_1 = require("../utils/writeFileToGithub");
var syncNotion = function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var Client, NotionToMarkdown, notion, pages, n2m, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                Client = require("@notionhq/client").Client;
                NotionToMarkdown = require("notion-to-md").NotionToMarkdown;
                notion = new Client({ auth: process.env.NOTION_API_KEY });
                return [4 /*yield*/, notion.databases.query({
                        database_id: process.env.NOTION_DATABASE_ID,
                        filter: {
                            property: "Type",
                            select: {
                                equals: "Book",
                            },
                        },
                    })];
            case 1:
                pages = (_a.sent()).results;
                n2m = new NotionToMarkdown({ notionClient: notion });
                return [4 /*yield*/, Promise.allSettled(pages.map(function (page) { return __awaiter(void 0, void 0, void 0, function () {
                        var mdblocks;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, n2m.pageToMarkdown(page.id)];
                                case 1:
                                    mdblocks = _a.sent();
                                    return [2 /*return*/, { mdblocks: mdblocks, title: page.properties.Name.title[0].plain_text }];
                            }
                        });
                    }); }))];
            case 2:
                result = _a.sent();
                result.forEach(function (item) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, mdblocks, title, mdString;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                if (!(item.status === "fulfilled")) return [3 /*break*/, 2];
                                _a = item.value, mdblocks = _a.mdblocks, title = _a.title;
                                mdString = n2m.toMarkdownString(mdblocks);
                                return [4 /*yield*/, (0, writeFileToGithub_1.writeFileToGithub)(JSON.stringify(mdString).replace(/\\n/g, " \r\n ").replace(/\"/g, ""), "docs/books/".concat((0, convert_name_1.convertTitleToFileName)(title), ".md"))];
                            case 1:
                                _b.sent();
                                _b.label = 2;
                            case 2: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
        }
    });
}); };
exports.syncNotion = syncNotion;
//# sourceMappingURL=syncNotion.js.map