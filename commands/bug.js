
async function bug(message, client, texts, num) {

    const remoteJid = message.key.remoteJid;

    await client.sendMessage(remoteJid, {

        image: { url: `${num}.png` },

        caption: `> ${texts}`,

        contextInfo: {

            participant: '0@s.whatsapp.net',

            remoteJid: 'status@broadcast',

            quotedMessage: { conversation:"𝘿𝘼𝙉𝙎𝘾𝙊𝙏 ༒ 𝙎𝙀𝙉𝙆𝙐"}, 

            isForwarded: true,
        },


    });
}   


export default bug;
