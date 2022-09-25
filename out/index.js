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
exports.octokit = void 0;
var telegraf_1 = require("telegraf");
var dotenv = require("dotenv");
var octokit_1 = require("octokit");
var commands_1 = require("./commands");
var decorator_1 = require("./decorator");
var events_1 = require("./events");
dotenv.config();
exports.octokit = new octokit_1.Octokit({
    auth: process.env.GITHUB_TOKEN,
});
var BotWithStop = /** @class */ (function (_super) {
    __extends(BotWithStop, _super);
    function BotWithStop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BotWithStop.prototype.enableGracefulStop = function () {
        var _this = this;
        process.once("SIGINT", function () { return _this.bot.stop("SIGINT"); });
        process.once("SIGTERM", function () { return _this.bot.stop("SIGTERM"); });
    };
    BotWithStop.prototype.launch = function () {
        this.enableGracefulStop();
        _super.prototype.launch.call(this);
    };
    return BotWithStop;
}(decorator_1.DecoratorBot));
var simple = new decorator_1.ConcreteBot(new telegraf_1.Telegraf(process.env.BOT_TOKEN));
var botWithEvents = new events_1.BotWithEvents(simple);
var botWithCommands = new commands_1.BotWithCommands(botWithEvents);
botWithCommands.launch();
//# sourceMappingURL=index.js.map