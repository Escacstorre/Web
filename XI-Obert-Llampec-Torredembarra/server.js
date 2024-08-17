const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/proxy', async (req, res) => {
    const url = 'https://chess-results.com/tnr979564.aspx?lan=9&zeilen=0&prt=4&excel=2010';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const buffer = await response.buffer();
        res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('Error fetching the file:', error);
        res.status(500).send('Error fetching the file.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
