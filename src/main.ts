import * as core from '@actions/core'
import axios from 'axios'
import { escapers } from '@telegraf/entity'

export async function run(): Promise<void> {
  try {
    const botToken = core.getInput('bot-token', { required: true })
    const chatId = core.getInput('chat-id', { required: true })
    const repository = process.env['GITHUB_REPOSITORY']!
    const [, repositoryName] = repository.split('/')
    const repositoryUrl = `https://github.com/${repository}`

    core.info(`📧️ Sending Telegram message with workflow status`)

    const message = `*🚀 GitHub Actions Workflow*\n` +
      `Repository: 🔗 [${escapers.MarkdownV2(repositoryName)}](${escapers.MarkdownV2(repositoryUrl)})\n` +
      `${getRefDescription(repositoryUrl)}\n` +
      `Status: ${getStatusMessage(repositoryUrl)}`

    await axios.get(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      params: {
        chat_id: chatId,
        text: message,
        parse_mode: 'MarkdownV2',
        disable_web_page_preview: true,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error)
    } else {
      core.setFailed(`⚠️ Unexpected error: '${error as string}'`)
    }
  }
}

function getRefDescription(repositoryUrl: string): string {
  const ref = process.env['GITHUB_REF']!

  if (ref.startsWith('refs/tags/')) {
    const tag = ref.replace('refs/tags/', '')
    return `Tag: 🎯 [${escapers.MarkdownV2(tag)}](${escapers.MarkdownV2(`${repositoryUrl}/releases/tag/${tag}`)})`
  }

  if (ref.startsWith('refs/heads/')) {
    const branch = ref.replace('refs/heads/', '')
    return `Branch: 🔀 [${escapers.MarkdownV2(branch)}](${repositoryUrl}/tree/${branch})`
  }

  if (ref.startsWith('refs/pull/')) {
    const pullRequest = ref.replace('refs/pull/', '').replace('/merge', '')
    return `PR: 🔀 [${escapers.MarkdownV2(`#${pullRequest}`)}](${repositoryUrl}/pull/${pullRequest})`
  }

  return ''
}

function getStatusMessage(repositoryUrl: string): string {
  const runId = process.env['GITHUB_RUN_ID']!
  const url = `${repositoryUrl}/actions/runs/${runId}`

  switch (core.getInput('job-status', { required: true })) {
    case 'success':
      return `✅ [Success](${url})`
    case 'failure':
      return `🚫 [Failure](${url})`
    case 'cancelled':
      return `❌ [Cancelled](${url})`
    default:
      return `⚠️ [Undefined](${url})`
  }
}
