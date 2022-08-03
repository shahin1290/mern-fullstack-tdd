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
exports.Schemas = exports.ValidateJoi = void 0;
const joi_1 = __importDefault(require("joi"));
const Logging_1 = __importDefault(require("../library/Logging"));
const ValidateJoi = (schema) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield schema.validateAsync(req.body);
            next();
        }
        catch (error) {
            Logging_1.default.error(error);
            return res.status(422).json({ error });
        }
    });
};
exports.ValidateJoi = ValidateJoi;
exports.Schemas = {
    author: {
        create: joi_1.default.object({
            name: joi_1.default.string().required()
        }),
        update: joi_1.default.object({
            name: joi_1.default.string().required()
        })
    },
    book: {
        create: joi_1.default.object({
            author: joi_1.default.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            title: joi_1.default.string().required()
        }),
        update: joi_1.default.object({
            author: joi_1.default.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            title: joi_1.default.string().required()
        })
    }
};
