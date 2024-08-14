const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.array('files', 12), (req, res) => {
  res.json({ message: 'Files uploaded successfully!' });
});

router.get('/files', (req, res) => {
  fs.readdir('uploads/', (err, files) => {
    if (err) {
      console.error('Error listing files:', err);
      return res.status(500).json({ error: 'Unable to list files' });
    }
    res.status(200).json({ files });
  });
});
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '..', 'uploads', filename); // dosya dizinini buraya ayarlayın

  res.download(filepath, filename, (err) => {
      if (err) {
          res.status(500).send({
              message: "Dosya indirilemedi.",
              error: err.message
          });
      }
  });
});

router.get('/view/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  
  res.sendFile(filePath, err => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

router.delete('/files/:filename', (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', req.params.filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return res.status(500).json({ error: 'Unable to delete file' });
    }
    res.json({ message: 'File deleted successfully!' });
  });
});

module.exports=router;