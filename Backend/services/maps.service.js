const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.MAPBOX_ACCESS_TOKEN;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.features && response.data.features.length > 0) {
            const location = response.data.features[0].center;
            return {
                lng: location[0],
                lat: location[1]
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.MAPBOX_ACCESS_TOKEN;

    try {
        // First, get coordinates for origin and destination
        const originCoords = await module.exports.getAddressCoordinate(origin);
        const destCoords = await module.exports.getAddressCoordinate(destination);

        // Use Mapbox Directions API
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${originCoords.lng},${originCoords.lat};${destCoords.lng},${destCoords.lat}?access_token=${apiKey}`;

        const response = await axios.get(url);
        
        if (response.data.routes && response.data.routes.length > 0) {
            const route = response.data.routes[0];
            return {
                distance: {
                    text: `${(route.distance / 1000).toFixed(1)} km`,
                    value: route.distance
                },
                duration: {
                    text: `${Math.round(route.duration / 60)} mins`,
                    value: route.duration
                }
            };
        } else {
            throw new Error('No routes found');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.MAPBOX_ACCESS_TOKEN;
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json?access_token=${apiKey}&autocomplete=true&limit=5`;

    try {
        const response = await axios.get(url);
        if (response.data.features) {
            return response.data.features.map(feature => feature.place_name).filter(value => value);
        } else {
            throw new Error('Unable to fetch suggestions');
        }
    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getCaptainsInTheRadius = async (lat, lng, radius, vehicleType) => {

    // radius in km
    // MongoDB GeoJSON expects [longitude, latitude] order

    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ lng, lat ], radius / 6371 ]
            }
        },
        status: 'active',
        'vehicle.vehicleType': vehicleType
    });

    return captains;


}