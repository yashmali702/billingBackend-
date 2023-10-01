const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const config = require('./config');
const cors = require('cors');

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)
app.use(cors());



const db = require('./actions/queries')
app.post('/api/create-vendor', db.createVen);
// app.post('/api/create-product', db.createPro);
app.get('/api/Items', db.getItems)
app.get('/api/Items/:Name', db.getItemsById)
app.post('/api/Items', db.createItems)
app.put('/api/Items/:Name', db.updateItems)
app.delete('/api/Items/:Name', db.deleteItems)




// app.use((req, res) => {
//     res.status(404).json({
//         errors: {
//             global: "Still working on it. Please try again later when we implement it."
//         }
//     });
// });


// port listening
app.listen(config.port, () => {
    console.log(`App running on port ${config.port}.`)
})