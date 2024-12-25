const SignupSchema = require("../model/signupSchema")

const MainSchema = require("../model/mainSchema")


module.exports.SignUp = (req,res)=>{
    res.render("signup")
}

module.exports.SignUpData = async(req,res)=>{
    let data = await SignupSchema.create(req.body)
    data && res.redirect("/dashbord")  
}

module.exports.Login = async(req,res)=>{
    res.render("login")
}

module.exports.LoginData = async(req,res)=>{
    let admin = await SignupSchema.findOne({"email":req.body.email})
    if (!admin) {
        res.redirect("/") 
    }
    if (req.body.password == admin.password) {
        res.cookie("adminData",admin)
        res.redirect("/dashbord")
    }else{
        res.redirect("/")
    }
}

module.exports.LogOut = async(req,res)=>{
    res.clearCookie("adminData")
    res.redirect("/login")
}
module.exports.Dashbord = async(req,res) =>{
    let admin = req.cookies.adminData
     admin ? res.render("dashbord") : res.redirect("/login")
}

module.exports.Form = async(req,res)=>{
    if (req.cookies.adminData) {
        res.render("form")
    }else{
        res.redirect("/login")
    }
    
}

module.exports.FormData=async(req,res)=>{
    req.body.userid = req.cookies.adminData._id
    console.log(req.body);
    
    let data = await MainSchema.create(req.body)
    data && res.redirect("/form")
}

module.exports.Table=async(req,res)=>{
    if (req.cookies.adminData) {
        let data = await MainSchema.find({})
        let UID = data.filter(iteam => iteam.userid == req.cookies.adminData._id)
       
    res.render("table",{UID});
    }else{
        res.redirect("/login")
    }
}

module.exports.Delete = async(req,res)=>{
    let data = await MainSchema.findByIdAndDelete(req.query.id)
    data && res.redirect("/");
}
module.exports.Edit = async(req,res)=>{
    if(req.cookies.adminData){
        let data = await MainSchema.findById(req.query.id)
        data && res.render("edit",{data});
    }else{
        res.redirect("/login")
    }
}
module.exports.UpdateData = async(req,res)=>{
    let data = await MainSchema.findByIdAndUpdate(req.body.id,req.body)
    data && res.redirect("/table")
}