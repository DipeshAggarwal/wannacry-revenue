var address = ["115p7UMMngoj1pMvkpHijcRdfJNXj6LrLn", "12t9YDPgwueZ9NyMgw519p7AA8isjr6SMw", "13AM4VW2dhxYgXeQepoHkHSQuy6NgaEb94"];
var baseAddress = "https://btc.blockr.io/api/v1/address/";
var parsedData = {};

function getJson(tag, address, cb) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            var data = JSON.parse(xhttp.responseText);

            if ( data.status != "success" ) {
                console.log("error");
                return;
            }
            cb(data);
        }
    }

    xhttp.open("GET", baseAddress + tag + address.join(","));
    xhttp.send();
}

function getTransactions() {
    var tag = "txs/";
    var add = address;

    getJson(tag, add, parseTransactions);
}

function getBalance() {
    var tag = "balance/";
    var add = address;

    getJson(tag, add, parseBalance);
    getTransactions();
}

function parseTransactions(jsonDump) {

    for ( var i = 0; i < address.length; i++ ) {
        var addressObj = jsonDump.data[i].txs;

        for ( var j in addressObj ) {
            var time = addressObj[j].time_utc.split("T");

            // If the date doesn't exist, create it;
            if ( !(time[0] in parsedData) ) {
                parsedData[time[0]] = [];
                parsedData[time[0]].push( {
                    totalAmount: 0
                })
            }

            // Save Data
            parsedData[time[0]].push( {
                time: time[1],
                amount: addressObj[j].amount
            });

            parsedData[time[0]][0].totalAmount += addressObj[j].amount;
        }
    }
}

function parseBalance(jsonDump) {
    parsedData._meta = {
        totalBTC: 0
    }

    for ( var i = 0; i < address.length; i++ ) {
        parsedData[ jsonDump.data[i].address ] = jsonDump.data[i].balance;
        parsedData._meta.totalBTC += jsonDump.data[i].balance;
        console.log(jsonDump.data[i].balance, parsedData._meta.totalBTC)
    }

    updateDOM("btcAmount", parsedData._meta.totalBTC);
}

function updateDOM(id, value) {
    document.getElementById(id).innerHTML = value;
}

document.addEventListener("DOMContentLoaded", getBalance);
