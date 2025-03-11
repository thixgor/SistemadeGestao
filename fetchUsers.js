const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    try {
        // Busca a lista de emails do Pastebin
        const response = await fetch('https://pastebin.com/raw/C9SxPnwZ', {
            method: 'GET',
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar emails do Pastebin');
        }

        const allowedEmails = await response.text();
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                allowedEmails: allowedEmails.trim().split('\n')
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Erro ao processar a requisição'
            })
        };
    }
}; 