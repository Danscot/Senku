import { createWriteStream } from 'fs';
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import configManager from '../utils/manageConfigs.js';

export async function tagall(message, client) {
    const remoteJid = message.key.remoteJid;
    try {
        const groupMetadata = await client.groupMetadata(remoteJid);
        const participants = groupMetadata.participants.map(user => user.id);
        const text = participants.map(user => `@${user.split('@')[0]}`).join(' \n');
        await client.sendMessage(remoteJid, {
            text: `_Hello world_\n${text}`,
            mentions: participants
        });
    } catch (error) {
        console.error("_Error mentioning all:_", error);
    }
}

export async function tagadmin(message, client) {
    const remoteJid = message.key.remoteJid;
    const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net';

    try {
        const { participants } = await client.groupMetadata(remoteJid);
        const admins = participants.filter(p => p.admin && p.id !== botNumber).map(p => p.id);
        if (admins.length === 0) {
            return await client.sendMessage(remoteJid, { text: "❌ No admins found in this group." });
        }
        const text = `👮‍♂️ *Admins tagged:* \n${admins.map(user => `@${user.split('@')[0]}`).join('\n')}`;
        await client.sendMessage(remoteJid, { text, mentions: admins });
    } catch (error) {
        console.error("❌ Error mentioning admins:", error);
        await client.sendMessage(remoteJid, { text: "❌ Error while tagging admins!" });
    }
}

export async function respond(message, client) {
    const number = client.user.id.split(':')[0];
    const remoteJid = message.key.remoteJid;
    const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';

    // Ensure the user exists in config
    if (!configManager.config.users[number]) return;

    const tagRespond = configManager.config.users[number].response;
    if ((!message.key.fromMe) && tagRespond) {
        if (messageBody.includes(`@${number}`)) {
            await client.sendMessage(remoteJid, {
                audio: { url: configManager.config.users[number].tagAudioPath || "tag.mp3" },
                mimetype: "audio/mp4",
                ptt: true,
            });
        }
    }
}

export async function settag(message, client) {
    const number = client.user.id.split(':')[0];
    try {
        const remoteJid = message.key.remoteJid;
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quotedMessage || !quotedMessage.audioMessage) {
            return client.sendMessage(remoteJid, { text: "❌ Reply to an audio" });
        }

        const audio = await downloadMediaMessage({ message: quotedMessage }, "stream");
        const filePath = `${number}.mp3`;
        const writeStream = createWriteStream(filePath);

        // Ensure user exists in config and update path
        if (!configManager.config.users[number]) configManager.config.users[number] = {};
        configManager.config.users[number].tagAudioPath = filePath;
        configManager.save(); // Save changes

        audio.pipe(writeStream);
        await client.sendMessage(remoteJid, { text: "_Audio tag has been updated successfully_" });
    } catch (error) {
        console.error("_Error changing the tag audio:_", error);
    }
}

export async function tagoption(message, client) {
    const number = client.user.id.split(':')[0];
    const remoteJid = message.key.remoteJid;
    const messageBody = message.message?.conversation || message.message?.extendedTextMessage?.text || "";

    if (!configManager.config.users[number]) return;

    try {
        if (messageBody.toLowerCase().includes("on")) {
            configManager.config.users[number].response = true;
            configManager.save();
            await client.sendMessage(remoteJid, { text: "_*Your tag response is enabled*_" });
        } else if (messageBody.toLowerCase().includes("off")) {
            configManager.config.users[number].response = false;
            configManager.save();
            await client.sendMessage(remoteJid, { text: "_*Your tag response is disabled*_" });
        } else {
            await client.sendMessage(remoteJid, { text: "_*Select an option: On/off*_" });
        }
    } catch (error) {
        console.error("_Error changing the tag audio:_", error);
    }
}

export default { tagall, tagadmin, tagoption, settag, respond };
