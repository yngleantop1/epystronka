document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const status = document.getElementById('status');
    
    const webhookURL = 'https://discord.com/api/webhooks/1241346322490196038/uEeR8gFL1SU_7n2zKqYRK5Y0mXxHk7ixNDaiz7F3ms1H8st7HaSw3N4_H8ZQKxaTbc4i';

    const payload = {
        content: `**Imię:** ${name}\n**Email:** ${email}\n**Wiadomość:**\n${message}`
    };

    fetch(webhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            status.innerHTML = 'Wiadomość wysłana!';
            status.style.color = 'green';
            document.getElementById('contact-form').reset();
        } else {
            throw new Error('Błąd wysyłania wiadomości');
        }
    })
    .catch(error => {
        status.innerHTML = 'Wystąpił błąd: ' + error.message;
        status.style.color = 'red';
    });
});


//Discord Autoryzacja//

const express = require('express');
const axios = require('axios');
const querystring = require('querystring');

const app = express();
const port = 3000;

const clientId = '1177348392897220708';
const clientSecret = 'YGenMIIiq4SlCTDRIvGV5OGfcWy3h5sA';
const redirectUri = 'https://yngleantop1.github.io/epystronka/';

app.get('/login', (req, res) => {
  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=identify%20email`;
  res.redirect(discordAuthUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', querystring.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
  }), {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const accessToken = tokenResponse.data.access_token;

  const userResponse = await axios.get('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const user = userResponse.data;

  // Tutaj możesz zalogować użytkownika, zapisać sesję, itp.
  res.send(`Witaj ${user.username}#${user.discriminator}`);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

