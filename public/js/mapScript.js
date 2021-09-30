mapboxgl.accessToken = 'pk.eyJ1IjoicHJnMjMwOCIsImEiOiJja3U2dHh5NGwzMWdqMnZxaGs3eGU2MWplIn0.ZNrycoStLr6VIiACqNV0gw';
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/outdoors-v11',
    center: campground.geometry.coordinates,
    zoom: 12
});

const marker1 = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${campground.title}</h3><p>${campground.location}</p>`
            )
    )
    .addTo(map);
