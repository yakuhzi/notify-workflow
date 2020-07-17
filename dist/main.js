"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const axios_1 = __importDefault(require("axios"));
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let status = 'Undefined ❎';
            switch (process.env.INPUT_JOB_STATUS) {
                case 'success':
                    status = 'Success ✅';
                    break;
                case 'failure':
                    status = 'Failure 🚫';
                    break;
                case 'cancelled':
                    status = 'Cancelled ❌';
                    break;
            }
            const repository = process.env.GITHUB_REPOSITORY;
            const tag = (_a = process.env.GITHUB_REF) === null || _a === void 0 ? void 0 : _a.replace('refs/tags/', '');
            const workflow = process.env.GITHUB_WORKFLOW;
            const runId = process.env.GITHUB_RUN_ID;
            const runNumber = process.env.GITHUB_RUN_NUMBER;
            const commit = process.env.GITHUB_SHA;
            const checkURL = `https://github.com/${repository}/commit/${commit}/checks`;
            yield axios_1.default.get(`https://api.telegram.org/bot${process.env.INPUT_BOT_TOKEN}/sendMessage`, {
                params: {
                    chat_id: process.env.INPUT_CHAT_ID,
                    text: `*GitHub Actions Workflow*\nStatus: ${status}\nRepository: https://github.com/${repository}` +
                        `${tag ? `\nTag: ${tag}` : ''}\nWorkflow: ${workflow} - ${runId} (${runNumber})\nChecks: ${checkURL}`,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true,
                },
            });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
//# sourceMappingURL=main.js.map