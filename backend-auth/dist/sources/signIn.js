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
exports.SignIn = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helpers_1 = require("./helpers");
const mongo_schema_1 = require("../mongo_schema");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
exports.SignIn = router;
const signInSchema = {
    email: {
        isEmail: {
            errorMessage: 'Email is wrong or missing!',
            bail: true,
            location: "params",
        }
    },
    password: {
        isLength: {
            errorMessage: 'Password is wrong or missing!',
            options: { min: 1 },
            location: "params",
        },
    },
};
router.get('/', (0, express_validator_1.checkSchema)(signInSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log("eroare aici");
        return res.status(400).json({
            status: 1,
            errors: errors.array(),
        });
    }
    const user = {
        email: req.query.email,
        password: req.query.password,
    };
    let existingAuthUser;
    // find user in DB
    try {
        existingAuthUser = yield mongo_schema_1.modelUserAuth.findOne({ email: user.email });
        if (!existingAuthUser || (!(0, helpers_1.comparePassword)(user.password, existingAuthUser.password))) {
            return res.status(200).json({
                status: 1,
                error: "Wrong credentials! If you don't have an account you can register now!"
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            status: 1,
            error: err,
        });
    }
    let existingUser;
    try {
        existingUser = yield mongo_schema_1.modelUserInfo.findOne({ email: user.email });
        if (!existingUser) {
            console.log("an error occured with the existing user info");
        }
        console.log("nicio eroare");
    }
    catch (err) {
        return res.status(500).json({
            status: 1,
            error: err,
        });
    }
    // authenticate user
    const accessToken = jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET);
    return res.json({
        status: 0,
        accessToken: accessToken,
        user: {
            id: existingUser === null || existingUser === void 0 ? void 0 : existingUser._id,
            firstName: existingUser === null || existingUser === void 0 ? void 0 : existingUser.firstName,
            lastName: existingUser === null || existingUser === void 0 ? void 0 : existingUser.lastName,
            profile: (_a = existingUser === null || existingUser === void 0 ? void 0 : existingUser.profile) !== null && _a !== void 0 ? _a : null,
            email: (_b = existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) !== null && _b !== void 0 ? _b : existingAuthUser.email,
            created: (_c = existingUser === null || existingUser === void 0 ? void 0 : existingUser.created) !== null && _c !== void 0 ? _c : existingAuthUser.created,
            lastUpdated: (_d = existingUser === null || existingUser === void 0 ? void 0 : existingUser.lastUpdated) !== null && _d !== void 0 ? _d : existingAuthUser.lastUpdated,
            isAdmin: existingAuthUser.isAdmin,
        },
    });
}));
//# sourceMappingURL=signin.js.map