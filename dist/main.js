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
const axios_1 = __importDefault(require("axios"));
const core_1 = __importDefault(require("@actions/core"));
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
                        `\n${tag ? `Tag: ${tag}` : ''}\nWorkflow: ${workflow} - ${runId} (${runNumber})\nChecks: ${checkURL}`,
                    parse_mode: 'Markdown',
                    disable_web_page_preview: true,
                },
            });
        }
        catch (error) {
            core_1.default.setFailed(error.message);
        }
    });
}
run();
//# sourceMappingURL=main.js.map