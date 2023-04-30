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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUp = void 0;
const express_1 = require("express");
const helpers_1 = require("./helpers");
const mongo_schema_1 = require("../mongo_schema");
const types_1 = require("./types");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
exports.SignUp = router;
const signUpSchema = {
    firstName: {
        isLength: {
            errorMessage: 'Invalid firstName!',
            // Multiple options would be expressed as an array
            options: { min: 1 },
        },
    },
    lastName: {
        isLength: {
            errorMessage: 'Invalid lastName!',
            // Multiple options would be expressed as an array
            options: { min: 1 },
        },
    },
    // Support bail functionality in schemas
    email: {
        isEmail: {
            bail: true,
            errorMessage: 'Invalid email!',
        },
    },
    password: {
        isLength: {
            errorMessage: 'Password should be at least 8 chars long!',
            // Multiple options would be expressed as an array
            options: { min: 8 },
        },
    },
};
router.post('/', (0, express_validator_1.checkSchema)(signUpSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 1,
            errors: errors.array(),
        });
    }
    // get user
    const user = req.body;
    // Check if user exists
    try {
        const existingUser = yield mongo_schema_1.modelUser.findOne({ email: user.email });
        if (existingUser) {
            return res.status(200).json({
                status: 1,
                error: "There is already a user with this email address!"
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            status: 1,
            step: "Check if user exists",
            error: err,
        });
    }
    // save password encrypted
    const saveUser = Object.assign(Object.assign(Object.assign({}, types_1.defaultUser), user), { password: (0, helpers_1.generateHash)(user.password) });
    // save user
    try {
        yield mongo_schema_1.modelUser.create(saveUser);
    }
    catch (err) {
        return res.status(500).json({
            status: 1,
            step: "Save user",
            error: err,
        });
    }
    return res.json({
        status: 0,
        message: "Created successfully"
    });
}));
//# sourceMappingURL=signup.js.map