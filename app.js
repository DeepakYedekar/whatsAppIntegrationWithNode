const express = require('express');
require('dotenv').config();
const sendMessage = require('./send');
const bot = require('./bot');
const app = express();
app.use(express.json());

app.post('/send', (req, res) => {
    try {
        sendMessage(req.body).then(data => res.send('messages send successfully')).catch((err) => { res.send('error while sending the message'); });
    } catch (err) {
        res.send('err form server');
    }
})

app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];
    if (mode && token) {
        if (mode === "subscribe" && token === process.env.TOKEN) {
            res.send(challenge);
        } else {
            res.status(403);
        }
    }
});

app.post("/webhook",async (req, res) => {
    let body_param = req.body;
    if (body_param.object) {
        if (body_param.entry && body_param.entry[0].changes &&
            body_param.entry[0].changes[0].values.messages &&
            body_param.entry[0].changes[0].values.messages[0]) {
            let number = body_param.entry[0].changes[0].values.messages[0].from;
            let msg = body_param.entry[0].changes[0].values.messages[0].text.body;
            await bot(number, msg);
        } else {
            res.sendStatus(404);
        }
    }
});

app.listen(3000, () => {
    console.log(`server is started at port 3000`);
})