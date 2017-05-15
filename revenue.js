var address = ["115p7UMMngoj1pMvkpHijcRdfJNXj6LrLn", "12t9YDPgwueZ9NyMgw519p7AA8isjr6SMw", "13AM4VW2dhxYgXeQepoHkHSQuy6NgaEb94"];
var baseAddress = "https://btc.blockr.io/api/v1/address/txs/";
var parsedData = {};

function getRevenueJSON() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState === 4 && xhttp.status === 200) {
            var data = JSON.parse(xhttp.responseText);
            parseData(data);
            console.log(data);
        }
    }

    xhttp.open("GET", baseAddress + address.join(","));
    xhttp.send();
}

function parseData(jsonDump) {
    parsedData.totalBTC = 0;

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
            parsedData.totalBTC += addressObj[j].amount;
        }
    }

    //Update DOM
    updateDOM();
}

function updateDOM() {
    document.getElementById("btcAmont").innerHTML = parsedData.totalBTC;
}

document.addEventListener("DOMContentLoaded", getRevenueJSON);
