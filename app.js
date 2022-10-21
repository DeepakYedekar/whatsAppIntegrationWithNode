const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const token=process.env.TOKEN;
app.get('/api', (req,res) => {
    let mode = req.query('hub.mode');
    let challenge = req.query('hub.challenge');
    let token = req.query('hub.verify_token');
    const mytoken = "";
    if (mode && token) {
        if (mode === 'subscribe' && token == process.env.MYTOKEN) {
            res.status(200).send(challenge);
        } else {
            res.status(403);
        }
    }
})

app.post('/api', (req, res) => {
    let body_param = req.body;
    console.log(JSON.stringify(body_param, null, 2));

    if (body_param.object) {
        if (body_param.entry && body_param.entry[0].changes && 
            body_param.entry[0].changes[0].values.messages &&
            body_param.entry[0].changes[0].values.messages[0]) {
            let phone_no_id = body.entry.changes[0].values.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].values.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].values.messages[0].text.body;
            axios({
                method: 'POST',
                url: "https://graph.facebook.com/v14.0/" + phone_no_id + "/messages?access_token=" + token,
                data: {
                    messaging_product: 'whatsapp',
                    to: from,
                    text: {
                        body:"Hi...i am Deepak"
                    }
                },
                headers: {
                    "Context-Type":"application/json"
                }
            })
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
            }
    }
})


app.get('/', (req, res) => {
    res.status(200).send('hello this is the webhook setup');
}) 


app.listen(process.env.PORT, () => {
    console.log('webhook is listening');
})
