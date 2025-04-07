async function bug(message, client, texts, num) {

    const remoteJid = message.key.remoteJid;

    await client.sendMessage(remoteJid, {

        image: { url: `${num}.png` },

        caption: `> ${texts}`,

        contextInfo: {

            externalAdReply: {

                title: "Join Our WhatsApp Channel",

                body: "Click here to stay updated!",

                mediaType: 1, // Image preview

                thumbnailUrl: `https://whatsapp.com/channel/0029Vb3FfG1InlqLn5jIg30V`,

                renderLargerThumbnail: true,

                mediaUrl: "https://whatsapp.com/channel/0029Vb3FfG1InlqLn5jIg30V",

                sourceUrl: "https://whatsapp.com/channel/0029Vb3FfG1InlqLn5jIg30V"
            }
        }
    });
}

export default bug;
