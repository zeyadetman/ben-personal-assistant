"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DecoratorBot = exports.ConcreteBot = void 0;
var ConcreteBot = /** @class */ (function () {
    function ConcreteBot(bot) {
        this.bot = bot;
    }
    ConcreteBot.prototype.launch = function () {
        this.bot.launch();
    };
    return ConcreteBot;
}());
exports.ConcreteBot = ConcreteBot;
var DecoratorBot = /** @class */ (function () {
    function DecoratorBot(component) {
        this.component = component;
        this.bot = this.component.bot;
    }
    DecoratorBot.prototype.launch = function () {
        this.component.launch();
    };
    return DecoratorBot;
}());
exports.DecoratorBot = DecoratorBot;
//# sourceMappingURL=index.js.map