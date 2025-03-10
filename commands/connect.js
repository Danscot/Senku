
import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';

import configManager from '../utils/manageConfigs.js';

import fs from "fs";

import sender from '../commands/sender.js';

import handleIncomingMessage from '../events/messageHandler.js';

export const sessions = {}; // Store active secondary sessions

async function startSession(targetNumber, message, client) {

    console.log("Starting session for:", targetNumber);

    const sessionPath = `./sessions/${targetNumber}`;

    if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        syncFullHistory: false,
    });

    sock.ev.on('connection.update', async (update) => {

        const { connection, lastDisconnect } = update;

        if (connection === 'close') {

            console.log("Session closed");

            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect) {

                console.log(`Reconnecting to ${targetNumber}...`);

                await startSession(targetNumber, message, client); // Reconnect if needed
            }
        } else if (connection === 'open') {

            console.log(`Session open for ${targetNumber}`);
            
        }
    });

    setTimeout(async () => {

                if (!state.creds.registered) {

                    console.log("Requesting pairing code for", targetNumber);

                    sender(message, client, `🔄 Requesting a pairing code for ${targetNumber}`);

                    try {

                        const code = await sock.requestPairingCode(targetNumber);

                        sender(message, client, `📲 Pairing Code: ${code}`);

                        configManager.config.users[`${targetNumber}`] = {

                            sudoList: [],

                            tagAudioPath: "tag.mp3",

                            antilink: false,

                            response: true
                        };

                        configManager.save();

                    } catch (error) {

                        console.error('❌ Error requesting pairing code:', error);

                        sender(message, client, `❌ Error requesting pairing code for ${targetNumber}`);
                    }
                }
            }, 5000);

    sock.ev.on('messages.upsert', async (msg) => handleIncomingMessage(msg, sock));

    sock.ev.on('creds.update', saveCreds);

    console.log(`Session established for ${targetNumber}`);

    sessions[targetNumber] = sock;

    return sock;
}

// Connect function - this gets called when the /connect command is invoked
async function connect(message, client, targetNumber) {

    console.log("Checking connection for:", targetNumber);

    if (sessions[targetNumber]) {

        sender(message, client, "This number is already connected.");

    } else {

        await startSession(targetNumber, message, client);
    }
}

export default connect;
