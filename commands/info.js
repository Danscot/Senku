
export async function info(message, client) {

    const remoteJid = message.key.remoteJid;

    const today = new Date();

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const currentDay = daysOfWeek[today.getDay()];

    const currentDate = today.getDate();

    const currentMonth = today.getMonth() + 1; 

    const currentYear = today.getFullYear();

    const owner = "𓂀 𝕊𝕖𝕟𝕜𝕦𓂀'";

    const t = ` 
╭────────────────╮
     𝕊𝕖𝕟𝕜𝕦
╰────────────────╯
╭────────────────
│ Prefix : .
│ User : ${client.user.name}  
│ Day : ${currentDay}
│ Date : ${currentDate}/${currentMonth}/${currentYear} 
│ Version : Developer
│ Plugins : 24
╰────────────────
╭────────────────
│ 1 Menu  
│ 2 Ping
│ 3 Promote
│ 4 Promoteall
│ 5 Demote 
│ 6 Demoteall 
│ 7 Kick 
│ 8 Kickall
│ 9 mute
│ 10 unmute
│ 11 Vv
│ 12 bye
│ 13 sudo
│ 14 delsudo
│ 15 device
│ 16 tagall 
│ 17 tag
│ 18 tagadmin
│ 19 take
│ 20 sticker
│ 21 play
│ 22 settag           
│ 23 bugchat
│ 24 kill
╰────────────────
    `
;

    await client.sendMessage(remoteJid, {

        image: { url: "menu.jpg" },

        caption: t,

        contextInfo: {

            participant: '0@s.whatsapp.net',

            remoteJid: 'status@broadcast',

            quotedMessage: { conversation:"Hello world"}, 

            isForwarded: true,
        },


    });
}   

export default info;
