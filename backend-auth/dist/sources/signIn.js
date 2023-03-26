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
const schema_1 = require("../schema");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
exports.SignIn = router;
const signInSchema = {
    // Support bail functionality in schemas
    email: {
        isEmail: { bail: true, }
    },
    password: {
        isLength: {
            errorMessage: 'Password should be at least 8 chars long!',
            // Multiple options would be expressed as an array
            options: { min: 8 },
        },
    },
};
router.get('/', (0, express_validator_1.checkSchema)(signInSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 1,
            errors: errors.array(),
        });
    }
    const user = req.body;
    // find user in DB
    try {
        const existingUser = yield schema_1.modelUser.findOne({ email: user.email });
        if (!existingUser || (!(0, helpers_1.comparePassword)(user.password, existingUser.password))) {
            return res.status(400).json({
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
    // authenticate user
    const accessToken = jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET);
    return res.json({
        status: 0,
        accessToken: accessToken
    });
}));
