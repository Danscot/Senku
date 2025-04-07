
import configManager from '../utils/manageConfigs.js'

export async function info(message, client) {

    const remoteJid = message.key.remoteJid;

    const today = new Date();

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const currentDay = daysOfWeek[today.getDay()];

    const currentDate = today.getDate();

    const currentMonth = today.getMonth() + 1; 

    const currentYear = today.getFullYear();

    const owner = "𓂀 𝕊𝕖𝕟𝕜𝕦𓂀";

    const number = client.user.id.split(':')[0];

    const username = message.pushName || "Unknown";

    const t = ` 
╭─────────────────╮
    ༒ 𝕊𝕖𝕟𝕜𝕦 ༒
╰─────────────────╯
╭─────────────────╮
│ Prefix : ${configManager.config.users[number].prefix}
│ Hello, ${username}  
│ Day : ${currentDay}
│ Date : ${currentDate}/${currentMonth}/${currentYear} 
│ Version : 3.5 beta tester
│ Plugins : 35
│ Type : X-MD        
╰─────────────────╯

╭────[ UTILS ]────────╮
│      
│ ⬢ ping
│ ⬢ menu
│ ⬢ sudo
│ ⬢ device         
│ ⬢ delsudo
│ ⬢ autoreact
│ ⬢ setprefix
│ ⬢ prem-menu     
╰─────────────────╯

╭────[ GROUP ]───────╮
│
│ ⬢ kick
│ ⬢ purge        
│ ⬢ mute
│ ⬢ unmute
│ ⬢ promote
│ ⬢ demote
│ ⬢ gclink      
│ ⬢ antilink
│ ⬢ kickall
│ ⬢ promoteall
│ ⬢ demoteall
╰─────────────────╯

╭────[ MEDIA ]───────╮
│
│ ⬢ take
│ ⬢ vv
│ ⬢ play    
│ ⬢ save 
│ ⬢ photo
│ ⬢ setpp
│ ⬢ toaudio
│ ⬢ sticker
╰─────────────────╯

╭────[ TAGS ]────────╮
│
│ ⬢ tag
│ ⬢ tagadmin
│ ⬢ tagall
│ ⬢ settag  
│ ⬢ respons
╰─────────────────╯

╭────[ BUGS ]────────╮
│
│ ⬢ crash 237xxxxx
│ ⬢ fuck  237xxxxx
│ ⬢ kill  237xxxxx
╰─────────────────╯

made by Senku 🥷🏾
    `
;

    await client.sendMessage(remoteJid, {

        image: { url: "menu.jpg" },

        caption: t,

        contextInfo: {

            participant: '0@s.whatsapp.net',

            remoteJid: 'status@broadcast',

            quotedMessage: { conversation:"𝘿𝘼𝙉𝙎𝘾𝙊𝙏 ༒ 𝙎𝙀𝙉𝙆𝙐"}, 

            isForwarded: true,
        },


    });

    await client.sendMessage(remoteJid, {

            audio: { url: "menu.mp3" }, 

            mimetype: 'audio/mp4',

            ptt: true,
        });
}   

export default info;
