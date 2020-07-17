import axios from 'axios'
import core from '@actions/core'

async function run(): Promise<void> {
  try {
    let status = 'Undefined ❎'

    switch (process.env.INPUT_JOB_STATUS) {
      case 'success': status = 'Success ✅'
        break
      case 'failure': status = 'Failure 🚫'
        break
      case 'cancelled': status = 'Cancelled ❌'
        break
    }

    const repository = process.env.GITHUB_REPOSITORY
    const tag = process.env.GITHUB_REF?.replace('refs/tags/', '')
    const workflow = process.env.GITHUB_WORKFLOW
    const runId = process.env.GITHUB_RUN_ID
    const runNumber = process.env.GITHUB_RUN_NUMBER
    const commit = process.env.GITHUB_SHA
    const checkURL = `https://github.com/${repository}/commit/${commit}/checks`

    await axios.get(`https://api.telegram.org/bot${process.env.INPUT_BOT_TOKEN}/sendMessage`, {
      params: {
        chat_id: process.env.INPUT_CHAT_ID,
        text: `*GitHub Actions Workflow*\nStatus: ${status}\nRepository: https://github.com/${repository}` +
          `\n${tag ? `Tag: ${tag}` : ''}\nWorkflow: ${workflow} - ${runId} (${runNumber})\nChecks: ${checkURL}`,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      },
    })

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
