const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;
app.get('/api', (req,res) => {
    let mode = req.query['hub.mode'];
    let challenge = req.query['hub.challenge'];
    let token = req.query['hub.verify_token'];
    if (mode && token) {
        if (mode === 'subscribe' && token === mytoken) {
            res.status(200).send(challenge);
        } else {
            res.status(403);
        }
    }
})

app.post('/api',async (req, res) => {
    res.setTimeout(500000);
    let body_param = req.body;
    if(body_param){
        console.log("inside body param");
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages && 
            body_param.entry[0].changes[0].value.messages[0]  
            ){
               let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
               let from = body_param.entry[0].changes[0].value.messages[0].from; 
               let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

               console.log("phone number "+phon_no_id);
               console.log("from "+from);
               console.log("boady param "+msg_body);

              await axios({
                   method:"POST",
                   url:"https://graph.facebook.com/v15.0/"+phone_number_id+"/messages?access_token="+token,
                   data:{
                       messaging_product: "whatsapp",
                       recipient_type: "individual",
                       to:from,
                       text:{
                           body:"Hi.. I'm Prasath, your message is "+msg_body
                       }
                   },
                   headers:{
                       "Content-Type":"application/json"
                   }

              })
            res.send("hello from server");
            }else{
                res.sendStatus(404);
            }

    }
})


app.get('/', (req, res) => {
    res.status(200).send('hello this is the webhook setup');
}) 


app.listen(process.env.PORT, () => {
    console.log(`server is started on port ${process.env.PORT}`);
})
