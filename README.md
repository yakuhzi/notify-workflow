# Notify Status

A GitHub Action to send workflow status over a Telegram bot and Firebase.

Usage
-------
Here is an example how to use this action:

```yaml  
- name: Notify workflow status
  uses: yakuhzi/notify-status@v2
  if: always()
  with:
    chat_id: ${{ secrets.CHAT_ID }}
    bot_token: ${{ secrets.BOT_TOKEN }}
    job_status: ${{ job.status }}
```

If you also want to send a Firebase message:
```yaml  
- name: Notify workflow status
  uses: yakuhzi/notify-status@v2
  if: always()
  with:
    chat_id: ${{ secrets.CHAT_ID }}
    bot_token: ${{ secrets.BOT_TOKEN }}
    firebase_server_key: ${{ secrets.FIREBASE_SERVER_KEY }}
    firebase_topic: ${{ secrets.FIREBASE_TOPIC }}
    app_name: ${{ secrets.APP_NAME }}
    job_status: ${{ job.status }}
```
