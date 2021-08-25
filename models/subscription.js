const mongoose = require("mongoose");

// Création de la structure de la base de données
const SubscriptionSchema = new mongoose.Schema({
    beginningDate : {type: Date, required: true},
    endDate : {type: Date, required: true},
    paymentMethod : {type: String , required : true},
    amountPaid : {type : Number , default : 0},
    customer : {type: mongoose.Schema.Types.ObjectId, ref : "Customer"}
});

const Subscription = new mongoose.model("Subscription", SubscriptionSchema);

module.exports = Subscription;