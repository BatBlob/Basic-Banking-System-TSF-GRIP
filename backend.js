const http = require('http');
const express = require('express');
var cors = require('cors')
// const bodyParser = require('body-parser');
// const { stringify } = require('qs');
const socketio = require('socket.io');
const multer = require('multer');
// const upload = multer({dest:__dirname + "/src/assets"});

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/';
var ObjectId = require('mongodb').ObjectId;

const app = express();
const server = http.createServer(app);
// const io = socketio(server);
const io = socketio(server,{
    cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true,
            transports: ['websocket', 'polling'],
    },
    allowEIO3: true
    });
const PORT = process.env.PORT || 3000


const fs = require('fs');

app.use(cors());
// app.use(bodyParser.json());

Initial_Balance = 1000

// Create/Check Database and Collections
MongoClient.connect(url, function(err, db) {
    var dbo = db.db("Basic_Banking_Application");
    if (err) throw err;

    dbo.listCollections().toArray().then(async function(res) {
        names = []
        res.forEach(element => names.push(element.name));
        
        if (names.indexOf("Customers") === -1 && names.indexOf("Transfers") === -1)
        {
            console.log("Collections do not exist!");
            await dbo.createCollection("Customers", async function(err, res) {
                if (err) throw err;
                console.log("Customers Collection created.");

                let customers;
                customers = fs.readFileSync('customer_names.txt', { encoding: 'utf8', flag: 'r' }).split('\r\n');
                to_insert = [];
                for (name of customers) {
                    to_insert.push({Name: name, Balance: Initial_Balance});
                }
                await dbo.collection("Customers").insertMany(to_insert, function(err, res) {
                    if (err) throw err;
                    db.close();
                });
                console.log("Customers Collection Populated.");

                db.close();
            });
            
            await dbo.createCollection("Transfers", function(err, res) {
                if (err) throw err;
                console.log("Transfers Collection created.");
                db.close();
            });

        }
        else {
            console.log("Collections exist.");
            db.close();
        }
    });

    console.log("working");
});

app.get('/', (req, res) => res.send('hello!'));

function retrieveNames(socket) {
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("Basic_Banking_Application");
        if (err) throw err;

        dbo.collection("Customers").find({}).toArray(function(err, result) {
            if (err) throw err;
            // console.log(result);
            db.close();
            io.to(socket.id).emit("getcustomers", result);
            // var final_cust = [];
            // // console.log(cust);
            // for(x of result) {
            //     delete x["_id"];
            //     final_cust.push(JSON.stringify(x));
            // }
            // // io.to(socket.id).emit("getcustomers", "sex, sex2");
            // io.to(socket.id).emit("getcustomers", final_cust.toString());
        });
    });
}

function transfer(details, socket) {
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("Basic_Banking_Application");
        if (err) throw err;
        dbo.collection("Customers").findOne({"_id": ObjectId(details.from)}, function(err, result1) {
            if (err) throw err;
            dbo.collection("Customers").findOne({_id: ObjectId(details.to)}, async function(err, result2) {
                if (err) throw err;
                // console.log(details);
                // console.log(result1, result2)   ;
                if (details.amount != "" && result1.Balance >= details.amount && (result1 !== undefined && result2 !== undefined)) {
                    console.log(typeof details.amount, details.amount);
                    await dbo.collection("Customers").updateOne({_id: ObjectId(details.from)}, {$set: {Balance: result1.Balance - details.amount}});
                    await dbo.collection("Customers").updateOne({_id: ObjectId(details.to)}, {$set: {Balance: result2.Balance + details.amount}});
                    await dbo.collection("Transfers").insertOne({Sender: ObjectId(details.from), Recipient: ObjectId(details.to), Amount: details.amount, Time: new Date()});
                    db.close();
                    io.to(socket.id).emit("transferstatus", "true");
                }
                else {
                    db.close();
                    io.to(socket.id).emit("transferstatus", "false");
                }
            });
            // db.close();
        });
    });
}

function retrieve_transfers(socket) {
    MongoClient.connect(url, function(err, db) {
        var dbo = db.db("Basic_Banking_Application");
        if (err) throw err;
        dbo.collection("Transfers").find({}).toArray(async function(err, result) {
            if (err) throw err;
            for(x in result) {
                result[x]["Sender"] = await dbo.collection("Customers").findOne({"_id": ObjectId(result[x].Sender)}, {projection: {_id: 0, Name: 1}});
                result[x]["Sender"] = result[x]["Sender"]["Name"]

                result[x]["Recipient"] = await dbo.collection("Customers").findOne({"_id": ObjectId(result[x].Recipient)}, {projection: {_id: 0, Name: 1}});
                result[x]["Recipient"] = result[x]["Recipient"]["Name"]
            }
            console.log(result);
            io.to(socket.id).emit("requesttransfers", result);
            db.close();
        });
    });
}

io.on("connection", (socket) => {
    console.log("new connection " + socket.client.id);
    
    socket.on("disconnect", () => {
        console.log("disconnected " + socket.client.id);
    });

    socket.on("getcustomers", async () => {
        console.log(socket.client.id + " requested");
        retrieveNames(socket);
    });

    socket.on("transfer", async (details) => {
        console.log("transfer request");
        transfer(details, socket);
    });

    socket.on("requesttransfers", async (details) => {
        console.log("requesting transfer list");
        retrieve_transfers(socket);
    });

});

server.listen(PORT, () => {
    console.log("listening on *:" + PORT)
})