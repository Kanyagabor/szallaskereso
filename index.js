import express from "express";
import szallasok from "./routes/szallasok.js";
import varosok from "./routes/varosok.js";
import orszagok from "./routes/orszagok.js";
import ajanlatok from "./routes/ajanlat.js";
import legjobb from "./routes/legjobb.js";


const app= express();


app.use("/szallasok",szallasok);
app.use("/varosok",varosok);
app.use("/orszagok",orszagok);
app.use("/ajanlat", ajanlatok);
app.use("/legjobb", legjobb);


app.listen(3000, ()=> console.log(`fut a szero http://localhost:3000`))