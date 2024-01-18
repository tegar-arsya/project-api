const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

// Konfigurasi multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Folder penyimpanan file
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname); // Gunakan nama file asli
    }
});

const upload = multer({ storage: storage });

// Contoh data
const items = [{
    id: 1,
    name: 'Personal Website',
    imageUrl: 'portfolio_v2',
    isi: 'My personal website, I created this website to display my profile, skills and projects. As well as my place to try new technology.',
    ket: 'VueJS 3, Tailwind',
}];

// Mendapatkan semua item
app.get('/api/items', (req, res) => {
    res.json(items);
});

// Menambahkan item baru dengan gambar
app.post('/api/items', upload.single('imageUrl'), (req, res) => {
    const newItem = req.body;
    newItem.id = items.length + 1;

    if (req.file) {
        // Jika ada file yang diunggah, tambahkan properti imageUrl ke newItem
        newItem.imageUrl = `https://project-api-umkm.vercel.app/uploads/${req.file.filename}`;
    }

    items.push(newItem);
    res.json(newItem);
});

// Endpoint untuk upload file
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileInfo = {
        filename: req.file.originalname,
        path: req.file.path,
    };

    res.status(200).json(fileInfo);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});