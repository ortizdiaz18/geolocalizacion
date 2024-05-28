const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./app/routes");



app.use(cors());
app.use(express.json());

app.use("/api/v1", router);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listen in ${PORT}`);   
});
