const encryptPassword = require("../utils/encryptPassword");

async function slotGet(req, res) {
    try {
        const Slot = req.app.get("models").Slot;

        const MySlots = await Slot.find();

        return res.json(MySlots);
    } catch (error) {
        return res.json(error.message);
    }
}

async function slotCreate(req, res) {
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


        // crée une instance de customer
        const NewSlot = await new models.Slot({
            date: req.body.date,
            startHour: req.body.startHour,
            endHour: req.body.endHour,
            label : req.body.label,
            coach: req.body.coach,
            peopleLimit: req.body.peopleLimit,
            customers: [],
        }).save();

        let theCoach = await models.Coach.findById(req.body.coach);
        theCoach.slots.push(NewSlot._id);

        await theCoach.save();

        return res.json(NewSlot);
    } catch (error) {
        return res.json(error.message);
    }
}

async function slotBook(req, res){
    try {
         if (!req.body.token) {
            return res.json("le token n'est pas renseigné");
        }

        if (req.role !== "customer") {
            return res.json("vous n'avez pas les roles nécessaires");
        }

        const models = req.app.get("models");
        const theSlot = await models.customer.findById(req.body.slot);

        if(theSlot.customers.length >= theSlot.peopleLimit){
            return res.json("plus de place disponible");
        }

        const theCustomer = await models.customer.findById(req.body.customer).populate("subscriptions");

        //vérifier si la subscription est valide avec la date du slot
        let isSuscribed = false;
        for(const subscription of theCustomer.subscriptions){
            if(subscription.beginningDate <= theSlot.date && subscription.endDate >= theSlot.date){
                isSuscribed = true;
            }
        }

        if(isSuscribed){
            theSlot.customers.push(theCustomer._id);
            await theSlot.save();
            theCustomer.slots.push(theSlot._id);
            await theCustomer.save();
            return res.json("Success");
        }else{
            return res.json("no subscription for the slot date");
        }

    } catch (error) {
        res.json(error.message);
    }
}

async function slotUpdate(req, res) {
    try {
        if (!req.body.token) {
            return res.json("le token n'est pas renseigné");
        }

        if (req.role !== "coach") {
            return res.json("vous n'avez pas les roles nécessaires");
        }


        const Slot = req.app.get("models").Slot;
        const ToModifySlot = await Slot.findById(req.body._id);
        const ToModifySlotKeys = Object.keys(req.body.toModify);
        for (const key of ToModifySlotKeys) {
            ToModifySlot[key] = req.body.toModify[key];
        }
        await ToModifySlot.save();
        return res.json(ToModifySlot);
    } catch (error) {
        res.json(error.message);
    }
}

async function slotDelete(req, res) {
    try {
        if (!req.body._id) {
            return  res.json("_id manquant")
        }

        if (req.role !== "coach") {
            return res.json("vous n'avez pas les roles nécessaires");
        }
        const models = req.app.get("models");

        let toDeleteSlot = await models.Slot.findById(req.body._id);

        if(!toDeleteSlot){
            res.json("Slot not found");
        }

        //delete le slot sur l'ensemble des customers
        for(const customer of toDeleteSlot.customers){
            let theCustomer = await models.customer.findById(customer);
            let toDeleteIndex = theCustomer.slots.indexOf(toDeleteSlot._id);
            theCustomer.slots.splice(toDeleteIndex, 1);
            await theCustomer.save();
        }

        //delete slot au niveau du coach
        let theCoach = await models.coach.findById(toDeleteSlot.coach);
        let toDeleteIndex = theCoach.slots.indexOf(toDeleteSlot._id);
        theCoach.slots.splice(toDeleteIndex, 1);
        await theCoach.save();

        await toDeleteSlot.remove();
        return  res.json("Delete successfully");
    } catch (error) {
        return  res.json(error.message);
    }
}


module.exports = {slotGet , slotCreate, slotUpdate, slotDelete, slotBook};