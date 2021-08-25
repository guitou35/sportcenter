// on charge la librairie express pour le serveur
const express = require("express");

// on charge la librairie mongoose pour la BDD mongodb
const mongoose = require("mongoose");

// on charge tous les models
const models = require("./models");

// on charge le middleware
const getRoleMiddleware = require("./utils/getRoleMiddleware");

// je crée l'application d'express
const app = express() ;

const userRoute = require("./routes/user");
const customerRoute = require("./routes/customer");
const coachRoute = require("./routes/coach");
const subscriptionRoute = require("./routes/subscription");
const slotRoute = require("./routes/slot");

app.use(express.json());
app.use(getRoleMiddleware);

app.set("models", models);

// connexion à la BDD
mongoose.connect("mongodb://localhost/sportCenters", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

// Je transmets le chemin à l'application pour la Routes
userRoute(app);
customerRoute(app);
coachRoute(app);
subscriptionRoute(app);
slotRoute(app);

// utiliser set ou export (linux) pour set la variable PORT
const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`Listening on port ${port} `)
    });