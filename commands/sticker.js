import { Sticker, StickerTypes } from "wa-sticker-formatter";
import { downloadMediaMessage } from "@whiskeysockets/baileys";
import fs from "fs";
import path from "path";
import { exec } from "child_process";

export async function sticker(message, client) {
    try {
        const remoteJid = message.key.remoteJid;
        const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const username = message.pushName || "Unknown"; // Sender's name

        if (!quotedMessage) {
            return client.sendMessage(remoteJid, { text: "❌ Reply to an image or video to convert it into a sticker!" });
        }

        // Detect media type
        const isVideo = !!quotedMessage.videoMessage;
        const isImage = !!quotedMessage.imageMessage;

        if (!isVideo && !isImage) {
            return client.sendMessage(remoteJid, { text: "❌ The quoted message is not an image or video!" });
        }

        console.log(`📌 Converting ${isVideo ? "video" : "image"} to sticker for ${username}...`);

        // Download media
        const mediaBuffer = await downloadMediaMessage({ message: quotedMessage }, "buffer");

        if (!mediaBuffer) {
            return client.sendMessage(remoteJid, { text: "❌ Failed to download media!" });
        }

        // Save media to a temp file
        const tempInput = isVideo ? "./temp_video.mp4" : "./temp_image.jpg";
        const tempOutput = "./temp_sticker.webp";
        fs.writeFileSync(tempInput, mediaBuffer);

        // Convert video/GIF to WebP (for animated stickers)
        if (isVideo) {
            console.log("⚙️ Processing video for sticker...");
        } else {
            // Convert image to WebP (for static stickers)
            console.log("⚙️ Processing image for sticker...");
            await new Promise((resolve, reject) => {
                exec(
                    `convert "${tempInput}" -background none  "${tempOutput}"`,
                    (error) => {
                        if (error) reject(error);
                        else resolve();
                    }
                );
            });
        }

        // Create sticker
        const sticker = new Sticker(tempOutput, {
            pack: `${username}'s Stickers`,
            author: `${username}`,
            type: isVideo ? StickerTypes.FULL : StickerTypes.DEFAULT, // Preserve animations
            quality: 80,
            animated: isVideo,
        });

        // Convert to sticker format
        const stickerMessage = await sticker.toMessage();

        // Send sticker
        await client.sendMessage(remoteJid, stickerMessage);

        // Cleanup temp files
        fs.unlinkSync(tempInput);
        fs.unlinkSync(tempOutput);

        console.log(`✅ Sticker sent successfully from ${isVideo ? "video" : "image"}!`);
    } catch (error) {
        console.error("❌ Error:", error);
        await client.sendMessage(message.key.remoteJid, { text: "⚠️ Error converting media to sticker." });
    }
}

export default sticker;
