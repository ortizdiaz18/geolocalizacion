const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./app/routes");



app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.listen(3000, () => {
    console.log(`Listen in 3000`);   
});
