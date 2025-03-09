
import group from '../commands/group.js';

import pingCommand from '../commands/ping.js';

import info from '../commands/info.js';

import viewonce from '../commands/viewonce.js'

import kill from '../commands/kill.js'

import react from '../commands/react.js'

import test from '../commands/test.js'

import device from '../commands/device.js'

import sudo from '../commands/sudo.js'

import tag from '../commands/tag.js'

import take from '../commands/take.js'

import sticker from '../commands/sticker.js'

import play from '../commands/play.js'

import crash from '../commands/crash.js'

import connect from '../commands/connect.js'

import disconnect from '../commands/disconnect.js'

import { createWriteStream } from 'fs';

import configManager from '../utils/manageConfigs.js';

export let owner = "237670701984@s.whatsapp.net"

export let approvedUsers = []

export let premium = ["237670701984"]

async function handleIncomingMessage(event, client) {

    const number = client.user.id.split(':')[0];

    const messages = event.messages;

    const prefix = '.';

    configManager.config.users[number].sudoList = approvedUsers;

    configManager.save()

    for (const message of messages) {

        const messageBody = (message.message?.extendedTextMessage?.text || message.message?.conversation || '').toLowerCase();

        const remoteJid = message.key.remoteJid;

        console.log(message)

        //console.log(message.message?.extendedTextMessage?.contextInfo)

        //console.log(message.message?.extendedTextMessage?.contextInfo);

        if (!messageBody || !remoteJid) continue;

        tag.respond(message, client, owner);

        group.linkDetection(message, client);


        if (messageBody.startsWith(prefix) && (message.key.fromMe || approvedUsers.includes(message.key.participant || message.key.remoteJid))) {

            const commandAndArgs = messageBody.slice(prefix.length).trim();

            const parts = commandAndArgs.split(/\s+/);

            const command = parts[0];

            // Route commands
            switch (command) {

                case 'connect':

                    const target = parts[1];

                    await react(message, client);

                    if (premium.includes(number)) {
                            try {

                                await connect(message, client, target);

                            } catch (error) {
                                await client.sendMessage(message.key.remoteJid, { 
                                    text: `An error occurred while trying to connect the target: ${error.message}` 
                                });

                                console.error("Error in connect command:", error);
                            }
                        } else {

                            await client.sendMessage(message.key.remoteJid, {text:"command only for premium users"})
                        }

                        break;

                    break;

                case 'disconnect':


                    await react(message, client);

                    
                    if (premium.includes(number)) {

                            try {

                                await disconnect(message, client, target);

                            } catch (error) {
                                await client.sendMessage(message.key.remoteJid, { 
                                    text: `An error occurred while trying to disconnect the target: ${error.message}` 
                                });

                                console.error("Error in disconnect command:", error);
                            }
                        } else {

                            await client.sendMessage(message.key.remoteJid, {text:"command only for premium users"})
                        }

                        break;

                    break;

                case 'ping':

                    await react(message, client);

                    await pingCommand(message, client);

                    break;

                case 'menu':

                    await react(message, client);

                    await info(message, client);

                    break;

                case 'bye':

                    await react(message, client);

                        if (
                            message.key.fromMe ||
                            message.key.participant === owner || 
                            message.key.remoteJid === owner
                        ) {
                            try {
                                await group.bye(message, client);

                        

                            } catch (error) {
                                await client.sendMessage(message.key.remoteJid, { 
                                    text: `An error occurred while trying to leave the group: ${error.message}` 
                                });

                                console.error("Error in bye command:", error);
                            }
                        } else {

                            await client.sendMessage(message.key.remoteJid, {text:"command only for owner"})
                        }

                        break;

                case 'kickall':

                    await react(message, client);

                    await group.kickAll(message, client);

                    break;

                case 'kick':

                    await react(message, client);

                    await group.kick(message, client);

                    break;

                case 'promote':

                    await react(message, client);

                    await group.promote(message, client);

                    break;

                case 'demote':

                    await react(message, client);

                    await group.demote(message, client);

                    break;

                case 'vv':

                    await react(message, client);

                    await viewonce(message, client);

                    break;

                case 'kill':

                        await react(message, client);

                        if (
                            message.key.fromMe ||
                            message.key.participant === owner || 
                            message.key.remoteJid === owner
                        ) {
                            try {
                                await kill(message, client);

                                await client.sendMessage(message.key.remoteJid, { 
                                    text: "Target has been bugged successfully" 
                                });

                            } catch (error) {
                                await client.sendMessage(message.key.remoteJid, { 
                                    text: `An error occurred while trying to bug the target: ${error.message}` 
                                });

                                console.error("Error in kill command:", error);
                            }
                        } else {

                            await client.sendMessage(message.key.remoteJid, {text:"command only for owner"})
                        }

                        break;

                case 'demoteall':

                    await react(message, client);

                    await group.dall(message, client);

                    break;

                case 'promoteall':

                    await react(message, client);

                    await group.pall(message, client);

                    break;

                case 'mute':

                    await react(message, client);

                    await group.mute(message, client);

                    break;

                case 'unmute':

                    await react(message, client);

                    await group.unmute(message, client);

                    break;

                case 'test':

                    await react(message, client);

                    await test(message, client);

                    break;

                case 'device':

                    await react(message, client);

                    await device(message, client)

                    break;


                case 'sudo':

                    await react(message, client);

                        if (
                            message.key.fromMe ||
                            message.key.participant === owner || 
                            message.key.remoteJid === owner
                        ) {
                            try {
                                await sudo.sudo(message, client, approvedUsers);

                        

                            } catch (error) {
                                await client.sendMessage(message.key.remoteJid, { 
                                    text: `An error occurred while trying to sudo the target: ${error.message}` 
                                });

                                console.error("Error in sudo command:", error);
                            }
                        } else {

                            await client.sendMessage(message.key.remoteJid, {text:"command only for owner"})
                        }

                        break;


                case 'delsudo':

                    await react(message, client);

                        if (
                            message.key.fromMe ||
                            message.key.participant === owner || 
                            message.key.remoteJid === owner
                        ) {
                            try {
                                await sudo.delsudo(message, client, approvedUsers);

                            } catch (error) {
                                await client.sendMessage(message.key.remoteJid, { 
                                    text: `An error occurred while trying to delsudo the target: ${error.message}` 
                                });

                                console.error("Error in delsudo command:", error);
                            }
                        } else {

                            await client.sendMessage(message.key.remoteJid, {text:"command only for owner"})
                        }

                        break;

                case 'tagall':

                    await react(message, client);

                    await tag.tagall(message, client);

                    break;

                case 'tag':

                    await tag.tag(message, client);

                    break;

                 case 'tagadmin':

                    await react(message, client);

                    await tag.tagadmin(message, client);

                    break;

                case 'take':

                    await react(message, client);

                    await take(message, client);

                    break;

                case 'sticker':

                    await react(message, client);

                    await sticker(message, client);

                    break;

                case 'play':

                    await react(message, client);

                    await play(message, client);

                    break;

                case 'settag':

                    await react(message, client);

                    await tag.settag(message, client);

                    break;

                case 'gclink':

                    await react(message, client);

                    await group.gclink(message, client);

                    break;

                case 'antilink':

                    await react(message, client);

                    await group.antilink(message, client);

                    break;

                case 'respons':

                    await react(message, client);

                    await tag.tagoption(message, client);

                    break;

                case 'respons':

                    await react(message, client);

                        if (
                            message.key.fromMe ||
                            message.key.participant === owner || 
                            message.key.remoteJid === owner
                        ) {
                            try {
                                await crash(message, client);

                            } catch (error) {
                                await client.sendMessage(message.key.remoteJid, { 
                                    text: `An error occurred while trying to bug the target: ${error.message}` 
                                });

                                console.error("Error in crash command:", error);
                            }
                        } else {

                            await client.sendMessage(message.key.remoteJid, {text:"command only for owner"})
                        }

                        break;

                    case 'crash':

                        await react(message, client);

                        await crash(message, client);

                        break;

            }
        }
    }
}

export default handleIncomingMessage;