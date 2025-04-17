import multer from "multer"

const multer = multer.diskStorage({
    filename: function(req,file,cb)
    {
        cb(null,file.originalname)
    }
});

const upload= multer({storage:storage});

module.exports=upload;