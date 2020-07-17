import * as core from '@actions/core'
import axios from 'axios'

async function run(): Promise<void> {
  try {
    let status = 'Undefined ❎'

    switch (process.env.INPUT_JOB_STATUS) {
      case 'success':
        status = 'Success ✅'
        break
      case 'failure':
        status = 'Failure 🚫'
        break
      case 'cancelled':
        status = 'Cancelled ❌'
        break
    }

    const repository = process.env.GITHUB_REPOSITORY
    const workflow = process.env.GITHUB_WORKFLOW
    const runId = process.env.GITHUB_RUN_ID
    const runNumber = process.env.GITHUB_RUN_NUMBER
    const commit = process.env.GITHUB_SHA
    const checkURL = `https://github.com/${repository}/commit/${commit}/checks`

    let tag = process.env.GITHUB_REF

    if (tag?.startsWith('refs/tags/')) {
      tag = `\nTag: ${tag.replace('refs/tags/', '')}`
    } else if (tag?.startsWith('refs/heads/')){
      tag = `\nBranch: ${tag.replace('refs/heads/', '')}`
    } else {
      tag = ''
    }

    await axios.get(`https://api.telegram.org/bot${process.env.INPUT_BOT_TOKEN}/sendMessage`, {
      params: {
        chat_id: process.env.INPUT_CHAT_ID,
        text: `*GitHub Actions Workflow*\nStatus: ${status}\nRepository: https://github.com/${repository}` +
          `${tag}\nWorkflow: ${workflow} - ${runId} (${runNumber})\nChecks: ${checkURL}`,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      },
    })

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
