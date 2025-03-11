// netlify/functions/fetchEmails.js
exports.handler = async (event, context) => {
    try {
        // URL única da lista de emails (substitua com sua URL)
        const EMAIL_LIST_URL = 'https://pastebin.com/raw/C9SxPnwZ';
        
        // Faz o fetch da lista de emails
        const response = await fetch(EMAIL_LIST_URL);
        
        if (!response.ok) {
            throw new Error('Erro ao carregar lista de emails');
        }

        // Pega o conteúdo e divide em linhas
        const data = await response.text();
        const emails = data.split('\n').map(email => email.trim().toLowerCase());

        // Verifica se o email existe na lista
        const emailToCheck = event.queryStringParameters.email?.trim().toLowerCase();
        const exists = emails.includes(emailToCheck);

        return {
            statusCode: 200,
            body: JSON.stringify({ exists }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Erro interno' }),
        };
    }
};
