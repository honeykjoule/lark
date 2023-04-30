const express = require ("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/api/public", (req, res) => {
	var boolValue = true;
	res.json({ success: true, boolValue });
});

app.listen(port, () => {
	console.log("Server is running on " + port);
});