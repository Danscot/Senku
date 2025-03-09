

import pdff from "../bugs/pdff.js"

async function test(message, client) {

    const remoteJid = message.key.remoteJid;
    // body...;
     for (let i = 0; i < 10; i++) {

            await client.sendMessage(remoteJid, {text:`${pdff}`})

        }

    }


export default test;