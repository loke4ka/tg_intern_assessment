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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.Telegram = void 0;
var user_1 = require("../../db/user");
var mark_1 = require("../../db/mark");
var mark_2 = require("../../data/mark");
var user_2 = require("../../data/user");
var Telegram = /** @class */ (function () {
    function Telegram() {
    }
    Telegram.startHandler = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var message, chatId, firstName, lastName, existingUser, newUser, users, inlineKeyboards, _i, users_1, user, inlineKeyboard;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        message = ctx.message;
                        chatId = message.chat.id;
                        firstName = message.from.first_name;
                        lastName = message.from.last_name;
                        return [4 /*yield*/, user_2.UserData.getUserByChatId(chatId)];
                    case 1:
                        existingUser = _a.sent();
                        if (!existingUser) return [3 /*break*/, 2];
                        ctx.reply('Вы уже зарегистрированы!');
                        return [3 /*break*/, 4];
                    case 2:
                        newUser = new user_1.User({ chatId: chatId, firstName: firstName, lastName: lastName });
                        return [4 /*yield*/, user_2.UserData.saveUser(newUser)];
                    case 3:
                        _a.sent();
                        ctx.reply('Регистрация успешно завершена!');
                        _a.label = 4;
                    case 4:
                        if (!(existingUser && existingUser.role === 'admin')) return [3 /*break*/, 6];
                        ctx.reply('Вы администратор!');
                        return [4 /*yield*/, user_2.UserData.getAllUsers()];
                    case 5:
                        users = _a.sent();
                        inlineKeyboards = [];
                        for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                            user = users_1[_i];
                            inlineKeyboard = [
                                {
                                    text: "".concat((user === null || user === void 0 ? void 0 : user.firstName) || "", " ").concat((user === null || user === void 0 ? void 0 : user.lastName) || ""),
                                    callback_data: "mark_".concat(user.chatId)
                                }
                            ];
                            inlineKeyboards.push(inlineKeyboard);
                        }
                        ctx.reply('Выберите пользователя:', {
                            reply_markup: {
                                inline_keyboard: inlineKeyboards
                            },
                        });
                        console.log(ctx.callback_query);
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Telegram.markIntern = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var callbackQuery, userName, evaluatorId, regExp, userChatId, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        callbackQuery = ctx.callbackQuery;
                        userName = callbackQuery.data;
                        evaluatorId = ctx.from.id;
                        regExp = /mark_/g;
                        userChatId = userName.replace(regExp, '');
                        console.log(userChatId);
                        return [4 /*yield*/, user_2.UserData.getUserByChatId(userChatId)];
                    case 1:
                        user = _a.sent();
                        ctx.session.user = user;
                        ctx.session.evaluatorId = evaluatorId;
                        ctx.session.step = 0;
                        this.nextCategory(ctx);
                        return [2 /*return*/];
                }
            });
        });
    };
    Telegram.nextCategory = function (ctx) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var session, categories, currentStep, currentCategory;
            return __generator(this, function (_c) {
                session = ctx.session;
                categories = ['Functional', 'UI/UX', 'Code'];
                currentStep = session.step || 0;
                if (currentStep >= categories.length) {
                    ctx.reply('Вы оценили все категории!');
                    this.showTopUsers(ctx);
                    return [2 /*return*/];
                }
                currentCategory = categories[currentStep];
                session.currentCategory = currentCategory;
                session.step = currentStep + 1;
                try {
                    ctx.reply("\u041E\u0446\u0435\u043D\u0438\u0442\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F ".concat(((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.firstName) || "", " ").concat(((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.lastName) || "", " \u043F\u043E 10-\u0431\u0430\u043B\u043B\u044C\u043D\u043E\u0439 \u0448\u043A\u0430\u043B\u0435 \u0434\u043B\u044F \u043A\u0430\u0442\u0435\u0433\u043E\u0440\u0438\u0438 ").concat(currentCategory, "."));
                }
                catch (e) {
                    console.log(e);
                }
                return [2 /*return*/];
            });
        });
    };
    Telegram.putMark = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var message, session, markValue, user, evaluatorId, currentCategory, mark;
            return __generator(this, function (_a) {
                message = ctx.message, session = ctx.session;
                markValue = parseInt(message.text, 10);
                if (isNaN(markValue) || markValue < 1 || markValue > 10) {
                    ctx.reply('Пожалуйста, введите числовую оценку от 1 до 10.');
                    return [2 /*return*/];
                }
                user = session.user, evaluatorId = session.evaluatorId, currentCategory = session.currentCategory;
                if (!user || !evaluatorId || !currentCategory) {
                    ctx.reply('Произошла ошибка. Пожалуйста, попробуйте снова.');
                    return [2 /*return*/];
                }
                mark = new mark_1.Mark({
                    userMarkId: user.chatId,
                    adminMarkId: evaluatorId,
                    markType: currentCategory,
                    mark: markValue,
                });
                mark_2.MarkData.saveMark(mark);
                this.nextCategory(ctx);
                return [2 /*return*/];
            });
        });
    };
    Telegram.showTopUsers = function (ctx) {
        return __awaiter(this, void 0, void 0, function () {
            var topUsers, resultMessage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, mark_2.MarkData.topInternByMarkSum()];
                    case 1:
                        topUsers = _a.sent();
                        if (topUsers.length > 0) {
                            resultMessage = topUsers
                                .map(function (user, index) { return "".concat(index + 1, ". ").concat((user === null || user === void 0 ? void 0 : user.firstName) || "", " ").concat((user === null || user === void 0 ? void 0 : user.lastName) || "", ": ").concat(user.totalRating); })
                                .join('\n');
                            ctx.reply("\u0422\u043E\u043F \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439 \u043F\u043E \u043D\u0430\u0438\u0432\u044B\u0441\u0448\u0435\u0439 \u043E\u0446\u0435\u043D\u043A\u0435:\n\n".concat(resultMessage));
                        }
                        else {
                            ctx.reply('Нет данных для отображения');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Telegram;
}());
exports.Telegram = Telegram;
