/*

// ------------------- File Uploading in NodeJs with Multer ------------------- //

Note :- we can use package named multer for file uploading in nodejs.This package provides all of the facilities for file uploading in nodejs.

Step-1 :- 

    Installation :- npm install multer

Step-2 :-

    const multer = require('multer'); // import multer
    const path = require('path'); // import path package image file mai se extension nikalne k liye iska use hota hai

step-3 :- Ready option-1 storage with multer

    const storage = multer.diskStorage({

        destination: function(req, file, cb){ // here cb is callback function here
            cb(null, './uploads)    // it takes 2 params first parameter is error and second is destination path jaha bhi humare file store hogi
        },

        filename: function(req, file, cb) {
            const newFileName = Date.now() + path.extname(file.originalname); // here we are getting the file extension from the original name of the file
            cb(null, newFileName); // here we are passing the new file name to the callback function iss tarh se hum file ka naam change kr sakte hai
        }
    })

step -4 :- Define Limits

    const limits = {
        fileSize : 1024 * 1024 * 5, // here we are defining the file size limit i.e 5mb
    }

step-5 :- 

    const upload = multer({
        storage: storage,
        limits: limits
    })

**** NOTE ;- MULTER KO USE KRNE K LIYE HUME ISE ROUTE MAI PASS KRNA PADTA HAI AS A MIDDLEWARE JUST LIKE BELOW :-

app.post('/submitform', upload.single('imagefile'), (req, res) { // single image file k liye upload.single() ka use hota hai
    res.send(req.file);
});

app.post('/submitform', upload.array('imagefile', 5), (req, res) { // upload.array() for uploading multiple files here second parameter is our restriction i.e in this case only 5 file will upload
    res.send(req.file);
});

*********** Agar ek hi form mai multiple file upload karna hai to humko upload.fields() ka use krna padta hai. ***************

upload.fields([ {name: 'profilepic', maxCount:1}, {name:'documents', maxCount:3} ])

****************** Detailed Explanation ************************

Multer :- Jab bhi hum multer k sath kaam krna chahte hai to hume isme 3 options pass krne hote hai:;

=> 1). Storage :- It is mandatory field & iske andar humko 2 cheezein pass karni hoti hai
       => Destination - that means ki kaha hum file ko save krna chahte hai kis path pr vo destination path batate hai yaha
       => filename - that means ki file ka naam kya hoga yaa agar name ko rename krna hoto

=> 2). Limits :- It is optional field, isme hum limits ko define krte hai jo bhi file pr lagani hai
       => fileSize - i.e kitne size ki file ko upload krskta hai here filesize is in bytes.
       => files - i.e ek sath kitne files ko upload krne ki permission hai
       => fields - multiple fields se bhi file ko upload kara skte hai i.e ek hi form mai user ki image bhi or logo bhi
       => fieldNameSize - jo bhi multiple fields se file ko upload kr rahe hai uska size kya hoga

=> 3). File Filter :- It is optional field, file pr restriction lagani hai ki kis file ko upload karna hai or kis file ko nahi
      => image (jpg,png,jpeg,gif)
      => pdf
      => excel
      => word
      => video


// ******** sessions 

Benifits:- Temporary data storage 

*********** Why we use sessions ***************
=> User Authentication
=> Shopping Cart
=> Flash Messages
=> Multi-step forms
=> Temporary Data Storage
=> User Preferences i.e language change krke data show kara skte hai kisi bhi page pr with the help of sessions   
=> Form Data preservation i.e agar error aa jaye to form data ko save krne k liye jisse double se form na bharne pade
=> CAPTCHA Verification

************* How to use sessions in express js ****************

Step-1 :- npm install express-session
Step-2 :- const session = require('express-session');
Step-3 :- set session with the help of middleware

app.user(session({
    secret : 'mysecretkey', // yhh secret key user ki cookie mai save hogi encrypted form mai and isi ke behalf pr session ka data save hota hai and isi key ke behalf pr user authenticate hota hai
    resave : false, //  iska mtlb hai hum sessions mai modification krskte hai ya nahi bydefault ise hum false hi rakhte hai bcz hum sessions mai bahut kam hi modification krte hai most of the time we use read and delete and update
    saveUninitialized : false, // iska mtlb hai ki agar session mai koi bhi data nahi hai to session create nahi hoga
    cookie : { maxAge : 1000 * 60 * 60 * 24 } // session cookie expiration time 24 hrs
}))

******************** Session Commands ***********************

1). Store Session :-

    req.session.key = 'value';

2). Read Session :-

    res.send(req.session.key);

3). Delete Session :-

    req.session.destroy()


Note:- By default session ko hum user ki ram mai store karate hai in the form of cookies but this create an problem if number of guests are very high so in that case we save our session data in backend and for that we use a package named as connect-mongo

*/