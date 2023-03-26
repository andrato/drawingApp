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
    // Support bail functionality in schemas
    email: {
        isEmail: {
            bail: true,
            location: "params",
        }
    },
    password: {
        isLength: {
            errorMessage: 'Password should be at least 1 chars long!',
            // Multiple options would be expressed as an array
            options: { min: 1 },
            location: "params",
        },
    },
};
router.get('/', (0, express_validator_1.checkSchema)(signInSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 1,
            errors: errors.array(),
        });
    }
    const user = {
        email: req.query.email,
        password: req.query.password,
    };
    let existingUser;
    // find user in DB
    try {
        existingUser = yield mongo_schema_1.modelUser.findOne({ email: user.email });
        if (!existingUser || (!(0, helpers_1.comparePassword)(user.password, existingUser.password))) {
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
    // authenticate user
    const accessToken = jsonwebtoken_1.default.sign(user, process.env.ACCESS_TOKEN_SECRET);
    return res.json({
        status: 0,
        accessToken: accessToken,
        user: {
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            profile: (_a = existingUser.profile) !== null && _a !== void 0 ? _a : null,
            email: existingUser.profile,
            created: existingUser.created,
            lastUpdated: existingUser.lastUpdated,
        },
    });
}));
//# sourceMappingURL=signin.js.map