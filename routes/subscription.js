const {subscriptionGet , subscriptionCreate, subscriptionUpdate, subscriptionDelete} = require("../controllers/subscription");

function subscriptionRoute(app){
    // read
    app.get("/subscriptions", subscriptionGet);

    //create
    app.post("/subscriptionCreate", subscriptionCreate)

    //Update
    app.post("/subscriptionUpdate", subscriptionUpdate)

    // Delete
    app.post("/subscriptionDelete", subscriptionDelete)
}

module.exports = subscriptionRoute;