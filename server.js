const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {

    res.sendFile( path.resolve( __dirname, "\index.html"));
    

});

app.use( express.static("public"));

app.listen( PORT, () => {

    console.log('App listening on: ' + PORT + "!" );

    
});