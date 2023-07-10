import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import OpacityControl from 'maplibre-gl-opacity';
import 'maplibre-gl-opacity/dist/maplibre-gl-opacity.css';

const map = new maplibregl.Map({
  container: 'map',
  zoom: 5,
  center: [138, 37],
  minZoom: 5,
  maxZoom: 18,
  maxBounds: [122, 20, 154, 50],
  style: {
    version: 8,
    sources: {
      // background
      osm: {
        type: 'raster',
        tiles: ['http://tile.openstreetmap.org/{z}/{x}/{y}.png'],
        maxzoom: 19,
        tileSize: 256,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
      // flood
      hazard_flood: {
        type: 'raster',
        tiles: [
          'https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png',
        ],
        minzoom: 2,
        maxzoom: 17,
        tileSize: 256,
        attribution:
          '<a helf="https://disaportal.gsi.go.jp/hazardmapportal/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>'
      },
      // storm surge
      hazard_storm_surge: {
        type: 'raster',
        tiles: [
          'https://disaportaldata.gsi.go.jp/raster/03_hightide_l2_shinsuishin_data/{z}/{x}/{y}.png',
        ],
        minzoom: 2,
        maxzoom: 17,
        tileSize: 256,
        attribution:
          '<a helf="https://disaportal.gsi.go.jp/hazardmapportal/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>'
      },
      // tsunami
      hazard_tsunami: {
        type: 'raster',
        tiles: [
          'https://disaportaldata.gsi.go.jp/raster/04_tsunami_newlegend_data/{z}/{x}/{y}.png',
        ],
        minzoom: 2,
        maxzoom: 17,
        tileSize: 256,
        attribution:
          '<a helf="https://disaportal.gsi.go.jp/hazardmapportal/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>'
      },
      // debris flow
      hazard_debris_flow: {
        type: 'raster',
        tiles: [
          'https://disaportaldata.gsi.go.jp/raster/05_dosekiryukeikaikuiki/{z}/{x}/{y}.png',
        ],
        minzoom: 2,
        maxzoom: 17,
        tileSize: 256,
        attribution:
          '<a helf="https://disaportal.gsi.go.jp/hazardmapportal/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>'
      },
      // steep slope
      hazard_steep_slope: {
        type: 'raster',
        tiles: [
          '	https://disaportaldata.gsi.go.jp/raster/05_kyukeishakeikaikuiki/{z}/{x}/{y}.png',
        ],
        minzoom: 2,
        maxzoom: 17,
        tileSize: 256,
        attribution:
          '<a helf="https://disaportal.gsi.go.jp/hazardmapportal/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>'
      },
      // landslide
      hazard_landslide: {
        type: 'raster',
        tiles: [
          'https://disaportaldata.gsi.go.jp/raster/05_jisuberikeikaikuiki/{z}/{x}/{y}.png',
        ],
        minzoom: 2,
        maxzoom: 17,
        tileSize: 256,
        attribution:
          '<a helf="https://disaportal.gsi.go.jp/hazardmapportal/hazardmap/copyright/opendata.html">ハザードマップポータルサイト</a>'
      },
    },
    layers: [
      // background map
      {
        id: 'osm-layer',
        source: 'osm',
        type: 'raster',
      },
      // layer map
      {
        id: 'hazard_flood_layer',
        source: 'hazard_flood',
        type: 'raster',
        paint: {'raster-opacity': 0.7},
        layout: {visibility: 'none'},
      },
      {
        id: 'hazard_storm_layer',
        source: 'hazard_storm_surge',
        type: 'raster',
        paint: {'raster-opacity': 0.7},
        layout: {visibility: 'none'},
      },
      {
        id: 'hazard_tsunami_layer',
        source: 'hazard_tsunami',
        type: 'raster',
        paint: {'raster-opacity': 0.7},
        layout: {visibility: 'none'},
      },
      {
        id: 'hazard_debris_flow_layer',
        source: 'hazard_debris_flow',
        type: 'raster',
        paint: {'raster-opacity': 0.7},
        layout: {visibility: 'none'},
      },
      {
        id: 'hazard_steep_slope_layer',
        source: 'hazard_steep_slope',
        type: 'raster',
        paint: {'raster-opacity': 0.7},
        layout: {visibility: 'none'},
      },
      {
        id: 'hazard_landslide_layer',
        source: 'hazard_landslide',
        type: 'raster',
        paint: {'raster-opacity': 0.7},
        layout: {visibility: 'none'},
      },
    ]
  }
});

map.on('load', () => {
  const opacity = new OpacityControl({
    baseLayers: {
      'hazard_flood_layer': '洪水浸水想定区域',
      'hazard_storm_layer': '高潮浸水想定区域',
      'hazard_tsunami_layer': '津波浸水想定区域',
      'hazard_debris_flow_layer': '土石流警戒区域',
      'hazard_steep_slope_layer': '急斜面警戒区域',
      'hazard_landslide_layer': '地滑り警戒区域',
    },
  });
  map.addControl(opacity, 'top-left');
});
