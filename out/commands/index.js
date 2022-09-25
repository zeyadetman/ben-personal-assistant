"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotWithCommands = void 0;
var decorator_1 = require("../decorator");
var help_1 = require("./help");
var start_1 = require("./start");
var syncIMDB_1 = require("./syncIMDB");
var syncNotion_1 = require("./syncNotion");
var BotWithCommands = /** @class */ (function (_super) {
    __extends(BotWithCommands, _super);
    function BotWithCommands() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BotWithCommands.prototype.setCommands = function (bot) {
        bot.hears("hi", function (ctx) { return ctx.reply("Hey there"); });
        bot.command("syncIMDB", syncIMDB_1.syncIMDB);
        bot.command("syncNotion", syncNotion_1.syncNotion);
        bot.start(start_1.start);
        bot.help(help_1.help);
        bot.on("sticker", function (ctx) { return ctx.reply("👍"); });
    };
    BotWithCommands.prototype.launch = function () {
        this.setCommands(this.bot);
        _super.prototype.launch.call(this);
    };
    return BotWithCommands;
}(decorator_1.DecoratorBot));
exports.BotWithCommands = BotWithCommands;
//# sourceMappingURL=index.js.map