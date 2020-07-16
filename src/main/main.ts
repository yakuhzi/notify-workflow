import axios from 'axios'
import core from '@actions/core'

async function run(): Promise<void> {
  try {
    const repository = process.env.GITHUB_REPOSITORY
    const tag = process.env.GITHUB_REF?.replace('refs/tags/', '')

    let status = 'Undefined ❎'

    switch (process.env.INPUT_JOB_STATUS) {
      case 'success': status = 'Success ✅'
        break
      case 'failure': status = 'Failure 🚫'
        break
      case 'cancelled': status = 'Cancelled ❌'
        break
    }

    await axios.get(`https://api.telegram.org/bot${process.env.INPUT_BOT_TOKEN}/sendMessage`, {
      params: {
        chat_id: process.env.INPUT_CHAT_ID,
        text: `*GitHub Actions Workflow Status*\nStatus: ${status}\nRepository: ${repository}\nRelease: ${tag}`,
        parse_mode: 'Markdown',
      },
    })

  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
