import { exec } from 'child_process';

import axios from 'axios';

import readline from 'readline';

import fs from 'fs';

import pkg from 'yt-dlp-wrap';


async function play(message, client) {

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

        await delay(9000);

        await client.sendMessage(remoteJid, {

            audio: {url: filePath}, 

            mimetype: 'audio/mp4',

            ptt: false,  // This makes it a "voice" message
        });

        fs.unlinkSync(filePath);

    } catch (error) {
        console.error("An error occurred:", error);
        await client.sendMessage(remoteJid, {
            text: `An error occurred while trying to play the music: ${error.message}`,
        });
    }
}

// Function to extract the title from the message
async function getArg(body) {

    const commandAndArgs = body.slice(1).trim(); // Remove the command prefix

    const parts = commandAndArgs.split(/\s+/);

    const args = parts.slice(1); 

    return args.join('');  // Return the combined title from the parts
}


async function downloadAudio(title) {

    const YTDlpWrap = pkg.default;
    
    try {
        const ytDlp = new YTDlpWrap();  // Correct instantiation
        const songPath = `song.mp3`;
        const url = await searchSongUrl(title);

        console.log(`Found song URL: ${url}`);
        console.log(`Downloading audio from: ${url}`);

        await ytDlp.execPromise([
            url,
            '-x',  // Extract audio
            '--audio-format', 'mp3',
            '--output', songPath
        ]);

        console.log(`✅ Audio downloaded successfully`);
        return songPath;
    } catch (error) {
        console.error(`Error occurred while downloading audio: ${error.message}`);
        return './music/default_song.mp3';
    }
}


// Example of function to search for a song's URL using YouTube API
async function searchSongUrl(title) {
    const API_KEY = 'AIzaSyDV11sdmCCdyyToNU-XRFMbKgAA4IEDOS0';
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
        return null;  // No results found
    } catch (error) {
        console.error('❌ Error searching YouTube:', error);
        throw error;
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default play;
