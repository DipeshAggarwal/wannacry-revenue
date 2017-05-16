 function drawChart () {
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
        width = window.innerWidth - margin.left - margin.right - 20;
        height = window.innerHeight - margin.top - margin.bottom - 20;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var svg = d3.select("body")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json(baseAddress + "txs/" + address.join(","), function(error, json) {
        var data = parseTransactions(json);

        x.domain(data.map(function(d) { return d.date; }));
        y.domain([0, d3.max(data, function(d) { return d.amount + 2; })]);

        svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0, " + height + ")")
                .call(xAxis);

        svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .text("Amount");

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
                .attr("class", "bar")
                .attr("fill","steelblue")
                .attr("x", function(d) { return x(d.date); })
                .attr("width", x.rangeBand())
                .attr("y", function(d) { return y(d.amount); })
                .attr("height", function(d) { return height - y(d.amount); });

        svg.selectAll(".bartext")
            .data(data)
            .enter().append("text")
                .attr("class", "bartext")
                .attr("text-anchor", "middle")
                .attr("stroke", "none")
                .attr("fill", "white")
                .attr("font-size", "1.6vw")
                .attr("x", function(d) { return x(d.date) + x.rangeBand()/2; })
                .attr("y", function(d) { return y(d.amount) + 30; })
                .text(function(d) { return d.amount; });
    });
}

document.addEventListener("DOMContentLoaded", drawChart);
