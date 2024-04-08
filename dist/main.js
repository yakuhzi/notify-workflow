"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        try {
            const jobStatus = (_a = core.getInput('job-status')) !== null && _a !== void 0 ? _a : process.env.INPUT_JOB_STATUS;
            let statusMessage = 'Undefined ❎';
            switch (jobStatus) {
                case 'success':
                    statusMessage = 'Success ✅';
                    break;
                case 'failure':
                    statusMessage = 'Failure 🚫';
                    break;
                case 'cancelled':
                    statusMessage = 'Cancelled ❌';
                    break;
            }
            let ref = process.env.GITHUB_REF;
            let tag;
            if (ref === null || ref === void 0 ? void 0 : ref.startsWith('refs/tags/')) {
                tag = ref.replace('refs/tags/', '');
                ref = `\nTag: ${tag}`;
            }
            else if (ref === null || ref === void 0 ? void 0 : ref.startsWith('refs/heads/')) {
                ref = `\nBranch: ${ref.replace('refs/heads/', '')}`;
            }
            else {
                ref = '';
            }
            const botToken = (_b = core.getInput('bot-token')) !== null && _b !== void 0 ? _b : process.env.INPUT_BOT_TOKEN;
            const chatId = (_c = core.getInput('chat-id')) !== null && _c !== void 0 ? _c : process.env.INPUT_CHAT_ID;
            const repository = process.env.GITHUB_REPOSITORY;
            const workflow = process.env.GITHUB_WORKFLOW;
            const runId = process.env.GITHUB_RUN_ID;
            const runNumber = process.env.GITHUB_RUN_NUMBER;
            const commit = process.env.GITHUB_SHA;
            const checkURL = `https://github.com/${repository}/commit/${commit}/checks`;
            console.log(`📧️ Sending Telegram message to chat '${chatId}'`);
            yield axios_1.default.get(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                params: {
                    chat_id: chatId,
                    text: `*GitHub Actions Workflow*\nStatus: ${statusMessage}\nRepository: https://github.com/${repository}` +
                        `${ref}\nWorkflow: ${workflow} - ${runId} (${runNumber})\nChecks: ${checkURL}`,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true,
                },
            });
        }
        catch (error) {
            if (error instanceof Error) {
                core.setFailed(error.message);
            }
            else {
                core.setFailed(`⚠️ Unexpected error: '${error}'`);
            }
        }
    });
}
run();
//# sourceMappingURL=main.js.map