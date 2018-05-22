/* 
//	- TILDE, TILD3, tild3, ~ and tilde are all js-library catch-words (so to speak) by Frank Elavsky at Northwestern University
//	- A special thanks on this project goes out to Nadieh Bremer (visualcinnamon.com) for amazing inspirations
//	- Also thanks to LIGO, CIERA, and all astrophysicists who have provided the data (see dataset.js for sources)
*/

tilde.download_large = document.cookie.indexOf("view_mode=publication")+1 ? true : false;

tilde.normalwidth = $(window).width();
tilde.largewidth = 2560;

tilde.windowwidth = tilde.normalwidth //tilde.download_large ? tilde.largewidth : tilde.normalwidth

tilde.shortheight = tilde.windowwidth/(2/0.95); //using this, not $(window).height() because of browsers' aspect/viewport problems. 
tilde.tallheight = tilde.windowwidth/1.45; // For excellent image output

tilde.windowheight = tilde.download_large ? tilde.tallheight : tilde.shortheight

tilde.intro_timing = 1

d3.select("#web_size").classed("selected",!tilde.download_large)
d3.select("#large_size").classed("selected",tilde.download_large)

tilde.data = [];
tilde.view_points = [];
tilde.radial_data = [];
tilde.merger_data = [];
tilde.categories = ["Burster","Slow Pulsar","Recycled Pulsar","DNS","Galactic","Extragalactic"];
tilde.types = ["NS","BH","L_NS","L_BH"];
tilde.linear = d3.scale.linear();
tilde.y = {};
tilde.log = d3.scale.log();
tilde.ns_max = 3.3;
tilde.ligo_max = 80;
tilde.scaled = true;
tilde.stars_in_front = true;
tilde.colors_mixed = true;
tilde.light_scheme = false;
tilde.stellar_shading = true;
tilde.zoomed = false;
tilde.ns_shown = true;
tilde.bh_shown = true;
tilde.gw_shown = true;
tilde.em_shown = true;
tilde.ns_error_shown = false;
tilde.bh_error_shown = false;
tilde.ns_fs = d3.scale.linear()
	.domain([320,1920,3840])
	.range([4,40,80])
tilde.bh_fs = d3.scale.linear()
	.domain([320,1920,3840])
	.range([6,55,110])	
tilde.title_fs = d3.scale.linear()
	.domain([320,1920,3840])
	.range([12,88,176])

tilde.tooltip = d3.select("body").append("div").attr("class", "tooltip");

tilde.notice = d3.select("body").append("div").attr("class", "notice");

tilde.starColor = d3.scale.ordinal()
	.domain(tilde.types)
	.range(["#F4D03F","#956EDD","#E67E22","#00A6FF"])

tilde.catColor = d3.scale.ordinal()
	.domain(tilde.categories)
	.range(["#CB4335","#E6EE9C","#F8C471","#F8C471","#956EDD","#956EDD","#956EDD","#42A5F5","#80DEEA"])

tilde.starOpacity = d3.scale.ordinal()
	.domain([0,1])
	.range([1,.9])


tilde.init = function() {
	$('body').flowtype({
		minimum: 300,
		maximum: 4800,
		minFont: 4,
		maxFont: 120,
		fontRatio: 30
	});

	tilde.lock();
	tilde.drawn = 0;
	tilde.clicked = 0;

	var windowwidth = tilde.windowwidth;
	var windowheight = tilde.windowheight;
	tilde.margin = {
		top: windowheight/7.5,
		right: windowwidth/10,
		bottom: windowheight/7.5,
		left: windowwidth/8
	};
	var margin = tilde.margin;

	var mass_data = tilde.data;
	var radial_data = tilde.radial_data;

	//joining/creating datasets
	preset_data.forEach(function(d){
		var item = {};
		d.name = encodeSpecials(d.raw_name)
		d.display_name = d.raw_name.replace(/a/g,"-A")
		d.display_name = d.display_name.replace(/b/g,"-B")
		item.name = d.name;
		item.type = d.type;
		mass_data.push(d)
		radial_data.push(item)	
	})

	if (tilde.svg) {
		tilde.svg.remove()
	}
	
	tilde.svg = d3.select('#tilde')
		.append("svg")
		.attr("width", windowwidth)
		.attr("height", windowheight)
		.attr("viewBox", function(){
			return "0 0 "+windowwidth+" "+windowheight
		})
		.attr("preserveAspectRatio","xMinYMid")
		.attr("id","clusterChart");

	var chart = $("#clusterChart"),
		aspect = chart.width() / chart.height(),
		container = chart.parent();

	$(window).on("resize", function() {
		var targetWidth = container.width();
		chart.attr("width", targetWidth);
		chart.attr("height", Math.round(targetWidth / aspect));
	}).trigger("resize");	

	var width = chart.width() - margin.left - margin.right;
	var height = chart.height() - margin.top - margin.bottom;
	tilde.windowwidth = windowwidth;
	tilde.windowheight = windowheight;
	tilde.chartwidth = chart.width();
	tilde.chartheight = chart.height();
	tilde.width = width;
	tilde.height = height;

	var title = tilde.svg.append("g")
		.attr("id","title_group")
		.attr("transform", "translate(" + margin.left + "," + margin.top/2 + ")")

    //Place Title
    title.append("text")
		.attr("class", "title")
		.attr("id", "title")
		.attr("fill","#EAEAEA")
		.style("font-size",function(){
			return tilde.title_fs(tilde.width) + "px"
		})	
		.text("Masses in the Stellar Graveyard")
		.on("click",tilde.recordPositions)
		.attr("x",function(){
			return width*.5 - this.getComputedTextLength()/2
		})
		.attr("y", function(){
			return 0
		})
		.style("opacity",0)

	title.append("text")
		.attr("class", "subtitle")
		.attr("id", "subtitle")
		.attr("fill","#AFAFAF")
		.style("font-size",function(){
			return tilde.bh_fs(tilde.width) + "px"
		})	
		.text("in Solar Masses")
		.attr("x",function(){
			return width*.5 - this.getComputedTextLength()/2
		})
		.attr("y", function(){
			var title_height = d3.select("#title").node().getBBox().height;
			var this_height = this.getBBox().height;
			return title_height*1.1 - this_height
		})
		.style("opacity",0)

	var svg = tilde.svg.append("g")
		.attr("id","svg_parent_group")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	tilde.force = d3.layout.force();		 

	//SVG filter for the gooey effect
	//Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
	var defs = svg.append("defs");
	var filter = defs.append("filter").attr("id","gooey");
	filter.append("feGaussianBlur")
		.attr("in","SourceGraphic")
		.attr("stdDeviation","8")
		.attr("color-interpolation-filters","sRGB") //to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
		.attr("result","blur");
	filter.append("feColorMatrix")
		.attr("class", "blurValues")
		.attr("in","blur")
		.attr("mode","matrix")
		.attr("values","1 0 0 0 0	0 1 0 0 0	0 0 1 0 0	0 0 0 18 -5")
		.attr("result","gooey");
	filter.append("feBlend")
		.attr("in","SourceGraphic")
		.attr("in2","gooey")
		.attr("operator","atop");


	//Reverse sort the data and assign ranking
	mass_data.sort(function(a,b) {
		return a.mass - b.mass
	})
	var j = mass_data.length,
		i;
	for (i = 0; i < j; i++) {
		var d = mass_data[i];
		// add sorted position to data
		d.order = i+1;
	}

	//Use Fisher-Yates to shuffle the data
	mass_data = shuffle(mass_data);

    //Create x scale for the chart
	tilde.widthScale = d3.scale.linear()
		.domain([0, width])
		.range([0, width]);

	//Create axis for the chart
	tilde.linear
		.domain([0,tilde.ligo_max])
		.range([tilde.height, 0]);

	tilde.log
		.base(Math.E)
		.domain([Math.exp(0),tilde.ligo_max])
		.range([tilde.height, 0]);

	tilde.ligo_ticks = [0,10,20,30,40,50,60,70];
	tilde.log_ligo_ticks = [1,2,5,10,20,40,80];
	tilde.ns_ticks = [0,0.5,1,1.5,2,2.5,3];
	tilde.log_ns_ticks = [1,1.5,2,2.5,3];

	tilde.res_bh = d3.scale.linear()
		.domain([0,320,1920,3840])
		.range([1,3,25,45])

	tilde.res_ns = d3.scale.linear()
		.domain([0,320,1920,3840])
		.range([3,10,70,250])

	tilde.y = tilde.log;

	tilde.scale_status = "log";

	tilde.rScale = function(d) {
		var input = d
		if (isNaN(input)) {
			if (d.type.indexOf('NS') !== -1) {
				input = 2.75
			} else {
				input = d.mass
			}
		}

		var r = d3.scale.linear()
			.domain([tilde.ns_max,tilde.ligo_max])
			.range([tilde.res_ns(tilde.width),tilde.res_bh(tilde.width)])

		if (tilde.scaled) {
			return (Math.sqrt(input)/3.14)*r(tilde.y.domain()[1])
		}
		return Math.sqrt(tilde.res_ns(tilde.width));
	}

	tilde.clusterAxis = d3.svg.axis()
		.scale(tilde.y)
		.orient("left")
		.outerTickSize(0)
		.innerTickSize(-(width*.95))
		.tickFormat(d3.format("d"))
		.tickValues(tilde.log_ligo_ticks);
		
	//Append y axis to chart
	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(0,0)")
		.style("opacity",0)
		.call(tilde.clusterAxis);
	tilde.styleAxis()

	tilde.gap = {};

	tilde.gap.bounds = {
		"top":4.9,
		"bottom":2.74
	};
	tilde.gap.height = function(){
		return (tilde.height-tilde.y(tilde.gap.bounds.top))-(tilde.height-tilde.y(tilde.gap.bounds.bottom))
	};
	tilde.gap.width = tilde.width*.95;
	tilde.gap.x = 0;
	tilde.gap.y = function() {
		return tilde.y(tilde.gap.bounds.top)
	};

	tilde.bar_width = d3.scale.linear()
		.domain([0.8,62])
		.range([Math.sqrt(tilde.res_bh(tilde.width))/2+1,Math.sqrt(tilde.res_ns(tilde.width))-1])

	tilde.data.forEach(function(d){
		d.error_height = function() {
			return ((tilde.height-tilde.y(d.error_high))-(tilde.height-tilde.y(d.error_low)))+1
		}
		d.error_width = tilde.bar_width(d.mass)
		d.error_y = function() {
			return tilde.y(d.error_high)
		}
		d.barFill = function(){
			if (tilde.light_scheme) {
				if (!(d.special && d.type =="L_NS")) {
					return d3.rgb(tilde.starColor(d.type)).darker(1)
				}
				return d3.rgb("#8C8783").darker(1)
			} else if (!(d.special && d.type =="L_NS")) {
				return d3.rgb(tilde.starColor(d.type)).darker(2);
			}
			return d3.rgb("#C4BBB2").darker(1)
		}
		d.starFill = function() {
			if (tilde.stellar_shading) {
				if (d.type === "BH" || d.type === "L_BH") {
					return "url(#hgradient-" + d.name + ")"
				} else if (!d.special && (d.type === "NS" || d.type === "L_NS")) {
					return "url(#rgradient-" + d.name + ")"
				} else if (tilde.light_scheme){
					return "#8C8783"
				}
				return "#C4BBB2"
			} else if (!(d.special && d.type =="L_NS")) {
				return tilde.starColor(d.type);
			} else if (tilde.light_scheme) {
				return "#8C8783"
			}
			return "#C4BBB2"
		}
		d.opacity = function(optional_bool) {
			if (!(optional_bool === false)) {
				var i = !tilde.stellar_shading ? 1 : 0.9;
				return i;
			} else {
				return 0;
			}
		}
	})

	tilde.line = d3.svg.line()
		.x(function(d) { 
			return d.x; 
		})
		.y(function(d) { 
			return d.y;
		})
		.interpolate("basis");

	tilde.arrow = d3.svg.line()
		.x(function(d) { 
			return d.x; 
		})
		.y(function(d) { 
			return d.y;
		})
		.interpolate("linear")

	tilde.gapWrapper = svg.append("g")
		.attr("id", "gapWrapper")

	tilde.massGap = tilde.gapWrapper.selectAll("rect")
		.data([tilde.gap])

	tilde.massGap
		.enter().append("rect")
		.attr("width",function(d){
			return d.width
		})
		.attr("height",function(d){
			return d.height()
		})
		.attr("x",function(d){
			return d.x
		})
		.attr("y",function(d){
			return d.y()
		})
		.attr("fill","#464646")
		.attr("id","gap")
		.call(tilde.gapdrag)

	tilde.gapWrapper
		.append("text")
		.data([{"text_height":0}])
		.classed("gap_text", true)
		.text("MASS GAP?")
		.attr("fill",function(){
			if (tilde.scale_status == "lin") {
				return "#EAEAEA"
			}
			return "#101010"
		})
		.style("font-size",function(){
			var fs = d3.scale.linear()
				.domain([320,1920,3840])
				.range([12,64,128])
			return fs(tilde.width) + "px"
		})	
		.attr("y",function(d){
			d.text_height = this.getBBox().height/2
			var output = tilde.y(3.85) + d.text_height;
			if (tilde.scale_status == "lin") {
				output = tilde.y(4.9)
			}
			return output
		})
		.attr("x",function(d){
			var output = tilde.width/2 -this.getComputedTextLength()/2;
			if (tilde.scale_status == "lin") {
				output = this.getComputedTextLength()/2
			}
			return output
		})

	tilde.gapWrapper.classed("hidden",true)

	//Wrapper for the stars
	tilde.starWrapper = svg.append("g")
		.attr("id", "starWrapper")
		.style("filter", "url(#gooey)");

	// Place the error bars
	tilde.bars = tilde.starWrapper.selectAll(".error_bar")
		.data(mass_data)
		.enter().append("rect")
		.attr("class", "error_bar")
		.classed("bh_bar", function(d){
			if (d.type == "L_BH" || d.type == "BH") {
				return true
			}
			return false
		})
		.classed("ns_bar", function(d){
			if (d.type == "L_NS" || d.type == "NS") {
				return true
			}
			return false
		})
		.classed("gw_bar", function(d){
			if (d.messenger !== "Electromagnetic") {
				return true
			}
			return false
		})
		.classed("em_bar", function(d){
			if (d.messenger === "Electromagnetic") {
				return true
			}
			return false
		})
		.attr("width",function(d){
			return d.error_width
		})
		.attr("height",function(d){
			return d.error_height()
		})
		.attr("x",function(d){
			return width/2
		})
		.attr("y",function(d){
			return d.error_y()
		})
		.attr("fill","white")
		.attr("id",function(d){
			return d.name+"_gap"
		})
		.attr("rx", 3)
    	.attr("ry", 3)
		.style("opacity", 0)
		.each(function(d,i){
			d.bar_element = this;
		});

	//Place the star circles
	tilde.stars = tilde.starWrapper.selectAll(".stars")
		.data(mass_data)
		.enter().append("circle")
		.attr("class", "stars")
		.attr("id", function(d){
			return d.name + "_star"
		})
		.attr("fill","#988FBF")
		.classed("bh", function(d){
			if (d.type == "L_BH" || d.type == "BH") {
				return true
			}
			return false
		})
		.classed("ns", function(d){
			if (d.type == "L_NS" || d.type == "NS") {
				return true
			}
			return false
		})
		.classed("gw", function(d){
			if (d.messenger !== "Electromagnetic") {
				return true
			}
			return false
		})
		.classed("em", function(d){
			if (d.messenger === "Electromagnetic") {
				return true
			}
			return false
		})
		.classed("lvt", function(d){
			var me = this
			if (d.name.substring(0,3) === "LVT") {
				d.strokewidth = function(){
					return d3.select(me).attr("r")/6
				}
				d.dash = function(){
					return d3.select(me).attr("r")/2.3
				}
				return true
			}
			return false
		})
		.attr("r", function(d) { return tilde.rScale(7) ;})
		.attr("cx", width/2)
		.attr("cy", height/2)
		.style("opacity", 1)
		.each(function(d,i){
			d.circle_element = this;
		});

	//Radial gradient with the center at one end of the circle, as if illuminated from the side
	var starCoverGradient = tilde.svg.append("defs")
		.append("radialGradient")
		.attr("id", function(d){ return "starCoverGradient" })
		.attr("cx", "30%")
		.attr("cy", "30%")
		.attr("r", "65%");
	var starCoverGlow = tilde.svg.append("defs")
		.append("radialGradient")
		.attr("id", function(d){ return "starCoverGlow" })
		.attr("cx", "50%")
		.attr("cy", "50%")
		.attr("r", "50%");
		
	//Append the cover color stops
	starCoverGradient.append("stop")
		.attr("offset", "0%")
		.classed("cover_gradient",true)
		.attr("stop-color", function(d) { 
			return d3.rgb("#FFC300").brighter(1); 
		});
	starCoverGradient.append("stop")
		.attr("offset", "50%")
		.classed("cover_gradient",true)
		.attr("stop-color", function(d) { 
			return d3.rgb("#FFC300"); 
		});
	starCoverGradient.append("stop")
		.attr("offset",	"100%")
		.classed("cover_gradient",true)
		.attr("stop-color", function(d) { 
			return d3.rgb("#FFC300").darker(1.5); 
		});
	starCoverGlow.append("stop")
		.attr("offset", "0%")
		.classed("cover_gradient",true)
		.attr('stop-opacity','0')
		.attr("stop-color", function(d) { 
			return d3.rgb("#FFC300"); 
		});
	starCoverGlow.append("stop")
		.attr("offset", "15%")
		.classed("cover_gradient",true)
		.attr('stop-opacity','0')
		.attr("stop-color", function(d) { 
			return d3.rgb("#FFC300"); 
		});
	starCoverGlow.append("stop")
		.attr("offset", "35%")
		.classed("cover_gradient",true)
		.attr('stop-opacity','.2')
		.attr("stop-color", function(d) { 
			return d3.rgb("#FFC300"); 
		});
	starCoverGlow.append("stop")
		.attr("offset",	"100%")
		.classed("cover_gradient",true)
		.attr('stop-opacity','0')
		.attr("stop-color", function(d) { 
			return d3.rgb("#FFC300").brighter(2); 
		});

	tilde.coverCirleRadius = tilde.rScale(100);

	//Glow behind cover circle
	tilde.starWrapper.append("circle")
		.attr("class", "starCover starGlow")
		.attr("r", tilde.rScale(18))
		.attr("cx", width/2)
		.attr("cy", height/2)
		.attr("fill","url(#starCoverGlow)")
		.transition().duration(5500*tilde.intro_timing).delay(500*tilde.intro_timing)
		.attr("r", tilde.coverCirleRadius*6)

	//Circle over all others
	tilde.starWrapper.append("circle")
		.attr("class", "starCover pulse")
		.attr("r", tilde.rScale(12))
		.attr("cx", width/2)
		.attr("cy", height/2)
		.attr("fill","url(#starCoverGradient)")
		.transition().duration(5500*tilde.intro_timing).delay(500*tilde.intro_timing)
		.attr("r", tilde.coverCirleRadius)
		.call(endall, function(d){
			tilde.notice
				.transition("fade_notice")
				.duration(1200*tilde.intro_timing)
				.style("opacity",0)
				.call(endall, function(d){
					
					tilde.notice
						.html("when stars <span id='death' style='opacity:0'><b>die</b>?</span>")
						.style("left", function(d){
							var this_width = this.offsetWidth/2;
							return width/2 + margin.left - this_width + "px"
						})
						.style("top", function(d){
							var this_height = this.offsetHeight,
								title_height = d3.select("#title").node().offsetHeight;
							return height/2 + margin.top - this_height*.8 - tilde.coverCirleRadius*1.3 + "px"
						})
						.transition("notice_shift")
						.duration(1000*tilde.intro_timing)
						.style("opacity",1)
						.call(endall,function(d){
							d3.select('.starGlow')
								.transition('glowdeath')
								.duration(2500*tilde.intro_timing).delay(300*tilde.intro_timing)
								.style('opacity',0)
								.attr("r", tilde.coverCirleRadius*3.5)
							d3.select("#death")
								.transition("death")
								.duration(500*tilde.intro_timing).delay(250)
								.style("opacity",1)
						})
				})

			d3.selectAll(".cover_gradient")
				.transition("gradient").duration(2500*tilde.intro_timing)
				.delay(2500*tilde.intro_timing)
				.attr("stop-color", function(d) { 
					return "#988FBF"; 
				});		

			d3.selectAll(".starCover")
				.transition().duration(2500*tilde.intro_timing).delay(2500*tilde.intro_timing)
				.call(endall,function(){
					tilde.unlock()
					tilde.animate.placeStars()
					//tilde.coverCircleShrink()
				})
		});

	var q_data = [{}]

	// Place Labels
	tilde.starWrapper.append("text")
		.data(q_data)
		.attr("class","question_mark")
		.text("?")
		.style("font-size",function(d){
			d.size = function() {
				return tilde.rScale(2.74)*1.5
			}
			return d.size() + "px"
		})
		.attr("x",function(d){
			d.x = function() {
				return d3.select("#GW170817_star").attr("cx") - d.size()/3.35
			}
			return d.x()
		})
		.attr("y",function(d){
			d.y = function(){
				return tilde.y(2.74) + d.size()/2.5
			}
			return d.y()
		})
		.style('opacity',0)

	tilde.starWrapper.append("text")
		.attr("class","credits")
		.attr("fill","#AFAFAF")
		.style("font-size",function(){
			return tilde.ns_fs(tilde.width) + "px"
		})	
		.text("LIGO-Virgo | Frank Elavsky | Northwestern")
		.attr("x",function(){
			return width*.5 - this.getComputedTextLength()/2
		})
		.attr("y", function(){
			return tilde.height*0.99 + tilde.margin.top
		})
		.style("opacity",0)

	tilde.starWrapper.append("text")
		.attr("class","label cat_label bh_label")
		.attr("id", "galactic")
		.attr("fill","#AFAFAF")
		.style("font-size",function(){
			return tilde.bh_fs(tilde.width) + "px"
		})	
		.text("Galactic Black Holes")
		.attr("x",function(){
			return width*.35 - this.getComputedTextLength()
		})
		.attr("y", function(){
			return tilde.y(10.1)
		})
		.classed("hidden",true)

	tilde.starWrapper.append("text")
		.attr("class","label cat_label bh_label")
		.attr("id", "extragalactic")
		.attr("fill","#AFAFAF")
		.style("font-size",function(){false
			return tilde.bh_fs(tilde.width) + "px"
		})	
		.text("Extragalactic Black Holes")
		.attr("x",function(){
			return width*.80 - this.getComputedTextLength()
		})
		.attr("y", function(){
			return tilde.y(40.1)
		})
		.classed("hidden",true)

	tilde.starWrapper.append("text")
		.attr("class","label cat_label ns_label")
		.attr("id", "burster")
		.attr("fill","#AFAFAF")
		.style("font-size",function(){
			return tilde.ns_fs(tilde.width) + "px"
		})	
		.text("Bursters")
		.attr("x",function(){
			return width*.2 - this.getComputedTextLength()/2
		})
		.attr("y", function(){
			return tilde.y(2.85)
		})
		.classed("hidden",true)

	tilde.starWrapper.append("text")
		.attr("class","label cat_label ns_label")
		.attr("id", "slowpulsar")
		.attr("fill","#AFAFAF")
		.style("font-size",function(){
			return tilde.ns_fs(tilde.width) + "px"
		})	
		.text("Slow Pulsars")
		.attr("x",function(){
			return width*.4 - this.getComputedTextLength()/2
		})
		.attr("y", function(){
			return tilde.y(2.85)
		})
		.classed("hidden",true)

	tilde.starWrapper.append("text")
		.attr("class","label cat_label ns_label")
		.attr("id", "recycledpulsar")
		.attr("fill","#AFAFAF")
		.style("font-size",function(){
			return tilde.ns_fs(tilde.width) + "px"
		})	
		.text("Recycled Pulsars")
		.attr("x",function(){
			return width*.6 - this.getComputedTextLength()/2
		})
		.attr("y", function(){
			return tilde.y(2.85)
		})
		.classed("hidden",true)

	tilde.starWrapper.append("text")
		.attr("class","label cat_label ns_label")
		.attr("id", "dns_label")
		.attr("fill","#AFAFAF")
		.style("font-size",function(){
			return tilde.ns_fs(tilde.width) + "px"
		})	
		.text("Double Neutron Stars")
		.attr("x",function(){
			return width*.8 - this.getComputedTextLength()/2
		})
		.attr("y", function(){
			return tilde.y(2.85)
		})
		.classed("hidden",true)

	tilde.starWrapper.append("text")
		.attr("class","label type_label")
		.attr("id", "ligo_bh_label")
		.attr("fill","#036FA8")
		.style("font-size",function(){
			return tilde.bh_fs(tilde.width)*0.75 + "px"
		})	
		.text("LIGO-Virgo Black Holes")
		.attr("x",function(){
			return width*.15 - this.getComputedTextLength()/2
		})
		.attr("y", function(){
			return tilde.y(81)
		})
		.classed("hidden",true)

	tilde.starWrapper.append("text")
		.attr("class","label type_label")
		.attr("id", "em_bh_label")
		.attr("fill","#61498E")
		.style("font-size",function(){
			return tilde.bh_fs(tilde.width)*0.75 + "px"
		})	
		.text("EM Black Holes")
		.attr("x",function(){
			return width*.95 - this.getComputedTextLength()
		})
		.attr("y", function(){
			return tilde.y(7.4)
		})
		.classed("hidden",true)

	tilde.starWrapper.append("text")
		.attr("class","label type_label")
		.attr("id", "ligo_ns_label")
		.attr("fill","#C07222")
		.style("font-size",function(){
			return tilde.ns_fs(tilde.width) + "px"
		})	
		.text("LIGO-Virgo Neutron Stars")
		.attr("x",function(){
			return width*.5 - this.getComputedTextLength()/2
		})
		.attr("y", function(){
			return tilde.y(1.025)// + tilde.ns_fs(tilde.width)
		})
		.classed("hidden",true)

	tilde.starWrapper.append("text")
		.attr("class","label type_label")
		.attr("id", "em_ns_label")
		.attr("fill","#C8B03A")
		.style("font-size",function(){
			return tilde.ns_fs(tilde.width) + "px"
		})	
		.text("EM Neutron Stars")
		.attr("x",function(){
			return width*.25 - this.getComputedTextLength()/2
		})
		.attr("y", function(){
			return tilde.y(2.74) + tilde.ns_fs(tilde.width)
		})
		.classed("hidden",true)

	tilde.notice
		.style("font-size",function(){
			return tilde.bh_fs(tilde.width) + "px"
		})	
		.style("opacity",0)
		.style("display", "inline-block")
		.html("What are the <b>densest</b><br>objects that form...")
		.style("left", function(d){
			var this_width = this.offsetWidth/2;
			return width/2 + margin.left - this_width + "px"
		})
		.style("top", function(d){
			var this_height = this.offsetHeight,
				title_height = d3.select("#title").node().offsetHeight;
			return height/2 + margin.top - this_height - tilde.coverCirleRadius*1.3 + "px"
		})
		.transition("notice_in")
		.duration(1000)
		.style("opacity",1)

	//Radial gradient with the center at one end of the circle, as if illuminated from the side
	var starRoundGradient = tilde.svg.append("defs").selectAll("radialGradient")
		.data(mass_data)
		.enter().append("radialGradient")
		.attr("id", function(d){ return "rgradient-" + d.name; })
		.attr("cx", "30%")
		.attr("cy", "30%")
		.attr("r", "65%");
		
	//Append the NS color stops
	starRoundGradient.append("stop")
		.attr("offset", "0%")
		.classed("ns_radial_first",true)
		.attr("stop-color", function(d) { 
			return "#988FBF"; 
		});
	starRoundGradient.append("stop")
		.attr("offset", "50%")
		.classed("ns_radial_second",true)
		.attr("stop-color", function(d) { 
			return "#988FBF"; 
		});
	starRoundGradient.append("stop")
		.attr("offset",	"100%")
		.classed("ns_radial_third",true)
		.attr("stop-color", function(d) { 
			return "#988FBF"; 
		});

	//Radial gradient with the center in the circle's center, as if illuminated from outside
	var blackHoleGradient = tilde.svg.append("defs").selectAll("radialGradient")
		.data(radial_data)
		.enter().append("radialGradient")
		.attr("id", function(d){ return "hgradient-" + d.name; })
		.attr("cx", "50%")
		.attr("cy", "50%")
		.attr("r", "65%");
		
	//Append the BH color stops
	blackHoleGradient.append("stop")
		.attr("offset", "0%")
		.classed("bh_radial_first",true)
		.attr("stop-color", function(d) { 
			return "#988FBF"; 
		});
	blackHoleGradient.append("stop")
		.attr("offset", "50%")
		.classed("bh_radial_second",true)
		.attr("stop-color", function(d) { 
			return "#988FBF"; 
		});
	blackHoleGradient.append("stop")
		.attr("offset",	"100%")
		.classed("bh_radial_third",true)
		.attr("stop-color", function(d) { 
			return "#988FBF"; 
		});

	tilde.bindOptions()
};

tilde.stop = function() {
	if (d3.event) {
		d3.event.stopPropagation()
	}
}

tilde.bhCategory = function() {
	tilde.stop()
	if (tilde.status === false) {
		return
	}
	tilde.showNS(true)
	tilde.showBH(false)
	tilde.zoomed = false;
	d3.select("#full_range").classed("selected",true)
	d3.select("#ns_range").classed("selected",false)
	tilde.cat = 1
	tilde.animate.matrixStars()
	tilde.animate.rescaleView("reset_default")
}

tilde.nsCategory = function() {
	tilde.stop()
	if (tilde.status === false) {
		return
	}
	tilde.showBH(true)
	tilde.showNS(false)
	tilde.zoomed = true;
	d3.select("#full_range").classed("selected",false)
	d3.select("#ns_range").classed("selected",true)
	tilde.y.domain([tilde.y.domain()[0],tilde.ns_max]);
	tilde.cat = 2
	tilde.animate.matrixStars()
	tilde.animate.rescaleView()
}

tilde.toggleZoom = function() {
	tilde.stop()
	if (tilde.status === false) {
		return
	}
	if (d3.select("#full_range").classed("selected")){
		tilde.zoomed = true;
		d3.select("#full_range").classed("selected",false)
		d3.select("#ns_range").classed("selected",true)
		tilde.showBH(true)
		tilde.showNS(false)
		tilde.y.domain([tilde.y.domain()[0],tilde.ns_max]);
		tilde.animate.rescaleView()
		
	} else {
		tilde.zoomed = false;
		d3.select("#full_range").classed("selected",true)
		d3.select("#ns_range").classed("selected",false)
		tilde.showNS(false)
		tilde.showBH(false)
		tilde.animate.rescaleView("reset_default")

	}
}

tilde.showBH = function(bool) {
	tilde.bh_shown = !bool;
	d3.select("#toggle_bh").classed("selected",!bool)
	if (!tilde.bh_shown) {
		if (tilde.bh_error_shown) {
			tilde.bh_shown = bool;
			tilde.toggleBHError()
			tilde.bh_shown = !bool;
		}
		if (tilde.mergers_shown) {
			d3.selectAll(".bh_merger")
				.attr("stroke-opacity",0)
		}
	} else {
		if (tilde.mergers_shown) {
			d3.selectAll(".bh_merger")
				.attr("stroke-opacity",0.3)
		}
	}
	d3.selectAll(".bh")
		.style("opacity",function(d){
			if (d3.select(this).style("opacity") == d.opacity(!bool)) {
				return d.opacity(!bool)
			}
			return d.opacity(bool)
		})
		.transition().duration(800)
		.style("opacity",function(d){
			return d.opacity(!bool)
		})
}

tilde.showNS = function(bool) {
	tilde.ns_shown = !bool;
	d3.select("#toggle_ns").classed("selected",!bool)
	if (!tilde.ns_shown) {
		if (tilde.ns_error_shown) {
			tilde.ns_shown = bool;
			tilde.toggleNSError()
			tilde.ns_shown = !bool;
		}
		if (tilde.mergers_shown) {
			tilde.ns_shown = false
			d3.selectAll(".ns_merger")
				.attr("stroke-opacity",0)
		}
	} else {
		tilde.ns_shown = true
		if (tilde.mergers_shown) {
			d3.selectAll(".ns_merger")
				.attr("stroke-opacity",0.3)
		}
	}
	d3.selectAll(".ns")
		.style("opacity",function(d){
			if (d3.select(this).style("opacity") == d.opacity(!bool)) {
				return d.opacity(!bool)
			}
			return d.opacity(bool)
		})
		.transition().duration(800)
		.style("opacity",function(d){
			d3.select(".question_mark")
				.classed("hidden",bool)
			return d.opacity(!bool)
		})
}

tilde.toggleNS = function() {
	tilde.stop()
	tilde.toggleSelect("toggle_ns")
	tilde.ns_shown = !tilde.ns_shown;
	tilde.checkToggles()
}

tilde.toggleBH = function() {
	tilde.stop()
	tilde.toggleSelect("toggle_bh")
	tilde.bh_shown = !tilde.bh_shown;
	tilde.checkToggles()
}

tilde.toggleGW = function() {
	tilde.stop()
	tilde.toggleSelect("toggle_gw")
	tilde.gw_shown = !tilde.gw_shown;
	tilde.checkToggles()
}

tilde.toggleEM = function() {
	tilde.stop()
	tilde.toggleSelect("toggle_em")
	tilde.em_shown = !tilde.em_shown;
	tilde.checkToggles()
}

tilde.checkToggles = function() {
	tilde.stars
		.style('opacity', function(d,i){
			var my_type = ''
			var my_messenger = ''
			if (d3.select(this).classed('ns')){
				my_type = 'ns'
			} else {
				my_type = 'bh'
			}
			if (d3.select(this).classed('em')){
				my_messenger = 'em'
			} else {
				my_messenger = 'gw'
			}
			if (tilde[my_type+'_shown'] && tilde[my_messenger+'_shown']) {
				if (tilde[my_type+'_error_shown']) {
					d3.select(d.bar_element)
						.style('opacity',function(dd,ii){
							return dd.opacity()
						})
				} else {
					d3.select(d.bar_element)
						.style('opacity',0)
				}
				if (my_messenger === 'gw') {
					d3.selectAll("."+my_type+"_merger")
						.attr("stroke-opacity",function(dd,ii){
							if (tilde.mergers_shown) {
								return 0.3
							}
							return 0
						})
						.attr("fill-opacity",function(dd,ii){
							if (tilde.mergers_shown) {
								return 1
							}
							return 0
						})
				}
				return d.opacity()
			} else {
				d3.select(d.bar_element)
					.style('opacity',0)
				if (my_messenger === 'gw') {
					d3.selectAll("."+my_type+"_merger")
						.attr("stroke-opacity",0)
						.attr("fill-opacity",0)
				}
				return 0
			}
		})
	
}

tilde.toggleRadius = function() {
	tilde.stop()
	tilde.scaled = !tilde.scaled;

	var speed = 800;

	d3.select("#scaled_radius").classed("selected", tilde.scaled)
	d3.select("#set_radius").classed("selected", !tilde.scaled)

	d3.selectAll(".stars")
		.transition("radius_resize")
		.duration(speed)
		.attr("r",function(d){
			return tilde.rScale(d)
		})
		.call(endall,function(d){
			tilde.drawMergers()
			tilde.drawDashes(speed)
			tilde.moveQuestionMark()
		})
}

tilde.starLayering = function() {
	tilde.stop()
	tilde.stars_in_front = !tilde.stars_in_front;

	d3.select("#stars_front").classed("selected", tilde.stars_in_front)
	d3.select("#bars_front").classed("selected", !tilde.stars_in_front)

	if (tilde.stars_in_front){
		d3.selectAll(".stars")
			.moveToFront()
	} else {
		d3.selectAll(".error_bar")
			.moveToFront()
	}
	d3.select(".question_mark")
		.moveToFront()
}

tilde.colorMixing = function() {
	tilde.stop()
	tilde.colors_mixed = !tilde.colors_mixed;

	d3.select("#color_blend").classed("selected", tilde.colors_mixed)
	d3.select("#color_normal").classed("selected", !tilde.colors_mixed)

	if (tilde.colors_mixed){
		d3.selectAll(".stars, .error_bar")
			.style("mix-blend-mode","screen")
	} else {
		d3.selectAll(".stars, .error_bar")
			.style("mix-blend-mode","normal")
	}
}

tilde.drawDashes = function(speed) {
	tilde.lvt = tilde.starWrapper.selectAll(".lvt")
		.style("stroke","silver")
		.attr("stroke-opacity","0")
		.style("stroke-width",function(d){
			return d.strokewidth()
		})
		.style("stroke-dasharray",function(d) {			
			return d.dash() + "," + d.dash()
		})
		.transition("dash_draw").duration(speed).delay(150)
		.attr("stroke-opacity",".7")
}

tilde.toggleBHError = function() {
	tilde.stop()
	if (tilde.bh_shown) {
		tilde.toggleSelect("toggle_bh_error")
		tilde.bh_error_shown = !tilde.bh_error_shown;
		tilde.checkToggles()
	}
}

tilde.toggleNSError = function() {
	tilde.stop()
	if (tilde.ns_shown) {
		tilde.toggleSelect("toggle_ns_error")
		tilde.ns_error_shown = !tilde.ns_error_shown;
		tilde.checkToggles()
	}
}

tilde.shadeStars = function() {
	tilde.stop()
	tilde.stellar_shading = !tilde.stellar_shading

	d3.select("#stellar_shade").classed("selected", tilde.stellar_shading)
	d3.select("#plain_shade").classed("selected", !tilde.stellar_shading)

	tilde.stars
		.attr("fill",function(d){
			return d.starFill()
		})
		.style("opacity",function(d){
			if (d3.select(this).style("opacity") == 0){
				return 0
			}
			return d.opacity()
		})
}

tilde.changeToLog = function() {
	tilde.stop()

	if (tilde.scale_status == "lin") {
		tilde.toggleSelect("log_scale")
		tilde.toggleSelect("lin_scale")
		tilde.log.domain([tilde.log.domain()[0],tilde.y.domain()[1]])
		tilde.y = tilde.log
		tilde.scale_status = "log"
		tilde.animate.rescaleView()
	}
}

tilde.changeToLin = function() {
	tilde.stop()
	if (tilde.scale_status == "log") {
		tilde.toggleSelect("log_scale")
		tilde.toggleSelect("lin_scale")
		tilde.linear.domain([tilde.linear.domain()[0],tilde.y.domain()[1]])
		tilde.y = tilde.linear
		tilde.scale_status = "lin"
		tilde.animate.rescaleView()
	}
}

tilde.toggleGroup = function(element) {
	d3.select("#view").selectAll(".option")
		.classed("selected",false)

	d3.select("#"+element).classed("selected",true)
}

tilde.toggleSelect = function(element) {
	d3.select("#"+element).classed("selected",function(){
		return !d3.select(this).classed("selected")
	})
}

tilde.toggleTitle = function() {
	tilde.stop()
	tilde.toggleSelect("toggle_title")
	d3.select(".title").classed("hidden", function() {
		return !d3.select(".title").classed("hidden")
	})
	d3.select(".subtitle").classed("hidden", function() {
		return !d3.select(".subtitle").classed("hidden")
	})
}

tilde.toggleLabels = function() {
	tilde.stop()
	if (tilde.cat === 1) {
		if (d3.select("#toggle_ns").classed("selected")) {
			if (d3.select("#burster").classed("hidden") === d3.select("#extragalactic").classed("hidden")) {
				tilde.toggleSelect("toggle_labels")
				d3.selectAll(".ns_label").classed("hidden", function() {
					return !d3.select(this).classed("hidden")
				})
				d3.selectAll(".bh_label").classed("hidden", function() {
					return !d3.select(this).classed("hidden")
				})
			} else if (!d3.select("#extragalactic").classed("hidden")) {
				d3.selectAll(".ns_label").classed("hidden", false)
			} else {
				d3.selectAll(".ns_label").classed("hidden", true)
			}
		} else if (!d3.select("#burster").classed("hidden")) {
			d3.selectAll(".ns_label").classed("hidden", true)
		} else {
			tilde.toggleSelect("toggle_labels")
			d3.selectAll(".bh_label").classed("hidden", function() {
				return !d3.select(this).classed("hidden")
			})
		}
	} else if (tilde.cat === 2) {
		tilde.toggleSelect("toggle_labels")
		d3.selectAll(".ns_label").classed("hidden", function() {
			return !d3.select(this).classed("hidden")
		})
	} else if (d3.select("#view_full").classed("selected")) {
		tilde.toggleSelect("toggle_labels")
		d3.selectAll(".type_label").classed("hidden", function() {
			return !d3.select(this).classed("hidden")
		})
	}
	
}

tilde.hideLabels = function() {
	d3.selectAll(".label").classed("hidden",true)
	d3.select("#toggle_labels").classed("selected",false)
}

tilde.toggleAxis = function() {
	tilde.stop()
	tilde.toggleSelect("toggle_axis")
	d3.selectAll(".axis").classed("hidden", function() {
		return !d3.select(this).classed("hidden")
	})
}

tilde.showMenu = function() {
	d3.selectAll(".menu_wrapper, .download_menu")
		.style("opacity",0)
		.classed("hidden",false)
		.transition("show_menu").duration(4500)
		.delay(2000)
		.style("opacity",.9)

	d3.select("#saveButton")
		.on("mousemove",tilde.saveTip)
		.on("mouseout",tilde.mouseout)

	d3.select("#sizeButton")
		.on("mousemove",tilde.sizeTip)
		.on("mouseout",tilde.mouseout)
		.on("click",tilde.checkSizeChange)
}

tilde.toggleMenu = function() {
	d3.selectAll(".option_type")
		.classed("hidden",function(d){
			return !d3.select(this).classed("hidden")
		})
}

tilde.hideMenu = function() {
	d3.selectAll(".option_type")
		.classed("hidden",function(d){
			return true
		})
}

tilde.toggleOptions = function() {
	tilde.stop()
	d3.select(this).selectAll(".option")
		.classed("hidden",function(d){
			return !d3.select(this).classed("hidden")
		})
}

tilde.resizeGap = function(new_width) {
	d3.select("#gap").attr("width",new_width)
}

tilde.toggleGap = function() {
	tilde.stop()
	tilde.toggleSelect("toggle_gap")
	d3.select("#gapWrapper").classed("hidden", function() {
		return !d3.select("#gapWrapper").classed("hidden")
	})
}

tilde.toggleMerger = function() {
	tilde.stop()
	tilde.toggleSelect("toggle_merger")
	tilde.mergers_shown = !tilde.mergers_shown;
	tilde.checkToggles()
}

tilde.toggleScheme = function() {
	tilde.stop()
	tilde.light_scheme = !tilde.light_scheme;

	d3.select("#light_scheme").classed("selected",tilde.light_scheme)
	d3.select("#dark_scheme").classed("selected",!tilde.light_scheme)

	d3.selectAll("body, #clusterChart")
		.style("background-color",function(d){
			if (tilde.light_scheme) {
				return "rgba(255,255,255,0)"
			}
			return "#101010"
		})
	d3.select(".title")
		.style("fill",function(d){
			if (tilde.light_scheme) {
				return "#101010"
			}
			return "#EAEAEA"
		})
	d3.select(".subtitle")
		.style("fill",function(d){
			if (tilde.light_scheme) {
				return "#303030"
			}
			return "#AFAFAF"
		})
	d3.selectAll(".axis line")
		.style("stroke",function(d){
			if (tilde.light_scheme) {
				return "#A8A8A8"
			}
			return "#4c4c4c"
		})
	d3.selectAll(".axis text")
		.style("fill",function(d){
			if (tilde.light_scheme) {
				return "#A8A8A8"
			}
			return "#828283"
		})
	d3.selectAll(".menu_bar")
		.style("background",function(d){
			if (tilde.light_scheme) {
				return "gray"
			}
			return "white"
		})
	d3.selectAll(".option_type")
		.style("background",function(d){
			if (tilde.light_scheme) {
				return "gray"
			}
			return ""
		})
	d3.selectAll(".error_bar")
		.attr("fill", function(d) { 
			return d.barFill(); 
		})
	d3.selectAll(".stars")
		.attr("fill", function(d) { 
			return d.starFill(); 
		})
	d3.select("#gap")
		.attr("fill",function(d){
			if (tilde.light_scheme) {
				return "darkgrey"
			}
			return "#464646"
		})
	d3.selectAll(".cat_label")
		.attr("fill",function(){
			if (tilde.light_scheme) {
				return "#6D6D6D"
			}
			return "#AFAFAF"
		})
	tilde.starWrapper.selectAll(".merger")
		.attr("stroke", function(dd) { 
			if (!dd.arrow) {
				return dd.color()
			}
			return 'none'
		})
		.attr('fill',function(dd){
			if (dd.arrow) {
				return 'gray'
			}
			return 'none'
		})
}

tilde.recordPositions = function() {
	var dat = tilde.data,
		j = dat.length,
		i;
	console.log("[")
	for (i = 0; i < j; i++) {
		var keys = Object.keys(dat[i]),
			l = keys.length,
			k;
		console.log("{")
		for (k = 0; k < l; k++) {
			var ending = ",";
			var value = dat[i][keys[k]];
			if (k+1 == l) {
				ending = ""
			}
			if (typeof value === "string") {
				value = "'"+value+"'"
			}
			if (typeof(dat[i][keys[k]]) !== 'function' && keys[k] !== 'bar_element' && keys[k] !== 'circle_element' && keys[k] !== 'y' && keys[k] !== 'radius' && keys[k] !== 'name' && keys[k] !== 'order' && keys[k] !== 'bar_x' && keys[k] !== 'target_x' && keys[k] !== 'error_width' && keys[k] !== 'target_y' && keys[k] !== 'weight' && keys[k] !== 'index') {
				var the_key = keys[k]
				if (the_key === 'x') {
					the_key = 'target_x'
				}
				console.log("  '"+the_key+"': "+value+ending)
			}
		}
		var close = "},";
		if (i+1 == j) {
			close = "}"
		}
		console.log(close)
	}
	console.log("]")
}

tilde.mousemove = function(d) {
	var sel = d3.select(this);
	var error_high = round(d.error_high,2);
	var error_low = round(d.error_low,2);
	var error_range = "Mass Error Range: ";
	if (error_high === error_low) {
		error_range = "(Mass is Approximate)"
	} else if (error_high === 80) {
		error_range = "(Mass Limit is Unknown)"
	} else {
		error_range = error_range + error_low + " to " + error_high
	}

	var category = d.category;

	if (d.category == "DNS" & d.special) {
		category = "Undetermined?"
	}

	tilde.tooltip
		.html("<b>"+d.display_name+"</b>: "+d.mass+" Solar Masses"+"<br>"+error_range+"<br>Messenger: "+d.messenger+"<br>Category: "+category)
		.style("display", "inline-block")


	var w = tilde.tooltip[0][0].offsetWidth/2,
		h = tilde.tooltip[0][0].offsetHeight*1.1;

	tilde.tooltip
		.style("left", d3.event.pageX - w + "px")
		.style("top", d3.event.pageY - h + "px");
};

tilde.mouseout = function(d) {
	tilde.tooltip
		.style("display", "none");
};

tilde.mergerTooltip = function(d) {
	tilde.tooltip
		.html("This is a merger between objects " + d.mergeName + "-A and " + d.mergeName + "-B<br><b>Chirp Mass</b>: " + chirp_masses[d.mergeName].mass)
		.style("display", "inline-block")


	var w = tilde.tooltip[0][0].offsetWidth/2,
		h = tilde.tooltip[0][0].offsetHeight*1.1;

	tilde.tooltip
		.style("left", d3.event.pageX - w + "px")
		.style("top", d3.event.pageY - h + "px");
}

tilde.mergerout = function(d) {
	tilde.tooltip
		.style("display", "none");
};

tilde.saveTip = function(d) {
	var add = ""
	if (tilde.windowwidth < 1000) {
		add = "<br>---<br><i>The current viewport width is:</i> "+tilde.normalwidth+"<br>Recommended is at least <b>1000</b> for quality output."
	}
	var suggest_large = "Saving for a publication?<br>Try setting 'Resolution' to <b>Large</b> below.",
		suggest_web = "Having trouble viewing?<br>Try setting 'Resolution' to <b>Web</b> below.",
		text = document.cookie.indexOf('publication')+1 ? suggest_web : suggest_large;

	tilde.tooltip
		.html(text+add)
		.style("display", "inline-block")

	var w = tilde.tooltip[0][0].offsetWidth*1.1;

	tilde.tooltip
		.style("left", d3.event.pageX - w + "px")
		.style("top", d3.event.pageY + "px");
}

tilde.sizeTip = function(d) {
	tilde.tooltip
		.html("This requires a <b>page-reload</b> <br>and <b>cookies enabled</b> to take effect!")
		.style("display", "inline-block");

	var w = tilde.tooltip[0][0].offsetWidth*1.1;

	tilde.tooltip
		.style("left", d3.event.pageX - w + "px")
		.style("top", d3.event.pageY + "px");
}

tilde.showTip = function(d) {
	d3.event.stopPropagation()
	tilde.tooltip
		.html(menu_tips[this.id])
		.style('opacity',function(){
			return (tilde.tooltip.style('display')==='none') ? 0 : 1
		})
		.style("display", "inline-block")
		.transition('tooltip')
		.duration(250)
		.delay(200)
		.style('opacity',1);

	var w = tilde.tooltip[0][0].offsetWidth/5,
		h = tilde.tooltip[0][0].offsetHeight/2;

	tilde.tooltip
		.style("left", d3.event.pageX + w + "px")
		.style("top", d3.event.pageY - h + "px");
}

tilde.checkSizeChange = function(d) {
	if (navigator.cookieEnabled) {
		if (confirm("Do you wish to reload the page and potentially lose your current settings in order the change the view size?")) {
			tilde.changeSize()
		}
	} else {
		alert("Your browser does not have cookies enabled.")
	}
}

tilde.changeSize = function(d) {
	var new_cookie = tilde.download_large ? "view_mode=publication;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/" : "view_mode=publication"
	document.cookie = new_cookie;

	location.reload()
}

tilde.disableTooltips = function() {
	tilde.tooltip.remove()
}

tilde.drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("drag", function(d){
    	tilde.force.stop();
    	d3.select(d.circle_element).attr("cx", d.x = d3.event.x);
    	d3.select(d.bar_element).attr("x", d.bar_x = d3.event.x-d.error_width/2);
    	tilde.drawMergers(0)
    	tilde.moveQuestionMark(0)
    })

tilde.gapdrag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("drag", function(d){
    	d3.select(this).attr("x", d.x = d3.event.x);
    })

tilde.lock = function() {
	tilde.status = false;
}

tilde.unlock = function() {
	console.log("Ready")
	tilde.status = true;
}

tilde.styleAxis = function() {
	d3.selectAll(".tick text")
		.style("fill",function(d){
			return "#828283"
		})
		.style("font-size",function(d){
			return d3.select(this).style("font-size")
		})
	d3.selectAll(".tick line")
		.style("stroke",function(d){
			return "#828283"
		})
}

tilde.coverCircleShrink = function() {
	if (!tilde.starCoverRemoved) {
		d3.select(".starCover")
			.transition()
			.duration(2700)
			.attr("r", tilde.coverCirleRadius*0.8)
			.call(endall, function(d){
				tilde.coverCircleGrow()
			});
	} else {
		d3.select(".starCover")
			.transition()
			.attr("r", 0)
	}
}

tilde.coverCircleGrow = function() {
	if (!tilde.starCoverRemoved) {
		d3.select(".starCover")
			.transition()
			.duration(2300)
			.attr("r", tilde.coverCirleRadius)
			.call(endall, function(d){
			});
	} else {
		d3.select(".starCover")
			.transition()
			.attr("r", 0)
	}
}

tilde.moveQuestionMark = function(time) {
	var transition = time
	if (time === undefined) {
		transition = 800
	}
	d3.select(".question_mark")
		.attr("x",function(d){
			return d.x()
		})
		.attr("y",function(d){
			return d.y()
		})
		.style("font-size",function(d){
			return d.size() + "px"
		})
		.style("opacity",0)
		.transition()
		.duration(transition)
		.style("opacity",1)
}

tilde.createArrowData = function() {
	tilde.merger_data = [];
	var j = tilde.data.length,
		i;
	var merger_arrows = {};
	for (i = 0; i < j; i++) {
		var d = tilde.data[i];

		//create merger's line data
		if (d.messenger == "Gravitational Wave") {
			var mergeName = d.name.replace(/a|b/g,"")
			if (d.name !== mergeName) {
				var source = d3.select("#"+d.name+"_star")
				var target = d3.select("#"+mergeName+"_star")
				var arrow_data = {
					name: d.name,
					type: d.type,
					mergeName: mergeName,
					thickness: 1+target.attr("r")*0.2,
					centered:false,
					color: function() {
						if (tilde.light_scheme) {
							return "grey"
						}
						return "silver"
					},
					values: [{},{},{},{},{}]
				}
				var arrowhead = {
					name: mergeName,
					type: d.type,
					arrow: true,
					mergeName: mergeName,
					thickness: 1+target.attr("r")*0.2,
					centered:false,
					color: function() {
						if (tilde.light_scheme) {
							return "grey"
						}
						return "silver"
					},
					values: [{},{},{}]
				}
				var s_x = +source.attr("cx"),
					t_x = +target.attr("cx"),
					s_y = +source.attr("cy"),
					t_y = +target.attr("cy"),
					s_r = +source.attr("r"),
					t_r = +target.attr("r"),
					t_t = arrow_data.thickness,
					v = arrow_data.values;
				var offset = Math.sqrt(Math.pow(t_t/2,2)/2)
				v[3].x = t_x
				v[3].y = t_y + t_r*2+t_t*2.5
				v[4].x = t_x
				v[4].y = t_y + t_r*1.1+t_t*2.5
				
				arrowhead.values = [
					{
						x:v[4].x,
						y:v[4].y - t_t*3
					},
					{
						x:v[4].x - t_t*1.5,
						y:v[4].y + t_t*.5
					},
					{
						x:v[4].x,
						y:v[4].y - t_t*.5
					},
					{
						x:v[4].x + t_t*1.5,
						y:v[4].y + t_t*.5
					}
				]
				if (t_x > s_x) {
					v[0].x = s_x + s_r*0.8
					v[0].y = s_y + s_r*0.8
					v[1].x = s_x + s_r*1
					v[1].y = s_y + s_r*1
					v[2].x = t_x - t_r*0.5
					v[2].y = s_y + s_r+t_t
					if (t_x - t_r < s_x + s_r) {
						var diff = s_x + s_r - t_x - t_r;
						v[2].x -= diff/2
					}
					tilde.merger_data.push(arrowhead)
				} else if (t_x < s_x) {
					v[0].x = s_x - s_r*0.8
					v[0].y = s_y + s_r*0.8
					v[1].x = s_x - s_r*1
					v[1].y = s_y + s_r*1
					v[2].x = t_x + t_r*0.5
					v[2].y = s_y + s_r+t_t
					if (t_x + t_r > s_x - s_r) {
						var diff = t_x + t_r - s_x - s_r;
						v[2].x += diff/2
					}
					tilde.merger_data.push(arrowhead)
				} else {
					v[0].x = s_x - s_r*1.1
					v[0].y = s_y
					v[1].x = s_x - s_r*1.2
					v[1].y = s_y
					v[2].x = t_x - t_r*4
					v[2].y = s_y-(s_y-t_y)/2
					v[3].x = t_x - t_r*1.2
					v[3].y = t_y 
					v[4].x = t_x - t_r*1.1
					v[4].y = t_y
					var test_name = d.name.replace(/a/g,"")
					if (test_name == d.name) {
						//right side
						v[0].x = s_x + s_r*1.1
						v[1].x = s_x + s_r*1.2
						v[2].x = t_x + t_r*4
						v[3].x = t_x + t_r*1.2
						v[4].x = t_x + t_r*1.1
					}
					arrow_data.centered = true
				}
				tilde.merger_data.push(arrow_data)
			}
		}
	}
}

tilde.drawMergers = function(callback_time) {
	if (tilde.mergers) {
		tilde.mergers.remove()
	}
	tilde.createArrowData()
	//place the merger arrows
	var combined_lines = [];
	var checked = {};
	tilde.mergers = tilde.starWrapper.selectAll(".merger")
		.data(tilde.merger_data)
		.enter().append("svg:path")
		.attr("class","merger")
		.classed("bh_merger", function(dd){
			if (dd.type == "L_BH") {
				return true
			}
			return false
		})
		.classed("ns_merger", function(dd){
			if (dd.type == "L_NS") {
				return true
			}
			return false
		})
		.attr("d", function(dd) {
			dd.path = tilde.line(dd.values)
			if (dd.arrow) {
				var s = tilde.arrow(dd.values) + ' Z'
				var nth = 0;
				s = s.replace(/L/g, function (match, i, original) {
				    nth++;
				    return (nth === 2) ? " Q " : (nth === 3) ? " " : ' L';
				});
				s = s.replace(/,/g, ' ');
				dd.path = s
			}
			return dd.path
		})
		.attr("stroke", function(dd) { 
			if (!dd.arrow) {
				return dd.color()
			}
			return 'none'
		})
		.attr('fill',function(dd){
			if (dd.arrow) {
				return 'gray'
			}
			return 'none'
		})
		.attr("stroke-width", function(dd){
			if (dd.arrow) {
				return 0
			}
			return dd.thickness
		})
		.attr("stroke-opacity",0)
		.attr("fill-opacity",0)
		.style("opacity",0)
		.on("mousemove",tilde.mergerTooltip)
		.on("mouseout",tilde.mouseout)

    if (tilde.stars_in_front){
    	tilde.stars.moveToFront()
    } else {
    	tilde.bars.moveToFront()
    }
    d3.select(".question_mark").moveToFront()

	if (tilde.mergers_shown) {
		tilde.showMergers(callback_time)
	}
}
tilde.hideMergers = function(time) {
	var transition = time;
	if (time === undefined) {
		transition = 250
	}
	tilde.starWrapper.selectAll(".merger")
		.transition()
		.duration(transition)
		.attr("stroke-opacity",0)
		.attr("fill-opacity",0)
}
tilde.showMergers = function(time) {
	var transition = time;
	if (time === undefined) {
		transition = 800
	}
	if (!(tilde.ns_shown)) {
		d3.selectAll(".bh_merger")
			.transition()
			.duration(transition)
			.style("opacity",1)
			.attr("stroke-opacity",.33)
			.attr("fill-opacity",function(d){
				if (d.arrow) {
					return 1
				}
				return 1
			})
	} else {
		tilde.mergers
			.transition('show_mergers')
			.duration(transition)
			.style("opacity",1)
			.attr("stroke-opacity",.33)
			.attr("fill-opacity",function(d){
				if (d.arrow) {
					return 1
				}
				return 1
			})
	}
}
tilde.bindOptions = function() {
	d3.select(".menu_wrapper")
		.on("click",tilde.toggleMenu)

	d3.selectAll(".option_type")
		.on("click", tilde.toggleOptions)

	d3.selectAll(".option_type, .option")
		.on("mousemove",tilde.showTip)
		.on("mouseout",tilde.mouseout)

	d3.select("#view_full")
		.on("click",tilde.animate.burstStars)

	d3.select("#view_center")
		.on("click",tilde.animate.centerStars)

	d3.select("#view_spread")
		.on("click",tilde.animate.scaleStars)

	d3.select("#view_split")
		.on("click",tilde.animate.divideStars)

	d3.select("#view_cat_one")
		.on("click",tilde.bhCategory)

	d3.select("#view_cat_two")
		.on("click",tilde.nsCategory)

	d3.select("#view_merger")
		.on("click",tilde.animate.burstStars)

	d3.select("#toggle_gap")
		.on("click",tilde.toggleGap)

	d3.select("#toggle_bh")
		.on("click",tilde.toggleBH)

	d3.select("#toggle_ns")
		.on("click",tilde.toggleNS)

	d3.select("#toggle_gw")
		.on("click",tilde.toggleGW)

	d3.select("#toggle_em")
		.on("click",tilde.toggleEM)

	d3.select("#toggle_title")
		.on("click",tilde.toggleTitle)

	d3.select("#toggle_labels")
		.on("click",tilde.toggleLabels)

	d3.select("#toggle_bh_error")
		.on("click",tilde.toggleBHError)

	d3.select("#toggle_ns_error")
		.on("click",tilde.toggleNSError)

	d3.select("#toggle_axis")
		.on("click",tilde.toggleAxis)

	d3.select("#log_scale")
		.on("click",tilde.changeToLog)

	d3.select("#lin_scale")
		.on("click",tilde.changeToLin)

	d3.select("#radius")
		.on("click",tilde.toggleRadius)

	d3.select("#order")
		.on("click",tilde.starLayering)

	d3.select("#color")
		.on("click",tilde.colorMixing)

	d3.select("#shading")
		.on("click",tilde.shadeStars)

	d3.select("#range_choices")
		.on("click",tilde.toggleZoom)

	d3.select("#scheme")
		.on("click",tilde.toggleScheme)

	d3.select("#toggle_merger")
		.on("click",tilde.toggleMerger)
}