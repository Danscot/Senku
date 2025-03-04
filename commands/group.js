import { isJidGroup, getContentType } from '@whiskeysockets/baileys';

export let detect; 

export async function handleGroupAction(message, client, action) {

    const remoteJid = message.key.remoteJid;

    try {

        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';

        const commandAndArgs = messageBody.slice(1).trim(); // Remove prefix and trim

        const parts = commandAndArgs.split(/\s+/);

        const args = parts.slice(1);

        console.log(args)

        let participant;

        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {

            participant = message.message.extendedTextMessage.contextInfo.participant;

        } else if (args.length > 0) {

            participant = args[0].replace('@', '') + '@s.whatsapp.net';

            console.log(participant);

        } else {

            throw new Error('No participant specified.');
        }
        
        const num = `@${participant.replace('@s.whatsapp.net', '')}`;

        await client.groupParticipantsUpdate(remoteJid, [participant], action);
        
        const actionMessages = {

            remove: `${num} has been removed.`,

            promote: `_${num} has been promoted to admin._`,

            demote: `_${num} has been removed as an admin._`
        };

        await client.sendMessage(remoteJid, { text: actionMessages[action] });

    } catch (error) {

        await client.sendMessage(remoteJid, { text: `_Error: Unable to perform action. ${error.message}_` });
    }
}

export async function kick(message, client) {

    await handleGroupAction(message, client, 'remove');
}

export async function promote(message, client) {

    await handleGroupAction(message, client, 'promote');
}

export async function demote(message, client) {

    await handleGroupAction(message, client, 'demote');
}

export async function kickAll(message, client) {

    const remoteJid = message.key.remoteJid;

    try {

        const groupMetadata = await client.groupMetadata(remoteJid);

        const nonAdmins = groupMetadata.participants.filter(p => !p.admin).map(p => p.id);

        if (nonAdmins.length === 0) {

            await client.sendMessage(remoteJid, { text: 'No non-admin members to remove.' });

            return;
        }

        await client.groupParticipantsUpdate(remoteJid, nonAdmins, 'remove');

        await client.sendMessage(remoteJid, { text: '_This group has been purified._' });

    } catch (error) {

        await client.sendMessage(remoteJid, { text: `_Error: Unable to remove participants. ${error.message}_` });
    }
}

export async function leaveGroup(message, client) {

    const remoteJid = message.key.remoteJid;

    try {

        await client.sendMessage(remoteJid, { text: '_Goodbye!_' });

        await client.groupLeave(remoteJid);

    } catch (error) {

        await client.sendMessage(remoteJid, { text: `_Error: Unable to leave the group. ${error.message}_` });
    }
}


export async function pall(message, client) {

    const remoteJid = message.key.remoteJid;

    try {

        const groupMetadata = await client.groupMetadata(remoteJid);

        const nonAdmins = groupMetadata.participants.filter(p => !p.admin).map(p => p.id);

        await client.groupParticipantsUpdate(remoteJid, nonAdmins, 'promote');

    } catch (error) {

        await client.sendMessage(remoteJid, { text: `_Error: Unable to promote participants. ${error.message}_` });
    }
}

// Placeholder for new functions (dall, mute, unmute, gclink, antilink, linkDetection)
export async function dall(message, client) {
    
    const remoteJid = message.key.remoteJid;

    try {

        const { participants } = await client.groupMetadata(remoteJid);

        const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net';

        const admins = participants.filter(p => p.admin && p.id !== botNumber).map(p => p.id);

        if (admins.length > 0) {

            await  client.groupParticipantsUpdate(remoteJid, admins, 'demote');

            await client.sendMessage(remoteJid, { text: '_I am taking control of this group for now._' });
        }
    } catch (error) {

        await client.sendMessage(remoteJid, { text: `_Error: ${error.message}_` });
    }
}
export async function mute(message, client) {

    const remoteJid = message.key.remoteJid;

    try {

        await client.groupSettingUpdate(remoteJid, 'announcement');

        await client.sendMessage(remoteJid, { text: 'The group has been muted.' });

    } catch (error) {

        await client.sendMessage(remoteJid, { text: `_Error: ${error.message}_` });
    }

}
export async function unmute(message, client) {

    const remoteJid = message.key.remoteJid;

    try {

        await client.groupSettingUpdate(remoteJid, 'not_announcement');

        await client.sendMessage(remoteJid, { text: 'The group has been unmuted.' });

    } catch (error) {
        
        await client.sendMessage(remoteJid, { text: `_Error: ${error.message}_` });
    }
}
export async function gclink(message, client) {
    
    const remoteJid = message.key.remoteJid;

    try {

        const code = await client.groupInviteCode(remoteJid);

        await client.sendMessage(remoteJid, {

        text: `https://chat.whatsapp.com/${code}`
    });

    }catch (error) {

        await client.sendMessage(remoteJid, { text: `_Error generating group link you are not admin: ${error.message}_` });
    }
}
export async function antilink(message, client) {

    const remoteJid = message.key.remoteJid;

    const senderJid = message.key.participant || message.key.remoteJid;

    const messageBody = message.message?.conversation || message.message?.extendedTextMessage?.text || "";

    try {


        if(messageBody.toLowerCase().includes("on")){

            detect = true;

            await client.sendMessage(remoteJid, {text:"_*Antilink enable*_"})

        } else if (messageBody.toLowerCase().includes("off")) {

            detect = false;


            await client.sendMessage(remoteJid, {text:"*_Antilink disable_*"})

        } else{

            await client.sendMessage(remoteJid, {text:"*_Set an option On / Off_*"})
        }

        
    } catch (error) {
        console.error("❌ Error while processing message:", error);
    }
}
async function linkDetection(message, client){

    const remoteJid = message.key.remoteJid;

    const senderJid = message.key.participant || message.key.remoteJid;

    const messageBody = message.message?.conversation || message.message?.extendedTextMessage?.text || "";

    if(detect){

        try {

            // Regex to detect links or ".com" messages
            const linkOrDotComRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|\.com\b)/gi;

            if (linkOrDotComRegex.test(messageBody)) {

                console.log(`🔗 Link detected: "${messageBody}"`);

                // Check if sender is an admin
                if (await isAdmin(client, remoteJid, senderJid)) {

                    return;
                }
                // Delete the message and send warning
                await client.sendMessage(remoteJid, { text: "*_🚫 Links are not allowed! Message deleted._*" });

                await client.sendMessage(remoteJid, { delete: message.key });

            }
        } catch (error) {
            console.error("❌ Error while processing message:", error);
        }

    }

}

// Function to check if a user is an admin in the group
async function isAdmin(client, groupJid, userJid) {

    try {

        const metadata = await client.groupMetadata(groupJid);

        const participants = metadata.participants;

        return participants.some(p => p.id === userJid && (p.admin === "admin" || p.admin === "superadmin"));

    } catch (error) {

        console.error("❌ Error fetching group metadata:", error);

        return false;
    }
}


export default { kick, kickAll, promote, demote, leaveGroup, pall, dall, mute, unmute, gclink, antilink, linkDetection };
