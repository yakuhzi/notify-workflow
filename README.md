# Notify Workflow

A GitHub Action to send the GitHub Action workflow status over a Telegram bot.

## Usage

Here is an example how to use this action:

```yaml  
- name: Notify workflow status
  uses: yakuhzi/notify-workflow@v3
  if: always()
  with:
    job-status: ${{ job.status }}
    bot-token: ${{ secrets.BOT_TOKEN }}
    chat-id: ${{ secrets.CHAT_ID }}
```