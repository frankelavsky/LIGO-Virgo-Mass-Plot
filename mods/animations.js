/* 
//	- TILDE, TILD3, and tilde are all js-library catch-words (so to speak) by Frank Elavsky at Northwestern University
//	- A special thanks on this project goes out to Nadieh Bremer (visualcinnamon.com) for amazing inspirations
//	- Also thanks to LIGO, CIERA, and all astrophysicists who have provided the data (see dataset.js for sources)
*/
tilde.animate = {};

tilde.animate.placeStars = function() {
	if (tilde.status === false) {
		return
	}
	tilde.lock();
	tilde.showMenu();
	tilde.y.domain([tilde.y.domain()[0],tilde.ligo_max]);
	tilde.cat = 0;
	tilde.hideLabels()
	d3.select(".question_mark")
		.style("opacity",0)
	
	d3.selectAll(".type_label,.credits")
		.classed("hidden",false)
		.style("opacity",0)
		.transition("type_label_fade_in")
		.duration(4500)
		.delay(2000)
		.style("opacity",1)

	d3.selectAll(".title,.subtitle")
		.classed("hidden",false)
		.style("opacity",0)
		.transition("type_label_fade_in")
		.duration(4500)
		.delay(500)
		.style("opacity",1)

	tilde.notice
		.transition().duration(500)
		.style("opacity",0)
		.call(endall, function(){
			tilde.notice.remove()
		})

	var mass_data = tilde.data;
	var radial_data = tilde.radial_data;
	var y = tilde.y;
	var starColor = tilde.starColor;
	var starOpacity = tilde.starOpacity;
	var w = tilde.width;
	var radial_timing = 4500;
	var star_timing = 4000;
	var radial_delay = 1000;
	var blend_delay = 1200;
	var dim_delay = 800;

	var min = d3.min(mass_data, function(d) { return d.target_x; });
	var max = d3.max(mass_data, function(d) { return d.target_x; });

	var x = d3.scale.linear()
		.domain([min,max])
		.range([w*0.05,w*0.95]);

	//Put the stars in their location
	d3.selectAll("#tilde .stars")
		.transition("blep")
		.call(endall, function() {	 
			//Make the cover circle shrink

			tilde.starCoverRemoved = 1;
			
			d3.selectAll(".starCover")
				.transition().duration(1800).delay(2200)
				.attr("r", 0)
				.call(endall, function() {
					d3.selectAll(".starCover").remove()
			 	});
			

			d3.selectAll("#tilde .error_bar")
		 		.transition("animate_bars").duration(star_timing)
				.delay(function(d,i) { 
					return	i*20; 
				})
				.attr("x",function(d){
					d.bar_x = x(d.target_x)-d.error_width/2;
					return d.bar_x;
				})
				.attr("fill", function(d) { 
					return d.barFill(); 
				})
				.style("mix-blend-mode", "screen")
			
	 		d3.selectAll("#tilde .stars")
				.style("mix-blend-mode", "normal")
				.attr("fill",function(d){
					return d.starFill();
				})
				.transition("move").duration(star_timing)
				.delay(function(d,i) { 
					return	i*20; 
				})
				.attr("r", function(d) {
					d.radius = tilde.rScale(d.mass);
					return d.radius;
				})
				.attr("cy", function(d,i) {
					d.y = y(d.mass)
					return d.y;
				})
				.attr("cx", function(d) {
					d.x = x(d.target_x)
					return d.x;
				})
				.call(endall, function() {
					tilde.unlock()
					tilde.drawDashes(500)
					tilde.mergers_shown = true
					tilde.drawMergers(1200)
					tilde.moveQuestionMark(800)
					d3.select(".question_mark")
						.moveToFront()
					tilde.clicked = 1;
					tilde.animate.burstStars()	 		
			 	});

		 	d3.selectAll("#tilde .stars")
				.transition("dim").duration(star_timing)
				.delay(function(d,i) { 
					return	dim_delay+i*25; 
				})
				.style("opacity", function(d){
					return d.opacity()
				})

			d3.selectAll("#tilde .stars")
				.transition("blend").duration(star_timing)
				.delay(function(d,i) { 
					return	blend_delay+i*25; 
				})
				.style("mix-blend-mode", "screen")

			d3.selectAll(".ns_radial_first")
				.transition("ns_first").duration(radial_timing)
				.delay(function(d,i) { 
					return	i*25+radial_delay; 
				})
				.attr("stop-color", function(d) { 
					return d3.rgb(starColor(d.type)).brighter(1); 
				});

			d3.selectAll(".ns_radial_second")
				.transition("ns_second").duration(radial_timing)
				.delay(function(d,i) { 
					return	i*25+radial_delay; 
				})
				.attr("stop-color", function(d) { 
					return starColor(d.type); 
				});

			d3.selectAll(".ns_radial_third")
				.transition("ns_third").duration(radial_timing)
				.delay(function(d,i) { 
					return	i*25+radial_delay; 
				})
				.attr("stop-color", function(d) { 
					return d3.rgb(starColor(d.type)).darker(1.5); 
				});

			d3.selectAll(".bh_radial_first")
				.transition("ns_first").duration(radial_timing)
				.delay(function(d,i) { 
					return	i*25+radial_delay; 
				})
				.attr("stop-color", function(d) { 
					return d3.rgb(starColor(d.type)).darker(3);
				});

			d3.selectAll(".bh_radial_second")
				.transition("ns_second").duration(radial_timing)
				.delay(function(d,i) { 
					return	i*25+radial_delay; 
				})
				.attr("stop-color", function(d) { 
					return d3.rgb(starColor(d.type)).darker(1); 
				});

			d3.selectAll(".bh_radial_third")
				.transition("ns_third").duration(radial_timing)
				.delay(function(d,i) { 
					return	i*25+radial_delay; 
				})
				.attr("stop-color", function(d) { 
					return starColor(d.type); 
				});
			
			//Update the y axis
			tilde.clusterAxis.scale(y);
			tilde.svg.select(".y.axis")
				.attr("opacity",function(){
					if (!(tilde.drawn)) {
						return 0
					}
					return 1
				})
				.call(tilde.clusterAxis)
			tilde.styleAxis()

			tilde.svg.select(".y.axis")
				.transition("show_axis").duration(3800).delay(1500)
				.style("opacity",1);

			//Remove gooey filter from stars
			d3.selectAll("#tilde .blurValues")
				.transition().duration(1500).delay(function(d,i) { 
					return star_timing; 
				})
				.attrTween("values", function() { 
					return d3.interpolateString("1 0 0 0 0	0 1 0 0 0	0 0 1 0 0	0 0 0 18 -5", 
												"1 0 0 0 0	0 1 0 0 0	0 0 1 0 0	0 0 0 6 -5"); 
				})
		})

 	d3.selectAll(".stars, .error_bar")
		.on("mousemove",tilde.mousemove)
		.on("mouseout",tilde.mouseout)
		.call(tilde.drag)

};

tilde.animate.burstStars = function() {
	tilde.stop();
	if (tilde.status === false) {
		return
	}
	var burst_duration = 800;
	if (tilde.clicked){
		burst_duration = 10
	}
	tilde.showNS(false)
	tilde.showBH(false)
	tilde.zoomed = false;
	d3.select("#full_range").classed("selected",true)
	d3.select("#ns_range").classed("selected",false)
	tilde.lock();
	tilde.toggleGroup("view_full")
	tilde.cat = 0;
	tilde.hideLabels()
	tilde.animate.rescaleView("reset_default")

	d3.selectAll(".type_label").classed("hidden",false)
	d3.select("#toggle_labels").classed("selected",true)

	var w = tilde.width;

	var mass_data = tilde.data;
	

	var min = d3.min(mass_data, function(d) { return d.target_x; });
	var max = d3.max(mass_data, function(d) { return d.target_x; });

	var x = d3.scale.linear()
		.domain([min,max])
		.range([w*0.05,w*0.95]);

	d3.selectAll("#tilde .error_bar")
 		.transition("animate_bars").duration(function(d,i) { 
			return burst_duration+rnd2()*10; 
		})
		.delay(function(d,i) { 
			return	i*8; 
		})
		.attr("x",function(d){
			d.bar_x = x(d.target_x)-d.error_width/2;
			return d.bar_x;
		})

	d3.selectAll(".stars")
		.transition("animate_stars").duration(function(d,i) { 
			return burst_duration+rnd2()*10; 
		})
		.delay(function(d,i) { 
			return i*8; 
		})
		.attr("cx", function(d) {
			d.x = x(d.target_x)
			return d.x;
		})
		.call(endall, function(){
			tilde.unlock();
		})
};

tilde.animate.scaleStars = function() {
	tilde.stop()
	if (tilde.status === false) {
		return
	}
	tilde.showNS(false)
	tilde.showBH(false)
	tilde.zoomed = false;
	d3.select("#full_range").classed("selected",true)
	d3.select("#ns_range").classed("selected",false)
	tilde.lock();
	tilde.toggleGroup("view_spread")
	tilde.cat = 0;
	tilde.hideLabels()
	tilde.animate.rescaleView("reset_default")

	var w = tilde.width;

	var mass_data = tilde.data;

	var min = d3.min(mass_data, function(d) { return d.mass; });
	var max = d3.max(mass_data, function(d) { return d.mass; });

	var x = d3.scale.linear()
		.domain([1,tilde.data.length])
		.range([w*0.05,w*0.95]);

	d3.selectAll("#tilde .error_bar")
 		.transition("divide_bars").duration(800)
		.delay(function(d,i) { 
			return	i*8; 
		})
		.attr("x",function(d){
			d.bar_x = x(d.order)-d.error_width/2;
			return d.bar_x;
		})

	d3.selectAll("#tilde .stars")
		.transition("divide").duration(800)
		.delay(function(d,i) { 
			return	i*8; 
		})
		.attr("cx", function(d) {
			d.x = x(d.order)
			return d.x;
		})
		.call(endall, function(){
			tilde.unlock();
		})
};

tilde.animate.centerStars = function() {
	tilde.stop();
	if (tilde.status === false) {
		return
	}
	tilde.showNS(false)
	tilde.showBH(false)
	tilde.zoomed = false;
	d3.select("#full_range").classed("selected",true)
	d3.select("#ns_range").classed("selected",false)
	tilde.lock();
	tilde.toggleGroup("view_center")
	tilde.cat = 0;
	tilde.hideLabels()
	tilde.animate.rescaleView("reset_default")

	var w = tilde.width;

	d3.selectAll("#tilde .error_bar")
 		.transition("center_bars").duration(800)
		.delay(function(d,i) { 
			return	i*8; 
		})
		.attr("x",function(d){
			d.bar_x = w/2-d.error_width/2;
			return d.bar_x;
		})

	d3.selectAll("#tilde .stars")
		.transition("center").duration(800)
		.delay(function(d,i) { 
			return	i*8; 
		})
		.attr("cx", function(d) {
			d.x = w/2
			return d.x;
		})
		.call(endall, function(){
			tilde.unlock();
		})
};

tilde.animate.matrixStars = function() {
	tilde.stop();
	if (tilde.status === false) {
		return
	}
	tilde.lock();
	tilde.hideLabels();
	if (tilde.cat == 2){
		tilde.toggleGroup("view_cat_two")
		d3.selectAll(".ns_label").classed("hidden",false)
		d3.selectAll(".bh_label").classed("hidden",true)
	} else {
		tilde.toggleGroup("view_cat_one")
		d3.selectAll(".ns_label").classed("hidden",true)
		d3.selectAll(".bh_label").classed("hidden",false)
	}
	d3.select("#toggle_labels").classed("selected",true)
	
	var mass_data = tilde.data;

	var w = tilde.width;

	var scales = {};
	var areas = [[0.1,0.29],[0.31,0.49],[0.51,0.69],[0.71,0.9],[0.1,0.49],[0.51,0.9]];

	var count = 0;

	tilde.categories.forEach(function(d){
		var filtered = mass_data.filter(function(item) {
			return item.category === d
		})
		filtered.sort(function(a,b) {
			return a.order - b.order
		})
		var min = d3.min(filtered, function(d) { return d.order; });
		var max = d3.max(filtered, function(d) { return d.order; });
		var mapped = [];
		filtered.forEach(function(d){
			mapped.push(d.order)
		})
		scales[d] = d3.scale.ordinal()
			.domain(mapped)
			.rangePoints([areas[count][0],areas[count][1]]);
		count++
	})

	function matrix(d) {
		return w*scales[d.category](d.order)
	}

	d3.selectAll("#tilde .error_bar")
 		.transition("spread_bars").duration(1500)
		.delay(function(d,i) { 
			return	i*15; 
		})
		.attr("x",function(d){
			d.bar_x = matrix(d)-d.error_width/2;
			return d.bar_x;
		})

	d3.selectAll("#tilde .stars")
		.transition("spread").duration(1500)
		.delay(function(d,i) { 
			return	i*15; 
		})
		.attr("cx", function(d) {
			d.x = matrix(d)
			return d.x;
		})
		.call(endall, function(){
			tilde.unlock();
		})
};

tilde.animate.divideStars = function() {
	tilde.stop();
	if (tilde.status === false) {
		return
	}
	tilde.showNS(false)
	tilde.showBH(false)
	tilde.zoomed = false;
	d3.select("#full_range").classed("selected",true)
	d3.select("#ns_range").classed("selected",false)
	tilde.lock();
	tilde.toggleGroup("view_split")
	tilde.cat = 0;
	tilde.hideLabels()
	tilde.animate.rescaleView("reset_default")

	var w = tilde.width;

	var mass_data = tilde.data;

	var bh_filtered = mass_data.filter(function(item) {
		return item.type === "L_BH" || item.type === "BH"
	})
	var ns_filtered = mass_data.filter(function(item) {
		return item.type === "L_NS" || item.type === "NS"
	})

	var bh_min = d3.min(bh_filtered, function(d) { return d.mass; });
	var bh_max = d3.max(bh_filtered, function(d) { return d.mass; });

	var ns_min = d3.min(ns_filtered, function(d) { return d.mass; });
	var ns_max = d3.max(ns_filtered, function(d) { return d.mass; });

	var bh_x = d3.scale.linear()
		.domain([ns_filtered.length+1,tilde.data.length])
		.range([w*0.05,w*0.95]);
	var ns_x = d3.scale.linear()
		.domain([1,ns_filtered.length])
		.range([w*0.05,w*0.95]);

	d3.selectAll("#tilde .error_bar")
 		.transition("divide_the_bars").duration(800)
 		.delay(function(d,i) { 
			return	i*8; 
		})
		.attr("x", function(d) {
			if (d.type === "L_NS" || d.type === "NS") {
				d.bar_x = ns_x(d.order)-d.error_width/2
			} else {
				d.bar_x = bh_x(d.order)-d.error_width/2
			}
			return d.bar_x;
		})

	d3.selectAll("#tilde .stars")
		.transition("divide").duration(800)
		.delay(function(d,i) { 
			return	i*8; 
		})
		.attr("cx", function(d) {
			if (d.type === "L_NS" || d.type === "NS") {
				d.x = ns_x(d.order)
			} else {
				d.x = bh_x(d.order)
			}
			return d.x;
		})
		.call(endall, function(){
			tilde.unlock();
		})
};

tilde.animate.splitStars = function() {
	tilde.stop();
	if (tilde.status === false) {
		return
	}
	tilde.lock();

	var w = tilde.width;

	var x = d3.scale.ordinal()
		.domain(tilde.categories)
		.range([w*0.13,w*0.26,w*0.39,w*0.52,w*0.65,w*0.78])

	d3.selectAll("#tilde .stars")
		.transition("split").duration(1500)
		.delay(function(d,i) { 
			return	i*15; 
		})
		.attr("cx", function(d) {
			d.x = x(d.category)
			return d.x;
		})
		.call(endall, function(){
			tilde.unlock();
		})
};

tilde.animate.spreadStars = function() {
	tilde.stop();
	if (tilde.status === false) {
		return
	}
	tilde.lock();

	var mass_data = tilde.data;

	var w = tilde.width;

	var scales = {};
	var areas = [[0.07,0.19],[0.2,0.32],[0.33,0.45],[0.46,0.58],[0.59,0.71],[0.72,0.84]];

	var count = 0;

	tilde.categories.forEach(function(d){
		var filtered = mass_data.filter(function(item) {
			return item.category === d
		})
		var min = d3.min(filtered, function(d) { return d.mass; });
		var max = d3.max(filtered, function(d) { return d.mass; });
		scales[d] = d3.scale.linear()
			.domain([min,max])
			.range([areas[count][0],areas[count][1]]);
		count++
	})

	function matrix(d) {
		return w*scales[d.category](d.mass)
	}

	d3.selectAll("#tilde .stars")
		.transition("spread").duration(1500)
		.delay(function(d,i) { 
			return	i*15; 
		})
		.attr("cx", function(d) {
			d.x = matrix(d)
			return d.x;
		})
		.call(endall, function(){
			tilde.unlock();
		})
};

tilde.animate.gridStars = function() {
	tilde.stop();
	if (tilde.status === false) {
		return
	}
	tilde.lock();

	var w = tilde.width;

	var x = d3.scale.ordinal()
		.domain(tilde.categories)
		.range([w*0.2,w*0.4,w*0.6,w*0.8,w*0.3,w*0.7])

	d3.selectAll("#tilde .stars")
		.transition("split").duration(1500)
		.delay(function(d,i) { 
			return	i*15; 
		})
		.attr("cx", function(d) {
			d.x = x(d.category)
			return d.x;
		})
		.call(endall, function(){
			tilde.unlock();
		})
};

tilde.animate.explodeStars = function() {
	tilde.stop();
	if (tilde.status === false) {
		return
	}
	tilde.lock();

	var mass_data = tilde.data;

	tilde.charge_scale = d3.scale.linear()
		.domain([0,1080,2160])
		.range([-75,-300,-550])

	tilde.gravity_scale = d3.scale.linear()
		.domain([0,1080,2160])
		.range([0.25,0.20,0.15])

	var w = tilde.width;

	var force = tilde.force
		.nodes(mass_data)
		.size([tilde.width, tilde.height])
		.on("tick", tick)
		.charge(tilde.charge_scale(w))
		.gravity(tilde.gravity_scale(w))

	d3.selectAll("#tilde .stars")
		.transition("gravitize")
		.duration(function(d,i) { 
			return 15000/(Math.sqrt(i+100)); 
		})
		.delay(function(d,i) { 
			return 300+i*20
		})
		.attr("cx", function(d) {
			d.x = tilde.width/2
			return d.x;
		})
		.call(endall, function(){
			d3.selectAll("#tilde .stars")
				.transition("explode")
				.delay(300)
				.duration(0)
				.call(endall, function(){
					force.start()
					d3.selectAll("#tilde .stars")
						.transition("settle").duration(2400)
						.each(function(d,i){
							if (!(i%10)) {
								force.tick();
							}
						})
						.call(endall, function(){
							force.resume();
							tilde.unlock();	
						})
				})
		})
		
	function tick(e) {
		d3.selectAll("#tilde .stars")
			.each(collide(e.alpha))
			.attr("cx", function(d) { return d.x; })
	}

	// Resolve collisions between nodes.
	function collide(alpha) {
		var quadtree = d3.geom.quadtree(mass_data);
		return function(d) {
			var r = d.radius,
				nx1 = d.x - r,
				nx2 = d.x + r,
				ny1 = d.y - r,
				ny2 = d.y + r;
			quadtree.visit(function(quad, x1, y1, x2, y2) {
				if (quad.point && (quad.point !== d)) {
					var x = d.x - quad.point.x,
						y = d.y - quad.point.y,
						l = Math.sqrt(x * x + y * y),
						r = d.radius + quad.point.radius;
					if (l < r) {
						l = (l - r) / l * alpha;
						d.x -= x *= l;
						d.y -= y *= l;
						quad.point.x += x;
						quad.point.y += y;
					}
				}
				return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			});
		};
	}
};

tilde.animate.rescaleView = function(reset,callback) {
	var y = tilde.y;
	var mass_data = tilde.data;

	if (reset == "reset_default") {
		y.domain([y.domain()[0],tilde.ligo_max])
	}

	var star_speed = 1500

	if (!tilde.clicked){
		tilde.hideMergers()
		d3.select(".question_mark")
			.style("opacity",0)
	}
	
	var misc_speed = star_speed*.75

	var ticks = [];

	if (tilde.scale_status === "log") {
		if (y.domain()[1] == tilde.ns_max) {
			ticks = tilde.log_ns_ticks;
		} else {
			ticks = tilde.log_ligo_ticks;
		}
	} else {
		if (y.domain()[1] == tilde.ns_max) {
			ticks = tilde.ns_ticks;
		} else {
			ticks = tilde.ligo_ticks;
		}
	}
	
	//Update the y axis
	tilde.clusterAxis.scale(y).tickValues(ticks);
	tilde.svg.select(".y.axis")
		.attr("opacity",function(){
			if (!(tilde.drawn)) {
				return 0
			}
			return 1
		})
		.transition("rescale_axis").duration(misc_speed).delay(300)
		.call(tilde.clusterAxis)
	tilde.styleAxis()

	//Put the stars and bars in their new location
	d3.selectAll(".stars")
		.transition("rescale_stars").duration(star_speed)
		.delay(function(d,i) { 
			return	i*15; 
		})
		.attr("r", function(d) {
			d.radius = tilde.rScale(d.mass);
			return d.radius;
		})
		.attr("cy", function(d){
			return y(d.mass)
		})
		.call(endall,function(d){
			if (tilde.clicked) {
				tilde.clicked = 0
			} else {
				tilde.drawMergers()
				if (tilde.ns_shown) {
					tilde.moveQuestionMark()
				}
			}
			
		})

	d3.selectAll(".error_bar")
 		.transition("rescale_bars").duration(star_speed)
		.delay(function(d,i) { 
			return	i*15; 
		})
		.attr("height",function(d){
			return d.error_height()
		})
		.attr("y", function(d){
			return d.error_y()
		})

	// Move Labels
	d3.selectAll(".bh_label")
		.transition("move_bh_labels")
		.duration(misc_speed)
		.attr("y", function(){
			return (this.id === 'galactic') ? tilde.y(10.1) : tilde.y(40.1)
		})

	d3.selectAll(".ns_label")
		.transition("move_ns_labels")
		.duration(misc_speed)
		.attr("y", function(){
			return tilde.y(2.85)
		})

	d3.select("#ligo_bh_label")
		.transition("move_ligo_bh_label")
		.duration(misc_speed)
		.attr("y", function(){
			if (tilde.scale_status == "lin") {
				return tilde.y(65)
			}
			return tilde.y(81)
		})

	d3.select("#em_bh_label")
		.transition("move_em_bh_label")
		.duration(misc_speed)
		.attr("y", function(){
			return tilde.y(7.4)
		})

	d3.select("#ligo_ns_label")
		.transition("move_ligo_ns_label")
		.duration(misc_speed)
		.attr("y", function(){
			if (tilde.scale_status == "lin" && !tilde.zoomed) {
				return tilde.y(0.85) + tilde.ns_fs(tilde.width)
			}
			return tilde.y(1.025)
		})

	d3.select("#em_ns_label")
		.transition("move_em_ns_label")
		.duration(misc_speed)
		.attr("y", function(){
			if (tilde.scale_status == "lin" && !tilde.zoomed) {
				return tilde.y(0.85) + tilde.ns_fs(tilde.width)
			}
			return tilde.y(2.74) + tilde.ns_fs(tilde.width)
		})

	d3.select("#gap")
		.transition("move_gap")
		.duration(misc_speed)
		.attr("height",function(d){
			return d.height()
		})
		.attr("y",function(d){
			return d.y()
		})

	d3.select(".gap_text")
		.transition("move_gap_label")
		.duration(misc_speed)
		.attr("fill",function(){
			if (tilde.cat === 2) {
				return "#101010"
			} 
			if (tilde.scale_status == "lin") {
				return "#AFAFAF"
			}
			return "#101010"
		})
		.attr("y",function(d){
			var text_height = d.text_height
			var output = tilde.y(3.85) + text_height;
			if (tilde.cat === 2) {
				output = tilde.y(2.9)
			} else if (tilde.scale_status == "lin") {
				output = tilde.y(4.9)
			}
			return output
		})
		.attr("x",function(d){
			var output = tilde.width/2 -this.getComputedTextLength()/2;
			if (tilde.scale_status == "lin" && (d3.select("#view_spread").classed("selected") || d3.select("#view_cat_one").classed("selected"))) {
				output = tilde.gap.width - this.getComputedTextLength()
			} else if (tilde.scale_status == "lin" && tilde.cat !== 2) {
				output = 0
			}
			return output
		})
};

tilde.init();
tilde.lock();

