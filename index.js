// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors()); // Menggunakan middleware cors

// Contoh data
const items = [{
    id: 1,
    name: 'Personal Website',
    imageUrl: 'portfolio_v2',
    isi: 'My personal website, I created this website to display my profile, skills, and projects. As well as my place to try new technology.',
    ket: 'VueJS 3, Tailwind',
}];

// Mendapatkan semua item
app.get('/api/items', (req, res) => {
    res.json(items);
});

// Menambahkan item baru dengan gambar
app.post('/api/items', async(req, res) => {
    const newItem = req.body;
    newItem.id = items.length + 1;

    if (req.file) {
        // Jika ada file yang diunggah, upload file ke serverless function
        try {
            const uploadResponse = await axios.post('https://project-api-umkm.vercel.app/api/upload', {
                data: req.file.buffer.toString('base64'),
                filename: req.file.originalname,
            });

            // Dapatkan URL gambar dari respons serverless function
            newItem.imageUrl = uploadResponse.data.imageUrl;
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error uploading file' });
        }
    }

    items.push(newItem);
    res.json(newItem);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});