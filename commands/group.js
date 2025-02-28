async function getParticipantJid(message, args) {
    if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
        return message.message.extendedTextMessage.contextInfo.participant;
    } else if (args.length > 0) {
        return args[0].replace('@', '') + '@s.whatsapp.net';
    }
    throw new Error('No participant specified.');
}

async function groupAction(message, client, action, participant = null) {
    const remoteJid = message.key.remoteJid;
    try {
        await client.groupParticipantsUpdate(remoteJid, participant ? [participant] : [], action);
        let response = action === 'remove' ? 'removed' : action === 'promote' ? 'promoted to admin' : 'demoted from admin';
        if (participant) {
            await client.sendMessage(remoteJid, { text: `@${participant.replace('@s.whatsapp.net', '')} has been ${response}.` });
        }
    } catch (error) {
        await client.sendMessage(remoteJid, { text: `_Error: Unable to ${action} participant. ${error.message}_` });
    }
}

export async function kick(message, client, number) {
    const participant = await getParticipantJid(message, number);
    await groupAction(message, client, 'remove', participant);
}

export async function kickAll(message, client) {
    const remoteJid = message.key.remoteJid;
    try {
        const { participants } = await client.groupMetadata(remoteJid);
        const nonAdmins = participants.filter(p => !p.admin).map(p => p.id);
        if (nonAdmins.length > 0) {
            await groupAction(message, client, 'remove', nonAdmins);
            await client.sendMessage(remoteJid, { text: '_This group has been purified._' });
        } else {
            await client.sendMessage(remoteJid, { text: 'No non-admin members to remove.' });
        }
    } catch (error) {
        await client.sendMessage(remoteJid, { text: `_Error: Unable to remove participants. ${error.message}_` });
    }
}

export async function promote(message, client, args) {
    const participant = await getParticipantJid(message, args);
    await groupAction(message, client, 'promote', participant);
}

export async function demote(message, client, args) {
    const participant = await getParticipantJid(message, args);
    await groupAction(message, client, 'demote', participant);
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

export async function dall(message, client) {
    const remoteJid = message.key.remoteJid;
    try {
        const { participants } = await client.groupMetadata(remoteJid);
        const botNumber = client.user.id.split(':')[0] + '@s.whatsapp.net';
        const admins = participants.filter(p => p.admin && p.id !== botNumber).map(p => p.id);
        if (admins.length > 0) {
            await groupAction(message, client, 'demote', admins);
            await client.sendMessage(remoteJid, { text: '_I am taking control of this group for now._' });
        }
    } catch (error) {
        await client.sendMessage(remoteJid, { text: `_Error: ${error.message}_` });
    }
}

export async function pall(message, client) {
    const remoteJid = message.key.remoteJid;
    try {
        const { participants } = await client.groupMetadata(remoteJid);
        const nonAdmins = participants.filter(p => !p.admin).map(p => p.id);
        await groupAction(message, client, 'promote', nonAdmins);
    } catch (error) {
        await client.sendMessage(remoteJid, { text: `_Error: Unable to promote all participants. ${error.message}_` });
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

export default { kick, kickAll, promote, demote, leaveGroup, dall, pall, mute, unmute };
