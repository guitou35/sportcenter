const encryptPassword = require("../utils/encryptPassword");

async function customerGet(req, res) {
    try {
        const Customer = req.app.get("models").Customer;

        const MyCustomers = await Customer.find().populate("user").populate("subscriptions");

        return res.json(MyCustomers);
    } catch (error) {
        return res.json(error.message);
    }

}

async function customerCreate(req, res) {
    try {
        // je récupère le model customer depuis l'app global
        const models = req.app.get("models");
        if (!req.body.password) {
            res.json("mot de passe manquant")
        }

        // verification du role via le middleware
        if (req.role !== "manager") {
            return res.json("non authorisé ")
        }
        // je crypte le token
        const {token, salt, hash} = encryptPassword(req.body.password);
        // crée une instance de customer
        const NewUser = await new models.User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            token,
            salt,
            hash
        }).save();

        const NewCustomer = await models.Customer({user: NewUser._id}).save();

        return res.json(NewCustomer);
    } catch (error) {
        return res.json(error.message);
    }
}

async function customerUpdate(req, res) {
    try {
        if (!req.body._id || !req.body.toModify) {
            return res.json("_id ou params manquant");
        } else if (!req.body.token) {
            return res.json("le token n'est pas renseigné");
        }

        if (req.role !== "manager") {
            return res.json("vous n'avez pas les roles nécessaires");
        }


        const Customer = req.app.get("models").Customer;
        const ToModifyCustomer = await Customer.findById(req.body._id);
        const ToModifyCustomerKeys = Object.keys(req.body.toModify);
        for (const key of ToModifyCustomerKeys) {
            ToModifyCustomer[key] = req.body.toModify[key];
        }
        await ToModifyCustomer.save();
        return res.json(ToModifyCustomer);
    } catch (error) {
        res.json(error.message);
    }
}

async function customerDelete(req, res) {
    try {
        if (!req.body._id) {
            res.json("_id manquant")
        }
        const Customer = req.app.get("models").Customer;
        const User = req.app.get("models").User;
        const ToDeleteCustomer = await Customer.findById(req.body._id);
        await ToDeleteCustomer.remove();
        const ToDeleteUser = await User.findById(ToDeleteCoach.user);
        await ToDeleteUser.remove();
        res.json("Delete successfully");
    } catch (error) {
        res.json(error.message);
    }
}


module.exports = {customerGet, customerCreate, customerDelete, customerUpdate};