export default async function test(message, client) {
    const remoteJid = message.key.remoteJid;

    try {
        // Send a message
        const msg = await client.sendMessage(remoteJid, { text: "Hello" });

        // Wait a bit to ensure the message is sent
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Clear the message by referencing the message id, fromMe, and timestamp
        await client.chatModify(
            {
                clear: {
                    messages: [
                        {
                            id: msg.key.id, // Message ID to be deleted
                            fromMe: true,    // Ensure the message is from the bot
                            timestamp: msg.key.timestamp // The timestamp of the message
                        }
                    ]
                }
            },
            remoteJid // The chat to clear the message from
        );

        console.log('✅ Message cleared successfully!');
    } catch (error) {
        console.error('❌ Error in clearing message:', error);
    }
}

