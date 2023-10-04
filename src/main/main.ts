import axios from 'axios'
import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const repository = process.env.GITHUB_REPOSITORY
    const workflow = process.env.GITHUB_WORKFLOW
    const runId = process.env.GITHUB_RUN_ID
    const runNumber = process.env.GITHUB_RUN_NUMBER
    const commit = process.env.GITHUB_SHA
    let ref = process.env.GITHUB_REF

    const jobStatus = process.env.INPUT_JOB_STATUS

    const botToken = process.env.INPUT_BOT_TOKEN
    const chatId = process.env.INPUT_CHAT_ID

    const appName = process.env.INPUT_APP_NAME
    const firebaseServerKey = process.env.INPUT_FIREBASE_SERVER_KEY
    const firebaseTopic = process.env.INPUT_FIREBASE_TOPIC

    let statusMessage = 'Undefined ❎'

    switch (jobStatus) {
      case 'success':
        statusMessage = 'Success ✅'
        break
      case 'failure':
        statusMessage = 'Failure 🚫'
        break
      case 'cancelled':
        statusMessage = 'Cancelled ❌'
        break
    }

    let tag: string | undefined

    if (ref?.startsWith('refs/tags/')) {
      tag = ref.replace('refs/tags/', '')
      ref = `\nTag: ${tag}`
    } else if (ref?.startsWith('refs/heads/')) {
      ref = `\nBranch: ${ref.replace('refs/heads/', '')}`
    } else {
      ref = ''
    }

    const checkURL = `https://github.com/${repository}/commit/${commit}/checks`

    console.log(`📧️ Sending Telegram message to chat '${chatId}'`)
    await axios.get(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      params: {
        chat_id: chatId,
        text: `*GitHub Actions Workflow*\nStatus: ${statusMessage}\nRepository: https://github.com/${repository}` +
          `${ref}\nWorkflow: ${workflow} - ${runId} (${runNumber})\nChecks: ${checkURL}`,
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      },
    })

    if (jobStatus !== 'success' || !firebaseServerKey || !firebaseTopic || !appName || !tag) {
      return
    }

    console.log(`🔔 Sending Firebase message to topic '${firebaseTopic}'`)
    await axios.post('https://fcm.googleapis.com/fcm/send', {
      to: `/topics/${firebaseTopic}`,
      data: {
        name: appName,
        version: tag.replace('v', ''),
      },
    }, {
      headers: {
        'Authorization': `key=${firebaseServerKey}`,
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`⚠️ Unexpected error: '${error}'`)
    }
  }
}

run()
