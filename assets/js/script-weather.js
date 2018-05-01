//Onload Action
weatherSearch("name", "Hong Kong");

//Function
function weatherSearch(index, keyword) {
    $.ajax({
        type: "GET",
		url: "https://assigment2-305cde.herokuapp.com/" + "weathers/" + index + "=" + keyword,
		format:"jsonp",
		dataType: "jsonp",
		beforeSend: function(){	            
			$("#loader").show();
		},
		success : function(data) {
			if(data.cod != "404"){
            	$(".city-name").html(data.name);
        		$(".city-country").html(data.sys.country);
            	$(".city-icon").attr("src", "https://openweathermap.org/img/w/" + data.weather['0'].icon + ".png");
            	$(".city-temp").html(data.main.temp);
            	$(".city-wind").html(data.main.temp + " km/h") ;
            	$(".city-clound").html(data.weather['0'].description);
            	$(".city-pressure").html(data.main.pressure + " hpa");
            	$(".city-humidity").html(data.main.humidity + " %");
            	$(".city-sunrise").html(timeStampOnlyTime(data.sys.sunrise));
            	$(".city-sunset").html(timeStampOnlyTime(data.sys.sunset));
            	$(".city-geo").html("[" + data.coord.lon + ", " + data.coord.lat + "]");
            	$(".city-update-time").html(timeStamp(data.dt));
		    	$("#keyword").val("");
				$("#system-message").html("");
				$("#error-message").html("");
				$("#add-system-message").html("");
				$("#add-error-message").html("");
				$("#favourites-system-message").html("");
				$("#favourites-error-message").html("");
			} else {
				$("#system-message").html("");
				$("#error-message").html(data.cod + " " + data.message);
			}
         },
		error : function(e) {
			$("#system-message").html("");
			$("#error-message").html("Fail to search " + e.responseText);
		},
		complete : function(data) {
			$("#loader").hide();
		}
	});
    
    $.ajax({
        type: "GET",
		url: "https://assigment2-305cde.herokuapp.com/" + "forecasts/" + index + "=" + keyword,
		format:"jsonp",
		dataType: "jsonp",
		beforeSend: function(){	            
			$("#loader").show();
		},
		success : function(data) {
			if(data.cod != "404"){
				var labels = [
					timeStampOnlyDate(data.list['0'].dt),
					timeStampOnlyDate(data.list['1'].dt),
					timeStampOnlyDate(data.list['2'].dt),
					timeStampOnlyDate(data.list['3'].dt),
					timeStampOnlyDate(data.list['4'].dt),
					timeStampOnlyDate(data.list['5'].dt),
					timeStampOnlyDate(data.list['6'].dt) ];
				var datas = [ 
					data.list['0'].temp.day,
					data.list['1'].temp.day,
					data.list['2'].temp.day,
					data.list['3'].temp.day,
					data.list['4'].temp.day,
					data.list['5'].temp.day,
					data.list['6'].temp.day ];
				var icons = [ 
					data.list['0'].weather[0].icon,
					data.list['1'].weather[0].icon,
					data.list['2'].weather[0].icon,
					data.list['3'].weather[0].icon,
					data.list['4'].weather[0].icon,
					data.list['5'].weather[0].icon,
					data.list['6'].weather[0].icon ];
				var winds = [ 
					data.list['0'].speed,
					data.list['1'].speed,
					data.list['2'].speed,
					data.list['3'].speed,
					data.list['4'].speed,
					data.list['5'].speed,
					data.list['6'].speed ];
				var pressures = [ 
					data.list['0'].pressure,
					data.list['1'].pressure,
					data.list['2'].pressure,
					data.list['3'].pressure,
					data.list['4'].pressure,
					data.list['5'].pressure,
					data.list['6'].pressure ];
				showChart(labels,datas);
				showSummary(datas,icons,winds,pressures);
				$("#system-message").html("");
				$("#error-message").html("");
			} else {
				$("#system-message").html("");
				$("#error-message").html(data.cod + " " + data.message);
			}
         },
		error : function(e) {
			$("#system-message").html("");
			$("#error-message").html("Fail to search " + e.responseText);
		},
		complete : function(data) {
			$("#loader").hide();
		}
	});
}

function timeStamp(timestamp) {
	var temp = new Date(timestamp*1000);
	var date = [ temp.getMonth() + 1, temp.getDate(), temp.getFullYear() ];
	var time = [ temp.getHours(), temp.getMinutes(), temp.getSeconds() ];
	var suffix = (time[0] < 12) ? "AM" : "PM";
	time[0] = (time[0] < 12) ? time[0] : time[0] - 12;
	time[0] = time[0] || 12;
	for (var i = 1; i < 3; i++) {
		if (time[i] < 10) {
			time[i] = "0" + time[i];
		}
	}
	return date.join("/") + " " + time.join(":") + " " + suffix;
}

function timeStampOnlyTime(timestamp) {
	var temp = new Date(timestamp*1000);
	var time = [ temp.getHours(), temp.getMinutes(), temp.getSeconds() ];
	var suffix = (time[0] < 12) ? "AM" : "PM";
	time[0] = (time[0] < 12) ? time[0] : time[0] - 12;
	time[0] = time[0] || 12;
	for (var i = 1; i < 3; i++) {
		if (time[i] < 10) {
			time[i] = "0" + time[i];
		}
	}
	return time.join(":") + " " + suffix;
}

function timeStampOnlyDate(timestamp) {
	var temp = new Date(timestamp*1000);
	var date = [ temp.getMonth() + 1, temp.getDate(), temp.getFullYear() ];
	return date.join("/");
}

var showChart = function(labels, datas) {
	//Init Chart
	Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
	Chart.defaults.global.defaultFontColor = '#292b2c';
	$('#results-graph').remove(); // this is my <canvas> element
	$('#graph-container').append('<canvas id="results-graph" width="85%" height="35"></canvas>');
	var myLineChart = new Chart($('#results-graph'), {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: "Temperatures",
				lineTension: 0.3,
				backgroundColor: "rgba(2,117,216,0.2)",
				borderColor: "rgba(2,117,216,1)",
				pointRadius: 5,
				pointBackgroundColor: "rgba(2,117,216,1)",
				pointBorderColor: "rgba(255,255,255,0.8)",
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(2,117,216,1)",
				pointHitRadius: 20,
				pointBorderWidth: 2,
				data: datas,
			}],
		},
		options: {
			scales: {
				xAxes: [{
					time: {
						unit: 'date'
					},
					gridLines: {
						display: false
					},
					ticks: {
						maxTicksLimit: 7
					}
				}],
				yAxes: [{
					ticks: {
						min: 0,
						max: 50,
						maxTicksLimit: 5
					},
					gridLines: {
						color: "rgba(0, 0, 0, .125)",
					}
				}],
			},
			legend: {
				display: false
			}
		}
	});	
}

var showSummary = function(datas, icons, winds, pressures) {
	$("#forecast-icons").html("");
	for (var i = 0; i < datas.length; i++) { 
		$("#forecast-icons").append("<div class='col forecast-icons-item'><img src='https://openweathermap.org/img/w/" + icons[i] + ".png'><div title='Temp'>" + datas[i] + " °C</div><div title='Wind'>" + winds[i] + " m/s</div><div title='Pressure'>" + pressures[i] + " hpa</div></div>");
	}
	
}
