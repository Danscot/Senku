
import connectToWhatsApp from './auth/authHandler.js';

import handleIncomingMessage from './events/messageHandler.js';

import crypto from 'crypto';

(async () => {

    await connectToWhatsApp(handleIncomingMessage);
    
})();
