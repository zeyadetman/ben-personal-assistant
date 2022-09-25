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
exports.BotWithEvents = void 0;
var decorator_1 = require("../decorator");
var document_1 = require("./document");
var BotWithEvents = /** @class */ (function (_super) {
    __extends(BotWithEvents, _super);
    function BotWithEvents() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BotWithEvents.prototype.setEvents = function (bot) {
        bot.on("document", document_1.documentEvent);
        bot.on("sticker", function (ctx) { return ctx.reply("👍"); });
    };
    BotWithEvents.prototype.launch = function () {
        this.setEvents(this.bot);
        _super.prototype.launch.call(this);
    };
    return BotWithEvents;
}(decorator_1.DecoratorBot));
exports.BotWithEvents = BotWithEvents;
//# sourceMappingURL=index.js.map