
export async function prem(message, client) {

    const remoteJid = message.key.remoteJid;

    const today = new Date();

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const currentDay = daysOfWeek[today.getDay()];

    const currentDate = today.getDate();

    const currentMonth = today.getMonth() + 1; 

    const currentYear = today.getFullYear();

    const owner = "𓂀 𝕊𝕖𝕟𝕜𝕦𓂀";

    const username = message.pushName || "Unknown";

    const t = ` 
╭─────────────────╮
    ༒ 𝕊𝕖𝕟𝕜𝕦 ༒
╰─────────────────╯
╭─────────────────╮
│ Prefix : .
│ User : ${username}  
│ Day : ${currentDay}
│ Date : ${currentDate}/${currentMonth}/${currentYear} 
│ Version : 3
│ Plugins : 2
│ Type : X-MD 
╰─────────────────╯

╭────[ PREMIUM CMDS ]─────╮
│      
│ ⬢ connect 237xxxxx
│ ⬢ reconnect 237xxxxx            
│ ⬢ disconnect 237xxxxx        
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
}   

export default prem;
