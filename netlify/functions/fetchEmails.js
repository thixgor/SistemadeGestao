exports.handler = async function (event) {
    try {
        const PASTEBIN_RAW_URL = "https://pastebin.com/raw/C9SxPnwZ";
        
        const response = await fetch(PASTEBIN_RAW_URL, { method: 'GET' });
        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: "Falha ao buscar os e-mails." })
            };
        }
        
        const text = await response.text();
        const emails = text.split('\n').map(email => email.trim()).filter(email => email);
        
        if (event.httpMethod === "GET") {
            return {
                statusCode: 200,
                body: JSON.stringify({ allowedEmails: emails })
            };
        }
        
        const { email } = JSON.parse(event.body || '{}');
        const exists = emails.includes(email);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ exists })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro interno do servidor." })
        };
    }
};
