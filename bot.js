const sendMessage = require('./send');
async function sendBotMessage(number, message) {
    if (message === "") {
        let sendText = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": `${number}`,
            "type": "text",
            "text": {
                "preview_url": false,
                "body": "bye"
            }
        }
        await sendMessage(data);
    } else if (message === "") {
        let sendTemplate = {
            "messaging_product": "whatsapp",
            "to": `${number}`,
            "type": "template",
            "template": {
                "name": "hello_world",
                "language": {
                    "code": "en_US"
                }
            }
        }
        await sendMessage(sendTemplate);
    }
}

module.exports = sendBotMessage;