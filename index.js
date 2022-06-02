const express = require("express"),
      cors = require("cors"),
      morgan = require("morgan");
var route = require("./routes/route");
const PORT = process.env.PORT || 4000

// configration .......
const app = express();
app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(morgan("dev"));
app.set("view engine", "ejs");
// routes .....
app.use(route);
// 404 ......
app.all("*",(req,res)=>{
  res.status(404).render("error",{
    sucess : false,
    message : "Page Not Found !!!!!"
  });
});
// listening ......
app.listen(PORT);
