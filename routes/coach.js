const {coachGet , coachCreate, coachUpdate, coachDelete} = require("../controllers/coach");

function coachRoute(app){
    // read
    app.get("/coachs", coachGet);

    //create
    app.post("/coachCreate", coachCreate)

    //Update
    app.post("/coachUpdate", coachUpdate)

    // Delete
    app.post("/coachDelete", coachDelete)

}

module.exports = coachRoute;