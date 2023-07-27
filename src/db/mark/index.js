"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mark = void 0;
var mongoose_1 = require("mongoose");
var markSchema = new mongoose_1.Schema({
    userMarkId: { type: Number, required: true },
    adminMarkId: { type: Number, required: true },
    markType: { type: String, required: true },
    mark: { type: Number, required: true, default: 0 },
    datetime: { type: Date, default: Date.now },
});
exports.Mark = (0, mongoose_1.model)("Mark", markSchema);
