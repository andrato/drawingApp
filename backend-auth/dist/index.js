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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./src/api/routes"));
dotenv_1.default.config();
/* connect to mongo */
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield mongoose_1.default.connect((_a = process.env.MONGO_URL_TEST) !== null && _a !== void 0 ? _a : "");
        console.log("Mongo successfully connected");
    }
    catch (err) {
        console.log("Mongo error connection user auth: " + err);
    }
}))();
/* app */
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
// define app routes
app.use(routes_1.default);
app.listen(process.env.PORT, () => { console.log(`Listening on port ${process.env.PORT}`); });
