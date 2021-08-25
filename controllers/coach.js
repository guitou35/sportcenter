const encryptPassword = require("../utils/encryptPassword");

async function coachGet(req, res) {
    try {
        const Coach = req.app.get("models").Coach;
        let MyCoach;
        if (req.body.discipline) {
             MyCoach = await Coach.find(
                {
                    discipline: req.query.discipline,
                }
            ).populate("user");
        } else {
             MyCoach = await Coach.find().populate("user");
        }
      return  res.json(MyCoach);
    } catch (error) {
      return  res.json(error.message);
    }

}

async function coachCreate(req, res) {
    try {
        // je récupère le model customer depuis l'app global
        const models = req.app.get("models");
        if(!req.body.password){
            res.json("mot de passe manquant")
        }

        // verification du role via le middleware
        if(req.role !== "manager"){
            return res.json("non authorisé ")
        }


        // je crypte le token
        const {token, salt, hash} = encryptPassword(req.body.password);
        // crée une instance de customer
        const NewUser = await new models.User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            role : "coach",
            token,
            salt,
            hash
        }).save();

        const NewCoach = await models.Coach({user: NewUser._id}).save();

        return res.json(NewCoach);
    } catch (error) {
        return res.json(error.message);
    }
}

async function coachUpdate(req, res) {
    try {
        if(!req.body._id || !req.body.toModify){
            return res.json("_id ou params manquant");
        }else if (!req.body.token){
            return res.json("le token n'est pas renseigné");
        }

        if(req.role !== "manager"){
            return res.json("vous n'avez pas les roles nécessaires");
        }


        const Coach = req.app.get("models").Customer;
        const ToModifyCoach = await Coach.findById(req.body._id);
        const ToModifyCoachKeys = Object.keys(req.body.toModify);
        for(const key of ToModifyCoachKeys){
            ToModifyCoach[key] = req.body.toModify[key];
        }
        await ToModifyCoach.save();
        return res.json(ToModifyCoach);
    } catch (error) {
        res.json(error.message);
    }
}

async function coachDelete(req, res) {
    try {
        if(!req.body._id){
            res.json("_id manquant")
        }

     /*   if(req.role !== "manager"){
            return res.json("vous n'avez pas les roles nécessaires");
        }
*/
        const Coach = req.app.get("models").Coach;
        const User = req.app.get("models").User;
        const ToDeleteCoach = await Coach.findById(req.body._id);
        await ToDeleteCoach.remove();
        const ToDeleteUser = await User.findById(ToDeleteCoach.user);
        await ToDeleteUser.remove();
        res.json("Delete successfully");
    } catch (error) {
        res.json(error.message);
    }
}


module.exports = {coachGet , coachCreate, coachUpdate, coachDelete};