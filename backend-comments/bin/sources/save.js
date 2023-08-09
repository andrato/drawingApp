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
exports.Save = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.Save = router;
// const signInSchema = {
//     // Support bail functionality in schemas
//     email: {
//         isEmail: { 
//             bail: true, 
//             location: "params",
//         }
//     },
//     password: {
//         isLength: {
//             errorMessage: 'Password should be at least 1 chars long!',
//             // Multiple options would be expressed as an array
//             options: { min: 1 },
//             location: "params",
//         },
//     },
// }
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req;
    console.log(file);
    return res.json({ status: 'logged', message: 'logged' });
}));
