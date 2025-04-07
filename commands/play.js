import { exec } from 'child_process';

import axios from 'axios';

import readline from 'readline';

import fs from 'fs';

import pkg from 'yt-dlp-wrap';

export async function play(message, client) {

    const remoteJid = message.key.remoteJid;

    const messageBody = (message.message?.extendedTextMessage?.text || message.message?.conversation || '').toLowerCase();

    try {

        const title = await getArg(messageBody);  

        console.log(`Searching for title: ${title}`);

        const songUrl = await searchSongUrl(title);

        if (!songUrl) {

            throw new Error("No song found with that title.");
        }

        console.log(`Found song URL: ${songUrl}`);

        const filePath = await downloadAudio(songUrl);

        await client.sendMessage(remoteJid, {

            audio: { url: filePath }, 

            mimetype: 'audio/mp4',

            ptt: false,
        });

        fs.unlinkSync(filePath);

    } catch (error) {

        console.error("An error occurred:", error);

        await client.sendMessage(remoteJid, {

            text: `An error occurred while trying to play the music: ${error.message}`,
        });
    }
}

// Function to extract title from message
async function getArg(body) {

    const commandAndArgs = body.slice(1).trim();

    const parts = commandAndArgs.split(/\s+/);

    return parts.slice(1).join(' ');
}

// Function to download audio from YouTube
async function downloadAudio(title) {

    const YTDlpWrap = pkg.default;

    try {

        const ytDlp = new YTDlpWrap();

        const songPath = `song.mp3`;

        const url = await searchSongUrl(title);

        console.log(`Found song URL: ${url}`);

        console.log(`Downloading audio from: ${url}`);

        await ytDlp.execPromise([
            url,
            '-x', '--audio-format', 'mp3',
            '--output', songPath
        ]);

        console.log(`✅ Audio downloaded successfully`);

        return songPath;

    } catch (error) {

        console.error(`Error occurred while downloading audio: ${error.message}`);

        return;
    }
}

async function searchSongUrl(title) {

    const API_KEY = 'AIzaSyDV11sdmCCdyyToNU-XRFMbKgAA4IEDOS0';// Replace with your actual API key
    
    const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search';

    try {
        const response = await axios.get(YOUTUBE_API_URL, {

            params: {

                part: 'snippet',

                q: title,

                type: 'video',

                key: API_KEY,
            },
        });

        const items = response.data.items;

        if (items.length > 0) {

            const videoId = items[0].id.videoId;

            return `https://www.youtube.com/watch?v=${videoId}`;
        }
        return null;

    } catch (error) {

        console.error('❌ Error searching YouTube:', error);

        throw error;
    }
}

// Function to delay execution
function delay(ms) {
    
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Export all functions for bot integration
export default play ;