function initialize() {

    function generateRandomLat() {
        var num = (Math.random() * 180 - 90).toFixed(6);
        return parseFloat(num);
    }

    function generateRandomLong() {
        var num = (Math.random() * 360 - 180).toFixed(6);
        return parseFloat(num);
    }

    const randomLat = generateRandomLat();
    const randomLng = generateRandomLong();
    const randomLocation = { lat: randomLat, lng: randomLng };

    const map = new google.maps.Map(document.getElementById("map"), {
        center: randomLocation,
        zoom: 10,
    });

    const marker = new google.maps.Marker({
        position: randomLocation,
        map: map
    });

    marker.addListener('click', () => {
        map.setCenter(randomLocation);
    });

    const panorama = new google.maps.StreetViewPanorama(
        document.getElementById("pano"),
        {
            disableDefaultUI: true,
            addressControl: false,
                    linksControl: false,
            showRoadLabels: true,
            map: map,
            // position: randomLocation,
            position: randomLocation,
            pitch: 10,
        }
    );

    map.setStreetView(panorama);
}

window.initialize = initialize;
