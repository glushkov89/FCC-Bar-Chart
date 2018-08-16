// Objective: Build a CodePen.io app that is functionally similar to this: https://codepen.io/freeCodeCamp/full/GrZVaM.
// Fulfill the below user stories and get all of the tests to pass. Give it your own personal style.
// You can use HTML, JavaScript, CSS, and the D3 svg-based visualization library.
//The tests require axes to be generated using the D3 axis property, which
//automatically generates ticks along the axis. These ticks are required for
//passing the D3 tests because their positions are used to determine alignment
//of graphed elements. You will find information about generating axes at
//https://github.com/d3/d3/blob/master/API.md#axes-d3-axis. Required (non-virtual)
//DOM elements are queried on the moment of each test. If you use a frontend
//framework (like Vue for example), the test results may be inaccurate for
//dynamic content. We hope to accommodate them eventually, but these frameworks
//are not currently supported for D3 projects.
// User Story #1: My chart should have a title with a corresponding id="title".
// User Story #2: My chart should have a g element x-axis with a corresponding id="x-axis".
// User Story #3: My chart should have a g element y-axis with a corresponding id="y-axis".
// User Story #4: Both axes should contain multiple tick labels, each with the corresponding class="tick".
// User Story #5: My chart should have a rect element for each data point with a corresponding class="bar" displaying the data.
// User Story #6: Each bar should have the properties data-date and data-gdp containing date and GDP values.
// User Story #7: The bar elements' data-date properties should match the order of the provided data.
// User Story #8: The bar elements' data-gdp properties should match the order of the provided data.
// User Story #9: Each bar element's height should accurately represent the data's corresponding GDP.
// User Story #10: The data-date attribute and its corresponding bar element should align with the corresponding value on the x-axis.
// User Story #11: The data-gdp attribute and its corresponding bar element should align with the corresponding value on the y-axis.
// User Story #12: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
// User Story #13: My tooltip should have a data-date property that corresponds to the data-date of the active area.
// Here is the dataset you will need to complete this project: https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json
// You can build your project by forking this CodePen pen. Or you can use this CDN link to run the tests in any environment you
//like: https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js.
// Once you're done, submit the URL to your working project with all its tests passing.
// Remember to use the Read-Search-Ask method if you get stuck.

// const appMod = (function() {
// 	const d3 = require("d3");
// 	return {};
// })();

document.addEventListener("DOMContentLoaded", function() {
	//	console.log("Document Loaded");
	const req = new XMLHttpRequest();
	req.open(
		"GET",
		"https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json",
		true
	);
	req.send();
	req.onload = function() {
		const json = JSON.parse(req.responseText);
		//		const data = json.data[0].append(json.data[1]).append(json.data[2]);
		console.log(json);
		//		console.log(json);
		//console.log(json.data.length);
		/*----------------D3 Code here-----------------*/
		const d3 = require("d3"),
			units = json.description.match(/(units: )(.*)/i)[2],
			//Padding
			pd = { top: 50, bottom: 50, right: 30, left: 70 },
			//Bar width
			bw = 3,
			//Diagram
			dh = 500, //height
			dw = json.data.length * bw, //width
			//SVG
			sw = pd.left + dw + pd.right, //width
			sh = pd.top + dh + pd.bottom, //height
			//Scales
			//			parseTime = d3.timeParse("%Y-%m-%d"),
			parseTime = d3.timeParse("%Y-%m-%d"),
			x = d3
				.scaleTime()
				.domain([
					// d3.min(json.data, (d) => parseTime(d[0])),
					// d3.max(json.data, (d) => parseTime(d[0]))
					d3.min(json.data, (d) => parseTime(d[0])),
					d3.max(json.data, (d) => parseTime(d[0]))
				])
				.range([0, dw]),
			y = d3
				.scaleLinear()
				.domain([0, d3.max(json.data, (d) => d[1])])
				.range([0, dh]),
			yA = d3
				.scaleLinear()
				.domain([0, d3.max(json.data, (d) => d[1])])
				.range([dh, 0]);
		console.log(x(parseTime("2015-01-01")));
		//Axis
		const yAxis = d3.axisLeft(yA);
		const xAxis = d3.axisBottom(x);

		const svg = d3
			.select("main")
			.append("svg")
			.attr("width", sw)
			.attr("height", sh);
		let tooltipDiv = d3
			.select("body")
			.append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);
		const tooltipParse = (arr) => {
			let qtr = "";
			switch (arr[0].substring(5, 7)) {
				case "01":
					qtr = "Q1";
					break;
				case "04":
					qtr = "Q2";
					break;
				case "07":
					qtr = "Q3";
					break;
				case "10":
					qtr = "Q4";
					break;
				default:
					break;
			}
			return `${qtr} ${arr[0].substring(0, 4)}</br>$${d3.format(",")(
				arr[1]
			)} Billion`;
		};
		// 			var element = d3.select('.elementClassName').node();
		// element.getBoundingClientRect().width;
		const title = svg
			.append("text")
			.attr("id", "title")
			.text(json.name + ", " + json.frequency + ".");
		/*---Centering title in data and top padding---*/
		title
			.attr(
				"x",
				pd.left + dw / 2 - title.node().getBoundingClientRect().width / 2
			)
			.attr("y", (pd.top + title.node().getBoundingClientRect().height) / 2);
		/*---------Generating bars-----------*/
		svg
			.selectAll("rect")
			.data(json.data)
			.enter()
			.append("rect")
			.attr("data-date", (d) => d[0])
			.attr("data-gdp", (d) => d[1])
			.attr("class", "bar")
			.attr("fill", "#0f72b8")
			//	.attr("x", (d, i) => i * bw + pd.left)
			.attr("x", (d) => x(parseTime(d[0])) + pd.left)
			.attr("y", (d) => dh - y(d[1]) + pd.top)
			.attr("width", bw)
			.attr("height", (d) => y(d[1]))
			.on("mouseover", (d) => {
				tooltipDiv
					.attr("id", "tooltip")
					.attr("data-date", d[0])
					.transition()
					.duration(100)
					.style("opacity", 0.9);
				tooltipDiv
					.html(tooltipParse(d))
					.style("left", d3.event.pageX + pd.right / 2 + "px")
					.style("top", d3.event.pageY - pd.bottom + "px");
			})
			.on("mouseout", (d) => {
				tooltipDiv
					.transition()
					.duration(300)
					.style("opacity", 0);
			});
		/*---------Generating axiss-----------*/
		svg
			.append("g")
			.call(yAxis)
			.attr("id", "y-axis")
			.attr("transform", "translate(" + pd.left + ", " + pd.top + ")");
		//Y-axis label alignment
		const label = svg
			.append("text")
			.attr("id", "label")
			.attr("transform", "rotate(-90)")
			.text(units);
		label
			.attr("x", -(label.node().getBoundingClientRect().height + pd.top))
			.attr("y", label.node().getBoundingClientRect().width + pd.left);
		svg
			.append("g")
			.call(xAxis)
			.attr("id", "x-axis")
			.attr("transform", "translate(" + pd.left + ", " + (pd.top + dh) + ")");
	};
});
