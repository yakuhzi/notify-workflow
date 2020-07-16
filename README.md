# Notify Telegram

A GitHub Action to send workflow status over a Telegram Bot.

Usage
-------
Here is an example how to use this action:

```yaml  
- name: Notify workflow status
  uses: yakuhzi/notify-telegram@v1
  if: always()
  with:
    chat_id: ${{ secrets.CHAT_ID }}
    bot_token: ${{ secrets.BOT_TOKEN }}
    job_status: ${{ job.status }}
```
