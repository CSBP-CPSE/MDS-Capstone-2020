import { feature } from 'topojson';
import { tsv, json } from 'd3';
export const loadAndProcessData = () => 
  Promise
    .all([
      tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
      json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
    ])
    .then(([tsvData, topoJSONdata]) => {
      const rowById = tsvData.reduce((accumulator, d) => {
        accumulator[d.iso_n3] = d;
        return accumulator;
      }, {});

      const countries = feature(topoJSONdata, topoJSONdata.objects.countries);

      countries.features.forEach(d => {
        Object.assign(d.properties, rowById[d.id]);
      });

      return countries;
    });