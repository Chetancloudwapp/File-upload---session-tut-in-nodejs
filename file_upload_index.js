const express = require('express');
const app = express();
const multer = require('multer'); // import multer package
const path = require('path');

/* ---------- Middleware -------- */
app.use(express.urlencoded({extender: false})); // accept html form-data
app.use(express.json()); // accept json data from api
app.set('view engine', 'ejs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // specify the destination folder for uploaded files
    },
    filename: (req, file, cb) => {
        const newFileName = Date.now() + path.extname(file.originalname); // create a new file name with timestamp
        cb(null, newFileName); // specify the new file name
    }
});

// File filter to check the file type
const filefilter = (req, file, cb) => {
    if(file.fieldname === 'userfile') {
        // agar image ki specific type ki file ko accept krni hai to iss tarah se krskte hai
        if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
            cb(null, true); // accept the file
        }else{
            cb(new Error('Only images are allowed'), false); // here false specifies reject the file
        }
    }else if(file.fieldname === 'userdocuments') {
        if(file.mimetype == 'application/pdf') {
            cb(null, true); // accept the file
        }else{
            cb(new Error('Only pdf are allowed for documents'), false); // here false specifies reject the file
        }

    }else{
        cb(new Error('Unknown fields'), false);
    }
    // if(file.mimetype.startsWith('image/')) { // only image ki file hi accept hogi
    //     cb(null, true); // accept the file
    // }else{
    //     cb(new Error('Only images are allowed'), false); // here false specifies reject the file
    // }
}

// Initialize multer with the storage configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 3 // limit file size to 3MB
    },
    fileFilter: filefilter // apply the file filter
});

app.get('/', (req, res) => {
    res.render('myform')
});

/* ---------- single file upload code -------------- */
// app.post('/submitform', upload.single('userfile'), (req, res) => {
//     // check if user upload files or not
//     if(!req.file || req.file.length === 0) {
//         return res.status(400).send(`No files uploaded`); // send error response if no file is uploaded
//     }

//     res.send(req.file.filename); // send the file information as response
// });

/* ---------- Multiple file upload code -------------- */
// app.post('/submitform', upload.array('userfile', 3), (req, res) => {
//     // check if user upload files or not
//     if(!req.files || req.files.length === 0) {
//         return res.status(400).send(`No files uploaded`); // send error response if no file is uploaded
//     }

//     res.send(req.files); // send the file information as response
// });

/* ---------- Ek hi form se Multiple file upload krna hoto -------------- */
app.post('/submitform', upload.fields([
    { name: 'userfile', maxCount:1}, // phle form field ka name & uska count
    { name:'userdocuments', maxCount:3} // dusri form field ka name and uska max count
]), (req, res) => {
    // check if user upload files or not
    if(!req.files || req.files.length === 0) {
        return res.status(400).send(`No files uploaded`); // send error response if no file is uploaded
    }

    res.send(req.files); // send the file information as response
});

// error handling with the help of middleware
app.use((error, req, res, next) => {
    if(error instanceof multer.MulterError) { // multer error handling
        if(error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).send(`Error: Too many files uploaded`); // send error response if too many files are uploaded
        }
        return res.status(400).send(`Multer error: ${error.message} : ${error.code}`);
    }else if(error){
        return res.status(500).send(`Something went wrong: ${error.message}`)
    }
    next(); // call the next middleware if no error
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});