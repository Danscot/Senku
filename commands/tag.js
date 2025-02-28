import { createWriteStream } from 'fs'

import { downloadMediaMessage } from "@whiskeysockets/baileys";

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

    try {
        // Fetch group metadata
        const groupMetadata = await client.groupMetadata(remoteJid);
        
        // Get all participants' JIDs
        const participants = groupMetadata.participants;

        const admins = participants.filter(p => p.admin && p.id !== botNumber).map(p => p.id)

        // Format message
        const text = admins.map(user => `@${user.split('@')[0]}`).join(' \n');

        // Send message with mentions
        await client.sendMessage(
            remoteJid,
            {
                text: `_Hello admins_\n`, 
                mentions: participants
            }
        );
    } catch (error) {
        console.error("_Error mentioning all:_", error);
    }
}


async function respond(message, client, number) {

    if (!message.key.fromMe){
        
        const remoteJid = message.key.remoteJid;

        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';

        if (messageBody.includes(`@${number}`)) {

            await client.sendMessage(remoteJid, {

                audio: {url:"tag.mp3"},

                mimetype: "audio/mp4",

                ptt:true,
            })
        }
    }
}

async function settag(message, client) {

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

export default {tag, tagall, tagadmin, respond, settag};
