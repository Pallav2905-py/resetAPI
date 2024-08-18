const express = require('express')
const app = express()
const port = 3000


var admin = require("firebase-admin");

var serviceAccount = require("./cred.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get('/reset', async (req, res) => {
    try {
        const usersSnapshot = await db.collection('RudrastraUsers')
            .where('activePlan.planType', '==', 'demo')
            .get();

        if (usersSnapshot.empty) {
            console.log('No demo users found.');
            res.send('No demo users found.');
            return;
        }

        const batch = db.batch();
        usersSnapshot.docs.forEach(doc => {
            batch.update(doc.ref, { ApiRequests: [] });
        });
        await batch.commit();
        console.log('ApiRequests field reset for all demo users.');
        res.send('ApiRequests field reset for all demo users.');
    } catch (error) {
        console.error('Error resetting ApiRequests:', error);
        res.send('Error resetting ApiRequests:', error);
    }
})

app.get('/',(req,res)=>{
    res.send("Hello World! ")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})