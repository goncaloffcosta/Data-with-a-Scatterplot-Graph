const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

const width = 800;
const height = 400;
const padding = 60;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const timeParser = d3.timeParse("%M:%S");
    const timeFormatter = d3.timeFormat("%M:%S");

    data.forEach((d) => {
      d.Time = timeParser(d.Time);
    });

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
      .range([padding, width - padding]);

    const yScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Time))
      .range([padding, height - padding]);

    const svg = d3
      .select("#scatterplot")
      .attr("width", width)
      .attr("height", height);

    // X-axis
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    // Y-axis
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormatter);
    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    // Dots
    svg
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d.Time))
      .attr("r", 6)
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d.Time.toISOString())
      .attr("fill", (d) => (d.Doping ? "red" : "blue"))
      .on("mouseover", function (event, d) {
        const tooltip = d3.select("#tooltip");
        tooltip
          .style("opacity", 1)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px")
          .attr("data-year", d.Year)
          .html(
            `${d.Name} (${d.Nationality})<br>Year: ${d.Year}, Time: ${timeFormatter(
              d.Time
            )}<br>${d.Doping ? d.Doping : "No doping"}`
          );
      })
      .on("mouseout", () => {
        d3.select("#tooltip").style("opacity", 0);
      });
  })
  .catch((error) => console.error("Error loading data:", error));

