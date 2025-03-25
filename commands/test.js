
export async function test(message, client) {

    const remoteJid = message.key.remoteJid;

    const participant = "237670701984@s.whatsapp.net"

    // Send the latency result back to the user
    await client.sendMessage(remoteJid,  {

        text: `hi`,

    });
}

//237689360833@s.whatsapp.net

export default test;
