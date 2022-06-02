const router = require("express").Router();
const IG = require("instagram-url-direct");
var download = require("./down");
const { rmSync } = require("fs");

function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}


router.get("/",(req,res)=>{
  res.render("index");
});
router.get("/down",async (req,res)=>{
  const Url = req.query.url;
  let filename = new Date().getTime();
  if(Url){
    if(validateUrl(Url)){
    try {
      link = await IG(Url);
      if(link.url_list.length > 0){
      meta_data = await download(link.url_list[0],filename);
      res.download(`public/${filename}.${meta_data.mime.split('/')[1]}`,(err)=>{
        if(!err){
          setTimeout(function() {
            rmSync(`public/${filename}.${meta_data.mime.split('/')[1]}`);
          }, 30000);
        }
      });
      }else{
        res.status(403).render("error",{message : "Url Not Valid",sucess : false});
      }
    } catch (e) {
      res.render("error",{
        sucess : false,
        message : e.message
      });
    }
    }else{
      res.status(302).render("error",{
        sucess : false,
        message : "Url Not Valid"
      })
    }
  }else{
    res.status(202).render("error",{
      sucess : false,
      message : "Url Not Found !"
    });
  }
});
module.exports = router;