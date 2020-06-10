// We get and prepare the Mustache template, parsing it speeds up future uses
var template = d3.select('#template').html();
Mustache.parse(template);

/**
 * Show the details of a feature in the details <div> container.
 * The content is rendered with a Mustache template.
 *
 * @param {object} f - A GeoJSON Feature object.
 */
function showDetails(f) {
  // Get the ID of the feature.
  var id = getIdOfFeature(f);
  // Use the ID to get the data entry.
  var d = dataById[id];

  // Render the Mustache template with the data object and put the
  // resulting HTML output in the details container.
  var detailsHtml = Mustache.render(template, d);

  // Hide the initial container.
  d3.select('#initial').classed("hidden", true);

  // Put the HTML output in the details container and show (unhide) it.
  d3.select('#details').html(detailsHtml);
  d3.select('#details').classed("hidden", false);
}


// We get and prepare the Mustache template, parsing it speeds up future uses
var ltc = d3.select('#ltc-table').html();
Mustache.parse(ltc);


function showLTC(f) {
  // Render the Mustache template with the data object and put the
  // resulting HTML output in the details container.
  console.log(f)
  var detailsHtml = Mustache.render(ltc, f);

  // Hide the initial container.
  d3.select('#initial').classed("hidden", true);

  // Put the HTML output in the details container and show (unhide) it.
  d3.select('#details').html(detailsHtml);
  d3.select('#details').classed("hidden", false);
}
