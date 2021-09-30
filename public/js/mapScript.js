mapboxgl.accessToken = 'pk.eyJ1IjoicHJnMjMwOCIsImEiOiJja3U2dHh5NGwzMWdqMnZxaGs3eGU2MWplIn0.ZNrycoStLr6VIiACqNV0gw';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates,
    zoom: 12
});

const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .addTo(map);