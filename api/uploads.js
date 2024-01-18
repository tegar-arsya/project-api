// api/upload.js
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            upload.single('file')(req, res, (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error uploading file' });
                }

                // Kirim respons dengan URL gambar
                res.json({ imageUrl: `https://project-api-umkm.vercel.app/uploads/${req.file.originalname}` });
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}