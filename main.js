import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import OpacityControl from 'maplibre-gl-opacity';
import 'maplibre-gl-opacity/dist/maplibre-gl-opacity.css';
import distance from '@turf/distance';

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
      // shelter
      shelter: {
        type: 'vector',
        tiles: [
          `${location.href.replace('index.html', '')}/shelter/{z}/{x}/{y}.pbf`,
        ],
        minzoom: 5,
        maxzoom: 8,
        attribution: 
          `<a helf="https://www.gsi.go.jp/bousaichiri/hinanbasho.html" target="_blank">国土地理院:指定緊急避難場所データ</a>`,
      },
      // route
      route: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        }
      }
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
      // shelter_layer
      {
        id: 'shelter_flood_layer',
        source: 'shelter',
        'source-layer': 'shelter',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            2,
            14,
            6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'flood'],
        layout: {visibility: 'none'},
      },
      {
        id: 'shelter_landslide_layer',
        source: 'shelter',
        'source-layer': 'shelter',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            2,
            14,
            6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'landslide'],
        layout: {visibility: 'none'},
      },
      {
        id: 'shelter_storm_layer',
        source: 'shelter',
        'source-layer': 'shelter',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            2,
            14,
            6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'storm'],
        layout: {visibility: 'none'},
      },
      {
        id: 'shelter_earthquake_layer',
        source: 'shelter',
        'source-layer': 'shelter',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            2,
            14,
            6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'earthquake'],
        layout: {visibility: 'none'},
      },
      {
        id: 'shelter_tsunami_layer',
        source: 'shelter',
        'source-layer': 'shelter',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            2,
            14,
            6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'tsunami'],
        layout: {visibility: 'none'},
      },
      {
        id: 'shelter_fire_layer',
        source: 'shelter',
        'source-layer': 'shelter',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            2,
            14,
            6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'fire'],
        layout: {visibility: 'none'},
      },
      {
        id: 'shelter_inland_flood_layer',
        source: 'shelter',
        'source-layer': 'shelter',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            2,
            14,
            6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'inland_flood'],
        layout: {visibility: 'none'},
      },
      {
        id: 'shelter_volcano_layer',
        source: 'shelter',
        'source-layer': 'shelter',
        type: 'circle',
        paint: {
          'circle-color': '#6666cc',
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            5,
            2,
            14,
            6,
          ],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#ffffff',
        },
        filter: ['get', 'volcano'],
        layout: {visibility: 'none'},
      },
      // line between current location and nearest shelter
      {
        id: 'route-layer',
        source: 'route',
        type: 'line',
        paint: {
          'line-color': '#33aaff',
          'line-width': 4,
        },
      },
    ]
  }
});

map.on('load', () => {
  // layer
  const opacityLayer = new OpacityControl({
    baseLayers: {
      'hazard_flood_layer': '洪水浸水想定区域',
      'hazard_storm_layer': '高潮浸水想定区域',
      'hazard_tsunami_layer': '津波浸水想定区域',
      'hazard_debris_flow_layer': '土石流警戒区域',
      'hazard_steep_slope_layer': '急斜面警戒区域',
      'hazard_landslide_layer': '地滑り警戒区域',
    },
  });
  // shelter
  map.addControl(opacityLayer, 'top-left');
  const opacityEvacuationSite = new OpacityControl({
    baseLayers: {
      'shelter_flood_layer': '洪水',
      'shelter_landslide_layer': '崖崩れ、土石流及び地滑り',
      'shelter_storm_layer': '高潮',
      'shelter_earthquake_layer': '地震',
      'shelter_tsunami_layer': '津波',
      'shelter_fire_layer': '大規模な火事',
      'shelter_inland_flood_layer': '内水氾濫',
      'shelter_volcano_layer': '火山現象',
    },
  });
  map.addControl(opacityEvacuationSite, 'top-right');

  map.on('mousemove', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [
        'shelter_flood_layer',
        'shelter_landslide_layer',
        'shelter_storm_layer',
        'shelter_earthquake_layer',
        'shelter_tsunami_layer',
        'shelter_fire_layer',
        'shelter_inland_flood_layer',
        'shelter_volcano_layer',
      ]
    });

    if(features.length > 0) {
      map.getCanvas().style.cursor = 'pointer';
    } else {
      map.getCanvas().style.cursor = '';
    }
  })

  map.on('click', (e) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [
        'shelter_flood_layer',
        'shelter_landslide_layer',
        'shelter_storm_layer',
        'shelter_earthquake_layer',
        'shelter_tsunami_layer',
        'shelter_fire_layer',
        'shelter_inland_flood_layer',
        'shelter_volcano_layer',
      ]
    });

    if (features.length === 0) return;

    const feature = features[0];
    const popup = new maplibregl.Popup()
      .setLngLat(feature.geometry.coordinates)
      .setHTML(
        `\
        <div style="font-weight:900; font-size: 1rem;">
          ${feature.properties.name}
        </div>\
        <div>
          ${feature.properties.address}
        </div>\
        <div>
          ${feature.properties.memo ?? ''}
        </div>\
        <div>\
          <span ${feature.properties.flood ? '' : 'style="color:#ccc"'}>
            洪水
          </span>
          <span ${feature.properties.landslide ? '' : 'style="color:#ccc"'}>
            崖崩れ、土石流及び地滑り
          </span>
          <span ${feature.properties.storm ? '' : 'style="color:#ccc"'}>
            高潮
          </span>
          <span ${feature.properties.earthquake ? '' : 'style="color:#ccc"'}>
            地震
          </span>
          <span ${feature.properties.tsunami ? '' : 'style="color:#ccc"'}>
            津波
          </span>
          <span ${feature.properties.fire ? '' : 'style="color:#ccc"'}>
            大規模な火事
          </span>
          <span ${feature.properties.inland_flood ? '' : 'style="color:#ccc"'}>
            内水氾濫
          </span>
          <span ${feature.properties.volcano ? '' : 'style="color:#ccc"'}>
            火山
          </span>
        </div>
        `,
      )
      .addTo(map);
  });

  // current location
  let userLocation = null;
  const geolocationControl = new maplibregl.GeolocateControl({
    trackUserLocation: true,
  });
  map.addControl(geolocationControl, 'bottom-right');
  geolocationControl.on('geolocate', (e) => {
    userLocation = [e.coords.longitude, e.coords.latitude];
  });

  // current layer
  const getCurrentShelterLayerFilter = () => {
    const style = map.getStyle();
    const shelterLayers = style.layers.filter((layer) =>
      layer.id.startsWith('shelter'),
    );
    const visibleShelterLayers = shelterLayers.filter(
      (layer) => layer.layout.visibility === 'visible',
    );
    return visibleShelterLayers[0].filter;
  }

  // nearest shelter
  const getNearestShelter = (longitude, latitude) => {
    const currentShelterLayerFilter = getCurrentShelterLayerFilter();
    const shelters = map.querySourceFeatures('shelter', {
      sourceLayer: 'shelter',
      filter: currentShelterLayerFilter,
    })

    const nearestShelter = shelters.reduce((minDistShelter, shelter) => {
      const dist = distance(
        [longitude, latitude],
        shelter.geometry.coordinates,
      );
      if (minDistShelter === null || minDistShelter.properties.dist > dist)
        return {
          ...shelter,
          properties: {
            ...shelter.properties,
            dist,
          },
        };
      return  minDistShelter;
    }, null);

    return nearestShelter;
  };

  map.on('render', () => {
    // if geolocationControl is OFF delete current location
    if (geolocationControl._watchState === 'OFF') userLocation = null;

    if (map.getZoom() < 7 || userLocation === null) return;

    const nearestShelter = getNearestShelter(userLocation[0], userLocation[1]);

    const routeShelter = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          userLocation, nearestShelter._geometry.coordinates
        ],
      },
    };

    map.getSource('route').setData({
      type: 'FeatureCollection',
      features: [routeShelter],
    });
  });
});
