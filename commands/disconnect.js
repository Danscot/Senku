
import fs from 'fs';

import path from 'path';

import sender from '../commands/sender.js';

async function disconnect(message, client, targetNumber) {

    const sessionPath = path.join(__dirname, `../sessions/${targetNumber}`);

    if (fs.existsSync(sessionPath)) {

        try {

            fs.rmdirSync(sessionPath, { recursive: true });

            sender(message, client, `✅ Auth information for ${targetNumber} deleted successfully.`);

        } catch (error) {

            sender(message, client,`❌ Error deleting auth info for ${targetNumber}:`, error);
        }

    } else {

        sender(message, client, `❌ No auth information found for ${targetNumber}.`);
    }
}

export default disconnect;
