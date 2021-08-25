const encryptPassword = require("../utils/encryptPassword");

async function subscriptionGet(req, res) {
    try {
        const Subscription = req.app.get("models").Subscription;

        const MySubscriptions = await Subscription.find().populate("user");

        return res.json(MySubscriptions);
    } catch (error) {
        return res.json(error.message);
    }
}

async function subscriptionCreate(req, res) {
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
        const NewSubscription = await new models.Subscription({
            beginningDate: req.body.beginningDate,
            endDate: req.body.paymentMethod,
            paymentMethod: req.body.paymentMethod,
            amountPaid : req.body.amountPaid,
            customer: req.body.customer,
        }).save();

        let theCustomer = await models.Customer.findById(req.body.customer);
        theCustomer.subscriptions.push(NewSubscription._id);

        await theCustomer.save();

        return res.json(NewSubscription);
    } catch (error) {
        return res.json(error.message);
    }
}

async function subscriptionUpdate(req, res) {
    try {
        if (!req.body._id || !req.body.toModify) {
            return res.json("_id ou params manquant");
        } else if (!req.body.token) {
            return res.json("le token n'est pas renseigné");
        }

        if (req.role !== "manager") {
            return res.json("vous n'avez pas les roles nécessaires");
        }


        const Subscription = req.app.get("models").Subscription;
        const ToModifySubscription = await Subscription.findById(req.body._id);
        const ToModifySubscriptionKeys = Object.keys(req.body.toModify);
        for (const key of ToModifySubscriptionKeys) {
            ToModifySubscription[key] = req.body.toModify[key];
        }
        await ToModifySubscription.save();
        return res.json(ToModifySubscription);
    } catch (error) {
        res.json(error.message);
    }
}

async function subscriptionDelete(req, res) {
    try {
        if (!req.body._id) {
          return  res.json("_id manquant")
        }

        if (req.role !== "manager") {
            return res.json("vous n'avez pas les roles nécessaires");
        }
        const models = req.app.get("models");

        let toDeleteSubscription = await models.Subscription.findById(req.body._id)

        // permet de retrouver le customer qui est associé à la souscription
        let theCustomer = await models.Customer.findById(toDeleteSubscription.customer);

        let toDeleteIndex = theCustomer.subscriptions.indexOf(toDeleteSubscription._id);

        theCustomer.subscriptions.splice(toDeleteIndex, 1);
        await theCustomer.save();

        await toDeleteSubscription.remove();

      return  res.json("Delete successfully");
    } catch (error) {
      return  res.json(error.message);
    }
}


module.exports = {subscriptionGet , subscriptionCreate, subscriptionUpdate, subscriptionDelete};