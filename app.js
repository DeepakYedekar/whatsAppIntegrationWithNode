const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.get('/api', (req,res) => {
    let mode = req.query['hub.mode'];
    let challenge = req.query['hub.challenge'];
    let token = req.query['hub.verify_token'];
    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.MYTOKEN) {
            res.status(200).send(challenge);
        } else {
            res.status(403);
        }
    }
})

app.post('/api', (req, res) => {
    let body_param = req.body;
    if (body_param.object) {
        if (body_param.entry && body_param.entry[0].changes && 
            body_param.entry[0].changes[0].values.messages &&
            body_param.entry[0].changes[0].values.messages[0]) {
            
            let phone_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].values.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].values.messages[0].text.body;
            axios({
                method: 'POST',
                url: "https://graph.facebook.com/v14.0/" + phone_no_id + "/messages?access_token=" + process.env.TOKEN,
                data: {
                     messaging_product: "whatsapp",
                     to: from,
                    text: {
                         body:"hi............"
                     }
                },
                headers: {
                    "Content-Type":"application/json"
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
