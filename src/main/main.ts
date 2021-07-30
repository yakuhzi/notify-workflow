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

    let ref = process.env.GITHUB_REF
    let tag: string | undefined

    if (ref?.startsWith('refs/tags/')) {
      tag = ref.replace('refs/tags/', '')
      ref = `\nTag: ${tag}`
    } else if (ref?.startsWith('refs/heads/')) {
      ref = `\nBranch: ${ref.replace('refs/heads/', '')}`
    } else {
      ref = ''
    }

    await axios.get(`https://api.telegram.org/bot${process.env.INPUT_BOT_TOKEN}/sendMessage`, {
      params: {
        chat_id: process.env.INPUT_CHAT_ID,
        text: `*GitHub Actions Workflow*\nStatus: ${status}\nRepository: https://github.com/${repository}` +
          `${ref}\nWorkflow: ${workflow} - ${runId} (${runNumber})\nChecks: ${checkURL}`,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      },
    })

    const appName = process.env.INPUT_APP_NAME

    if (!appName || !tag) {
      return
    }

    await axios.post('https://fcm.googleapis.com/fcm/send', {
      to: `/topics/${process.env.INPUT_FIREBASE_TOPIC}`,
      data: {
        name: appName,
        version: tag.replace('v', ''),
      },
    }, {
      headers: {
        'Authorization': `key=${process.env.INPUT_FIREBASE_SERVER_KEY}`,
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
