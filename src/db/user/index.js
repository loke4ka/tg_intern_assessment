"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = require("mongoose");
var userSchema = new mongoose_1.Schema({
    chatId: { type: Number, required: true, unique: true },
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    role: { type: String, default: "intern" },
});
exports.User = (0, mongoose_1.model)("User", userSchema);
