$(function () {
    
    $('#sump-water-level').highcharts({
    
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        
        title: {
            text: 'Sump water level'
        },
        
        pane: {
            startAngle: -150,
            endAngle: 150,
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
           
        // the value axis
        yAxis: {
            min: -70,
            max: 0,
            
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
                rotation: 'auto'
            },
            title: {
                text: 'cm'
            },
            plotBands: [{
                from: -70,
                to: -46,
                color: '#55BF3B' // green
            }, {
                from: -46,
                to: -38,
                color: '#DDDF0D' // yellow
            }, {
                from: -38,
                to: 0,
                color: '#DF5353' // red
            }]        
        },
    
        series: [{
            name: 'Distance',
            data: [-70],
            tooltip: {
                valueSuffix: ' cm'
            }
        }]
    
    }, 
    // Refresh every few minutes
    function (chart) {
        function refresh() {
            var point = chart.series[0].points[0],
                newVal;
            $.getJSON('/dashboard/getJsonData.php?field=SumpPit', function(response){
                    newVal = response.waterDepth;
            });
            point.update(newVal);
        }
        refresh();
	if (!chart.renderer.forExport) {
	    setInterval(refresh, 60000);
	}
    });
});