const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);
const settings = {
    timestampsInSnapshots: true
};
admin.firestore().settings(settings);
const db = admin.firestore();
const FieldValue = require('firebase-admin').firestore.FieldValue;

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({
    extended: false
}))

exports.webApi = functions.https.onRequest(main);

/* Document Refernces */
// Events List Collection
const el_col = 'EventsList';
// Event Details Collection
const ed_col = 'EventDetails';
// Past Events Collection
const pe_col = 'PastEvents'


// API End Points

/**
 * Get the latest upcoming event
 * 
 * */
app.get('/upcomingEvent', (req, res) => {
     db.collection(el_col).orderBy('date').limit(1)
        .get()
        .then(snapshot => {
            return snapshot.docs.map(doc => {
                return doc.data();
            });
        })
        .then(data => res.status(200).send(data))
        .catch(err => res.status(500).send({message: 'Server Error', error: err}));
});

/**
 * Get the last two past events
 * 
 * */
app.get('/pastEvents', (req, res) => {
    db.collection(pe_col).orderBy('date', 'desc').limit(2)
       .get()
       .then(snapshot => {
           return snapshot.docs.map(doc => {
               return doc.data();
           });
       })
       .then(data => res.status(200).send(data))
       .catch(err => res.status(500).send({message: 'Server Error', error: err}));
});
