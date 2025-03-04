import { createWriteStream } from 'fs'

import { downloadMediaMessage } from "@whiskeysockets/baileys";

export let tagrepond=false;

export async function tagall(message, client) {

    const remoteJid = message.key.remoteJid;

    try {
        // Fetch group metadata
        const groupMetadata = await client.groupMetadata(remoteJid);
        
        // Get all participants' JIDs
        const participants = groupMetadata.participants.map(user => user.id);

        // Format message
        const text = participants.map(user => `@${user.split('@')[0]}`).join(' \n');

        // Send message with mentions
        await client.sendMessage(
            remoteJid,
            {
                text: `_Hello world_\n${text}`, 
                mentions: participants
            }
        );
    } catch (error) {
        console.error("_Error mentioning all:_", error);
    }
}


export async function tag(message, client) {

    const remoteJid = message.key.remoteJid;

    try {
        // Fetch group metadata
        const groupMetadata = await client.groupMetadata(remoteJid);
        
        // Get all participants' JIDs
        const participants = groupMetadata.participants.map(user => user.id);

        // Format message
        const text = participants.map(user => `@${user.split('@')[0]}`).join(' \n');

        // Send message with mentions
        await client.sendMessage(
            remoteJid,
            {   
                text: ``, 
                mentions: participants,

            }
        );

        await client.sendMessage(remoteJid,{

            text:"",

            edit:message.key
        })
    } catch (error) {
        console.error("_Error mentioning all:_", error);
    }
}

export async function tagadmin(message, client) {
    const remoteJid = message.key.remoteJid;

    const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net';

    try {
        // Fetch group metadata
        const { participants } = await client.groupMetadata(remoteJid);

        // Filter only admins
        const admins = participants.filter(p => p.admin && p.id !== botNumber).map(p => p.id);

        if (admins.length === 0) {
            return await client.sendMessage(remoteJid, { text: "❌ No admins found in this group." });
        }

        // Format message
        const text = `👮‍♂️ *Admins tagged:* \n${admins.map(user => `@${user.split('@')[0]}`).join('\n')}`;

        // Send message with mentions
        await client.sendMessage(remoteJid, {
            text,
            mentions: admins // Only mention admins
        });
    } catch (error) {
        console.error("❌ Error mentioning admins:", error);
        await client.sendMessage(remoteJid, { text: "❌ Error while tagging admins!" });
    }
}


export async function respond(message, client) {

    const number = client.user.id.split(':')[0];

    const remoteJid = message.key.remoteJid;

    const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';

    console.log(tagrepond);

    if ((!message.key.fromMe) && (tagrepond)){

        if (messageBody.includes(`@${number}`)) {

            await client.sendMessage(remoteJid, {

                audio: {url:"tag.mp3"},

                mimetype: "audio/mp4",

                ptt:true,
            })
        }
    }
}

export async function settag(message, client) {

    try {

        const remoteJid = message.key.remoteJid;

        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quotedMessage || !quotedMessage.audioMessage) {

            return client.sendMessage(remoteJid, { text: "❌ Reply to an audio" });
        }

        const audio = await downloadMediaMessage({ message: quotedMessage }, "stream");

        const writeStream = createWriteStream('./tag.mp3')

        audio.pipe(writeStream)

        await client.sendMessage(remoteJid, {text:"_Audio tag has been updated sucessfully_"})
    
    }catch (error) {
        console.error("_Error changing the tag audio:_", error);
    }

}

export async function tagoption(message, client) {

    const remoteJid = message.key.remoteJid;

    const messageBody = message.message?.conversation || message.message?.extendedTextMessage?.text || "";

    try {

        if(messageBody.toLowerCase().includes("on")){

            tagrepond = true;

            await client.sendMessage(remoteJid, {text:"_*Your tag respond is enable*_"});


        } else if (messageBody.toLowerCase().includes("off")) {

            tagrepond = false;

            await client.sendMessage(remoteJid, {text:"_*Your tag respond is disable_"});


        }else{

            await client.sendMessage(remoteJid, {text:"_*Select an option On/off*_"});
        }
    }catch (error) {
        console.error("_Error changing the tag audio:_", error);
    }

    
}



export default {tag, tagall, tagadmin, tagoption, settag, respond};
