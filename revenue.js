var address = ["115p7UMMngoj1pMvkpHijcRdfJNXj6LrLn", "12t9YDPgwueZ9NyMgw519p7AA8isjr6SMw", "13AM4VW2dhxYgXeQepoHkHSQuy6NgaEb94"];
var baseAddress = "https://btc.blockr.io/api/v1/address/";
var exchangeAddress = "https://bitpay.com/api/rates";
var parsedData = {};
var exchangeRate = {};

function getJson(base, tag, address, cb) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            var data = JSON.parse(xhttp.responseText);

            if ( status in data && data.status != "success" ) {
                console.log("error");
                return;
            }
            cb(data);
        }
    }

    xhttp.open("GET", base + tag + address.join(","));
    xhttp.send();
}

function getBalance() {
    var tag = "balance/";
    var add = address;

    getJson(baseAddress, tag, add, parseBalance);
    getRate();
}

function getRate() {
    var tag = "";
    var add = []

    getJson(exchangeAddress, tag, add, parseExchange);
}

function parseTransactions(jsonDump) {
    var chartData = [];

    for ( var i = 0; i < address.length; i++ ) {
        var addressObj = jsonDump.data[i].txs;

        for ( var j in addressObj ) {
            var time = addressObj[j].time_utc.split("T");

            // If the date doesn't exist, create it;
            if ( !(time[0] in parsedData) ) {
                parsedData[time[0]] = [];
                parsedData[time[0]].push( {
                    totalAmount: 0
                });
            }

            // Save Data
            parsedData[time[0]].push( {
                time: time[1],
                amount: addressObj[j].amount
            });

            parsedData[time[0]][0].totalAmount += addressObj[j].amount;
        }
    }

    var keyList = Object.keys(parsedData);

    for ( var k = 0; k < keyList.length; k++ ) {
        var key = keyList[k]

        if (key === "_meta") {
            continue;
        }

        chartData.push({
            date: key,
            amount: parsedData[key][0].totalAmount
        });
    }
    return chartData;
}

function parseBalance(jsonDump) {
    parsedData._meta = {
        totalBTC: 0
    }

    for ( var i = 0; i < address.length; i++ ) {
        parsedData._meta[ jsonDump.data[i].address ] = jsonDump.data[i].balance;
        parsedData._meta.totalBTC += jsonDump.data[i].balance;
    }

    updateDOM("btcAmount", parsedData._meta.totalBTC);
}

function parseExchange(jsonDump) {
    for ( var i = 0; i < jsonDump.length; i++ ) {
        exchangeRate[ jsonDump[i].code ] = {
            name: jsonDump[i].name,
            rate: jsonDump[i].rate
        }
    }
    console.log(exchangeRate);
}

function updateDOM(id, value) {
    document.getElementById(id).innerHTML = value;
}

document.addEventListener("DOMContentLoaded", getBalance);
