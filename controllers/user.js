const encryptPassword = require("../utils/encryptPassword");
const decryptPassword = require("../utils/decryptPassword");

async function userGet(req, res) {
    try {
        const User = req.app.get("models").User;
        const MyUsers = await User.find();
        res.json(MyUsers);
    } catch (error) {
        res.json(error.message);
    }

}

async function userCreate(req, res) {
    try {
        if(!req.body.password){
            res.json("mot de passe manquant")
        }

        // verification du role via le middleware
        if(req.role !== "manager"){
            return res.json("non authorisé ")
        }
        // je crypte le token
        const {token, salt, hash} = encryptPassword(req.body.password);
        // je récupère le model user depuis l'app global
        const User = req.app.get("models").User;

        // crée une instance de user
        const NewUser = await new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            token,
            salt,
            hash
        }).save();

      return res.json(NewUser);

    } catch (error) {
       return res.json(error.message);
    }
}

async function userUpdate(req, res) {
    try {
        if(!req.body._id || !req.body.toModify){
          return res.json("_id ou params manquant");
        }

        if(req.role !== "manager"){
            return res.json("vous n'avez pas les roles nécessaires");
        }
        const User = req.app.get("models").User;
        const ToModifyUser = await User.findById(req.body._id);
        const ToModifyUserKeys = Object.keys(req.body.toModify);
        for(const key of ToModifyUserKeys){
            ToModifyUser[key] = req.body.toModify[key];
        }
        await ToModifyUser.save();
       return res.json(ToModifyUser);
    } catch (error) {
        res.json(error.message);
    }
}

async function userDelete(req, res) {
    try {
        if(!req.body._id){
            res.json("_id manquant")
        }

        // verification du role via le middleware
        if(req.role !== "manager"){
            return res.json("non authorisé ")
        }

        const User = req.app.get("models").User;
        const ToDeleteUser = await User.findById(req.body._id);
       await ToDeleteUser.remove();
        res.json("Delete successfully");
    } catch (error) {
        res.json(error.message);
    }
}

async function userLogin(req, res) {
    try {
        if(!req.body._id || !req.body.password){
            res.json("_id ou password manquant");
        }
        const User = req.app.get("models").User;
        const toVerifyUser = await User.findById(req.body._id);

        if(!toVerifyUser){
            res.json("user not found");
        }
        res.json(decryptPassword(toVerifyUser,req.body.password));
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = {userGet, userCreate, userDelete, userUpdate, userLogin};