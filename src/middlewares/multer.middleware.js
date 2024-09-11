// import multer from "multer";

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, "./public/temp")
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.originalname)
//     }
//   })
  
// export const upload = multer({ 
//     storage, 
// })

import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; // Install uuid with `npm install uuid`

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

export const upload = multer({
    storage
});
