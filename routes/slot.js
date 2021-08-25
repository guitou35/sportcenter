const {slotGet , slotCreate, slotUpdate, slotDelete, slotBook} = require("../controllers/slot");

function slotRoute(app){
    // read
    app.get("/slots", slotGet);

    //create
    app.post("/slotCreate", slotCreate);

    //Update
    app.post("/slotBook", slotBook);

    //Update
    app.post("/slotUpdate", slotUpdate);

    // Delete
    app.post("/slotDelete", slotDelete);

}

module.exports = slotRoute;