const {customerGet , customerCreate, customerUpdate, customerDelete} = require("../controllers/customer");

function customerRoute(app){
    // read
    app.get("/customers", customerGet);

    //create
    app.post("/customerCreate", customerCreate)

    //Update
    app.post("/customerUpdate", customerUpdate)

    // Delete
    app.post("/customerDelete", customerDelete)
}

module.exports = customerRoute;