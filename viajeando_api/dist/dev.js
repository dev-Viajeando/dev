#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dev_ts_1 = __importDefault(require("$fresh/dev.ts"));
const fresh_config_js_1 = __importDefault(require("./fresh.config.js"));
require("$std/dotenv/load.ts");
await (0, dev_ts_1.default)(import.meta.url, "./main.ts", fresh_config_js_1.default);
