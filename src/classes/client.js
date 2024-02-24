class Client {
    constructor() {
        this.api_key = process.env.APIALERTS_API_KEY
    }
    setApiKey(api_key) { 
        this.api_key = api_key
    }
    send({
        message,
        tags,
        link,
        api_key = this.api_key
    }) { 
        if(!api_key) throw new Error('API Key is required')
        if(!message) throw new Error('Message is required') 
        fetch("https://api.apialerts.com/event", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${api_key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                tags: tags,
                link: link
            })
        }).then(response => {  
            switch(response.status) {
                case 200: return response.json()
                case 400: throw new Error('Bad Request')
                case 401: throw new Error('Unauthorized')
                case 403: throw new Error('Forbidden')
                case 429: throw new Error('Rate Limit Exceeded')
                default:  throw new Error('Unknown Error')
            }
        }).then( data => { 
            console.log(` ✓ (apialerts.com) Alert sent to ${data.project} successfully.`) 
            return data
        }).catch(error => { 
            console.error(error)
        })
    }    
}

module.exports = Client;