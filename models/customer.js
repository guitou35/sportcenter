const mongoose = require("mongoose");

// Création de la structure de la base de données
const CustomerSchema = new mongoose.Schema({
    subscriptions : [{type: mongoose.Schema.Types.ObjectId , ref: "Subscription"}],
    level : {type: String, default: "beginner"},
    user : {type: mongoose.Schema.Types.ObjectId , ref: "User"},
    slots: [{type : mongoose.Schema.Types.ObjectId, ref: "slot"}]
});

const Customer = new mongoose.model("Customer", CustomerSchema);

module.exports = Customer;