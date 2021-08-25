const {userGet , userCreate, userUpdate, userDelete, userLogin} = require("../controllers/user");

function userRoute(app){
    // read
    app.get("/users", userGet);

    //create
    app.post("/userCreate", userCreate)

    //Update
    app.post("/userUpdate", userUpdate)

    // Delete
    app.post("/userDelete", userDelete)

    // login
    app.post("/userLogin", userLogin);
}

module.exports = userRoute;