
import connectToWhatsApp from './auth/authHandler.js';

import handleIncomingMessage from './events/messageHandler.js';

import crypto from 'crypto';

globalThis.crypto = crypto; // Ensure it's globally available


(async () => {

    await connectToWhatsApp(handleIncomingMessage);
    
})();