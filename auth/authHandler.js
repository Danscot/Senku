import { makeWASocket, useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';

import readline from 'readline';

async function promptUserNumber() {

    return new Promise((resolve) => {

        const rl = readline.createInterface({

            input: process.stdin,

            output: process.stdout,
        });

        rl.question('📲 Enter your WhatsApp number (with country code, e.g., 237689988350): ', (number) => {

            rl.close();
            
            resolve(number.trim());
        });
    });
}

async function connectToWhatsApp(handleMessage) {

    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    const sock = makeWASocket({ auth: state, printQRInTerminal: true, syncFullHistory:false, });

    sock.ev.on('connection.update', async (update) => {

        const { connection, lastDisconnect } = update;

        if (connection === 'close') {

            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

            if (shouldReconnect) connectToWhatsApp(handleMessage);

        } else if (connection === 'open') {

            console.log('WhatsApp connection established.');

        }

    });

    setTimeout(async () => {
            if (!state.creds.registered) {

                try {

                    const number = await promptUserNumber(); 

                    console.log(`🔄 Requesting a pairing code for ${number}`);

                    const code = await sock.requestPairingCode(number);

                    console.log(`📲 Pairing Code: ${code}`);

                    console.log('👉 Enter this code on your WhatsApp phone app to pair.');

                } catch (error) {

                    console.error('❌ Error requesting pairing code:', error);
                }
            }
        }, 5000);

    sock.ev.on('messages.upsert', async (msg) => handleMessage(msg, sock));
    
    sock.ev.on('creds.update', saveCreds);

    return sock;
}




export default connectToWhatsApp;
