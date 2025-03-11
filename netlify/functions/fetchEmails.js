// netlify/functions/fetchEmails.js
exports.handler = async (event) => {
    try {
        // Substitua pela sua URL do Pastebin
        const EMAIL_URL = 'https://pastebin.com/raw/C9SxPnwZ';
        
        const response = await fetch(EMAIL_URL);
        const data = await response.text();
        const emails = data.split('\n').map(e => e.trim().toLowerCase());

        const reqEmail = event.queryStringParameters.email?.toLowerCase().trim();
        const exists = emails.includes(reqEmail);

        return {
            statusCode: 200,
            body: JSON.stringify({ valid: !exists }) // true = email permitido
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ valid: false })
        };
    }
};