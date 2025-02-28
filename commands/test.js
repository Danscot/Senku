const test = async (message, client) => {
    console.log("Triggering deeper crash tests...");

    // Test 1: Message with null JID (potential root cause)
    const nullJidMessage = {
        key: { remoteJid: null, fromMe: false }, // Remote JID is missing!
        message: { conversation: "Null JID test" }
    };

    // Test 2: Message with missing sender
    const missingSenderMessage = {
        key: { remoteJid: message.key.remoteJid, participant: null, fromMe: false },
        message: { conversation: "Missing sender test" }
    };

    // Test 3: Fake system message with broken key
    const fakeBrokenKeyMessage = {
        key: { remoteJid: message.key.remoteJid, participant: undefined, fromMe: false },
        message: {
            protocolMessage: {
                type: 4, // This usually references a deleted message event
                key: { remoteJid: null } // But we break it by setting null
            }
        }
    };

    // Test 4: Unexpected JID format (mixing user and group formats)
    const unexpectedJidFormatMessage = {
        key: { remoteJid: "1234567890@g.us", participant: "randomstring", fromMe: false },
        message: { conversation: "Unexpected JID format test" }
    };

    // Test 5: Business JID but treated as a regular user
    const businessJidTest = {
        key: { remoteJid: "1234567890@c.us", fromMe: false },
        message: { conversation: "Business JID test" }
    };

    // Emit all test messages
    const testMessages = [
        nullJidMessage,
        missingSenderMessage,
        fakeBrokenKeyMessage,
        unexpectedJidFormatMessage,
        businessJidTest
    ];

    testMessages.forEach(msg => {
        client.ev.emit("messages.upsert", { messages: [msg], type: "append" });
    });

    console.log("Sent all aggressive test messages!");
};

export default test;
