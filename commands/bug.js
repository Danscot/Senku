async function bug(message, client, texts, num) {

    const remoteJid = message.key.remoteJid;

    await client.sendMessage(remoteJid, {

        image: { url: `${num}.png` },

        caption: `> ${texts}`,

        contextInfo: {

            externalAdReply: {

                title: "Join Our WhatsApp Channel",

                body: "𝘿𝘼𝙉𝙎𝘾𝙊𝙏 ༒ 𝙎𝙀𝙉𝙆𝙐",

                mediaType: 1, // Image preview

                thumbnailUrl: `https://whatsapp.com/channel/0029Vb5SsZ49RZAgIU7dkJ0V`,

                renderLargerThumbnail: false,

                mediaUrl: `${num}.png`,

                sourceUrl: `${num}.png`
            }
        }
    });
}

export default bug;
