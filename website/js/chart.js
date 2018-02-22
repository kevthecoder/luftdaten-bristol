d3.csv("/data/luftdaten_sds011_sensor_7675_by_weekday_and_hour.csv", function(data) {
    var valueField = "P1";

    // Set data types
    data.forEach(function(d) {
        d.hourOfDay = +d.hourOfDay;
        d.P1 = +d.P1;
    });
    // console.log(data[0]);

    // The data for circular heat map list of values, one for each segment,
    // spiraling out from the centre outwards. This means we need to order
    // the rows by day of week and hour of day.

    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    // Make an lookup with order of days, e.g. {"Monday": 0, "Tuesday": 1, ...}
    var daysOrder = {};
    days.forEach( function (day, i) {
        daysOrder[day] = i;
    });
    console.log(daysOrder)

    // Set segment number for each day/hour (starting from Monday 00:00)
    data.forEach(function(d) {
        d.segmentId = (daysOrder[d.dayOfWeek] * 24) + d.hourOfDay
    });

    if (data.length !== 24 * 7) {
        throw new Error("Expected one weeks worth of data values, one for each hour of the day")
    }

    // Sort the data
    data.sort( function(a, b) {return a.segmentId - b.segmentId} );
    // Turn the data into a plain array of values
    // var values = data
    //     .sort( function(a, b) {return a.segmentId - b.segmentId} )
    //     .map( function (d) {return d[valueField]} );
    // console.log(values)

    // console.log(data);

    var chart = circularHeatChart()
        .accessor(function(d) {return d[valueField];})
        .segmentHeight(20)
        .innerRadius(20)
        .numSegments(24)
        // .radialLabels(dayIndex.map(function ()))
        .radialLabels(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])
        .segmentLabels(["Midnight", "1am", "2am", "3am", "4am", "5am", "6am", "7am", "8am", "9am", "10am", "11am", "Midday", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm", "8pm", "9pm", "10pm", "11pm"])
        .margin({top: 20, right: 0, bottom: 20, left: 280});

    // var energyData = [
    //     0.176042,0.096146,0.076414,0.334734,0.132583,0.135422,0.060884,0.768601,0.230771,0.07572,0.210855,0.090938,0.094296,0.290368,0.093755,0.099166,0.429278,0.962314,0.43833,0.244464,0.550621,0.173093,0.103659,0.0773,
    //     0.265913,0.099811,0.076164,0.3154,0.146557,0.108531,0.421608,0.120872,0.061825,0.101988,0.095364,0.365022,0.096741,0.095962,0.06409,0.300409,0.102083,0.134949,0.535842,0.224584,0.227262,0.28274,0.11842,0.062601,
    //     0.103968,0.088054,0.069683,0.141973,0.106082,0.135513,0.09906,0.099516,0.31927,0.097133,0.08595,0.067532,0.096042,0.09789,0.059053,0.11167,0.137408,0.109005,0.365752,0.179085,0.135975,0.199275,0.144186,0.053961,
    //     0.088226,0.09218,0.059777,0.125663,0.136192,0.121279,0.146825,0.267907,0.113706,0.09266,0.105833,0.130221,0.09695,0.078355,0.067088,0.093888,0.096131,0.152373,0.072957,0.095516,0.091731,0.14403,0.113989,0.089659,
    //     0.089808,0.085082,0.057542,0.09864,0.091152,0.066592,0.20529,0.12785,0.077798,0.071004,0.094316,0.088963,0.054368,0.091964,0.095114,0.071649,0.076153,0.150208,0.15751,0.065801,0.087791,0.100653,0.121987,0.161462,
    //     0.096507,0.093314,0.075191,0.07723,0.091846,0.095587,0.053434,1.017331,1.458327,0.120566,0.107582,0.139082,0.112224,0.159757,0.252278,0.161521,0.124628,0.080985,0.634034,0.248268,0.20864,0.14324,0.174345,0.165649,
    //     0.116201,0.119975,0.133551,0.138756,0.128587,0.171464,1.328931,0.318976,0.436703,0.109017,0.1716,0.324534,0.258161,0.20793,0.169164,0.191496,0.125737,0.320198,0.272419,0.222312,0.247595,0.192478,0.134997,0.152271
    //    ];

    //    console.log("energyData.length", energyData.length);

    d3.select('#chart')
        .selectAll('svg')
        .data([data])
        .enter()
        .append('svg')
        .call(chart);

        /* Add a mouseover event */
        d3.selectAll("#chart path").on('mouseover', function() {
        	var d = d3.select(this).data()[0],
                txt = d.dayOfWeek + ' ' + ("0" + d.hourOfDay).slice(-2) + ':00 has value ' + d[valueField];
            d3.select("#info").text(txt);
        });
        d3.selectAll("#chart svg").on('mouseout', function() {
            d3.select("#info").text('');
        });
});
