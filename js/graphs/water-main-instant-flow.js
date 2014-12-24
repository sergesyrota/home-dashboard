$(function () {
    var lastUpdateTime,
        lastValue;
    $('#water-main-instant-flow').highcharts({
    
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        
        title: {
            text: 'Water flow'
        },
        
        pane: {
            startAngle: -150,
            endAngle: 130,
            background: [{
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#FFF'],
                        [1, '#333']
                    ]
                },
                borderWidth: 0,
                outerRadius: '109%'
            }, {
                backgroundColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, '#333'],
                        [1, '#FFF']
                    ]
                },
                borderWidth: 1,
                outerRadius: '107%'
            }, {
                // default background
            }, {
                backgroundColor: '#DDD',
                borderWidth: 0,
                outerRadius: '105%',
                innerRadius: '103%'
            }]
        },
        plotOptions: {
            gauge: {
                wrap: false
            }
        },
        // the value axis
        yAxis: {
            min: 0,
            max: Math.pow(300, 1),
            
            minorTickInterval: 'auto',
            minorTickWidth: 1,
            minorTickLength: 10,
            minorTickPosition: 'inside',
            minorTickColor: '#666',
    
            tickPixelInterval: 30,
            tickWidth: 2,
            tickPosition: 'inside',
            tickLength: 10,
            tickColor: '#666',
            labels: {
                step: 2,
                rotation: 'auto',
            },
            title: {
                text: 'gph'
            },
            plotBands: [{
                from: 0,
                to: Math.pow(300, 1),
                color: '#9999FF' // blue
                //color: '#55BF3B' // green
            }, /*{
                from: Math.pow(100, 1),
                to: Math.pow(140, 1),
                color: '#DDDF0D' // yellow
            }, {
                from: Math.pow(140, 1),
                to: Math.pow(300, 1),
                color: '#DF5353' // red
            }*/]
        },
        series: [{
            name: 'Flow rate',
            data: [0],
            tooltip: {
                valueSuffix: ' gph'
            },
            overshoot: 15
        }]
    
    }, 
    // Refresh every few seconds
    function (chart) {
        function refresh() {
            var point = chart.series[0].points[0],
                currentValue;
            var d = new Date();
            var timeNow = d.getTime();
            var timeElapsed = timeNow - lastUpdateTime;
            lastUpdateTime = timeNow;
            $.getJSON('/dashboard/getJsonData.php?field=WaterMeterGal', function(response){
                    currentValue = response.totalGallons;
            });

            // Update total water usage on the page, and save last reading in global var so that we can do reset properly
            $('#total-water-usage').text(Math.round((currentValue - waterMeterStart)*100)/100);
            lastWaterMeterReading = currentValue;

            var newChartVal = 3600000 * (currentValue - lastValue) / (timeElapsed);
            point.update(Math.round(100*newChartVal)/100);
            lastValue = currentValue;
        }
        refresh();
        if (!chart.renderer.forExport) {
            setInterval(refresh, 5000);
        }
    });
});
