import React, { useState, useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'

const center = {
    latitude: -3.745,
    longitude: -38.523
};

const LiveTracking = ({ pickup, destination }) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const marker = useRef(null);
    const pickupMarker = useRef(null);
    const destinationMarker = useRef(null);
    const [ currentPosition, setCurrentPosition ] = useState(center);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        if (map.current) return;
        if (!mapContainer.current) return;

        const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
        
        if (!token) {
            setError('Mapbox token is missing');
            console.error('VITE_MAPBOX_ACCESS_TOKEN is not defined');
            return;
        }

        console.log('Mapbox token:', token ? 'Token present' : 'No token');
        
        // Check if token is a secret token (not allowed for client-side)
        if (token.startsWith('sk.')) {
            console.warn('Secret token detected. Using OpenStreetMap style instead.');
        }

        try {
            // Use OpenStreetMap style if we have a secret token or no token
            const useOSM = !token || token.startsWith('sk.');
            
            if (!useOSM) {
                mapboxgl.accessToken = token;
            }

            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: useOSM 
                    ? {
                        version: 8,
                        sources: {
                            'osm-tiles': {
                                type: 'raster',
                                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                                tileSize: 256,
                                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            }
                        },
                        layers: [{
                            id: 'osm-tiles',
                            type: 'raster',
                            source: 'osm-tiles',
                            minzoom: 0,
                            maxzoom: 19
                        }]
                    }
                    : 'mapbox://styles/mapbox/streets-v12',
                center: [currentPosition.longitude, currentPosition.latitude],
                zoom: 15
            });

            map.current.on('load', () => {
                console.log('Map loaded successfully');
            });

            map.current.on('error', (e) => {
                console.error('Map error:', e);
                setError('Failed to load map: ' + e.error.message);
            });

            marker.current = new mapboxgl.Marker({ color: 'red' })
                .setLngLat([currentPosition.longitude, currentPosition.latitude])
                .addTo(map.current);
        } catch (err) {
            console.error('Error initializing map:', err);
            setError('Error initializing map: ' + err.message);
        }
    }, []);

    useEffect(() => {
        const updatePosition = (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({
                latitude,
                longitude
            });
        };

        navigator.geolocation.getCurrentPosition(updatePosition);

        const watchId = navigator.geolocation.watchPosition(updatePosition);

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        if (map.current && marker.current) {
            marker.current.setLngLat([currentPosition.longitude, currentPosition.latitude]);
            map.current.flyTo({
                center: [currentPosition.longitude, currentPosition.latitude],
                essential: true
            });
        }
    }, [currentPosition]);

    // Draw route when pickup and destination are provided
    useEffect(() => {
        if (!map.current || !pickup || !destination) return;

        const drawRoute = async () => {
            const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
            if (!token || token.startsWith('sk.')) {
                console.warn('Cannot draw route: Valid public Mapbox token required');
                return;
            }

            try {
                // Get coordinates for pickup and destination
                const baseUrl = import.meta.env.VITE_BASE_URL;

                // Get coordinates from backend
                const pickupRes = await axios.get(`${baseUrl}/maps/get-coordinates`, {
                    params: { address: pickup },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                const destRes = await axios.get(`${baseUrl}/maps/get-coordinates`, {
                    params: { address: destination },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });

                const pickupCoords = pickupRes.data;
                const destCoords = destRes.data;

                // Get route from Mapbox Directions API
                const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords.lng},${pickupCoords.lat};${destCoords.lng},${destCoords.lat}?geometries=geojson&access_token=${token}`;
                
                const routeRes = await axios.get(directionsUrl);
                if (!routeRes.data || !routeRes.data.routes || routeRes.data.routes.length === 0) {
                    console.error('No routes found');
                    return;
                }
                const route = routeRes.data.routes[0].geometry;

                // Remove existing route if any
                if (map.current.getSource('route')) {
                    map.current.removeLayer('route');
                    map.current.removeSource('route');
                }

                // Add route to map
                map.current.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: route
                    }
                });

                map.current.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#3b82f6',
                        'line-width': 5,
                        'line-opacity': 0.75
                    }
                });

                // Add pickup marker
                if (pickupMarker.current) pickupMarker.current.remove();
                pickupMarker.current = new mapboxgl.Marker({ color: 'green' })
                    .setLngLat([pickupCoords.lng, pickupCoords.lat])
                    .addTo(map.current);

                // Add destination marker
                if (destinationMarker.current) destinationMarker.current.remove();
                destinationMarker.current = new mapboxgl.Marker({ color: 'red' })
                    .setLngLat([destCoords.lng, destCoords.lat])
                    .addTo(map.current);

                // Fit map to show entire route
                const bounds = new mapboxgl.LngLatBounds();
                route.coordinates.forEach(coord => bounds.extend(coord));
                map.current.fitBounds(bounds, { padding: 50 });

            } catch (err) {
                console.error('Error drawing route:', err);
            }
        };

        // Wait for map to load before drawing route
        if (map.current.loaded()) {
            drawRoute();
        } else {
            map.current.on('load', drawRoute);
        }
    }, [pickup, destination]);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {error && (
                <div style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    zIndex: 1000,
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <p style={{ color: 'red', fontWeight: 'bold' }}>Map Error:</p>
                    <p>{error}</p>
                    <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                        Note: You need a public token (pk.*) not a secret token (sk.*)
                    </p>
                </div>
            )}
            <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>
    )
}

export default LiveTracking