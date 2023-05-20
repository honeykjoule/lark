const express = require('express');
const app = express();
//import routes from ./routes

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));