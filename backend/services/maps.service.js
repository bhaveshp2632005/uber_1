import axios from 'axios';
import captainModel from '../models/captain.model.js';


import dotenv from 'dotenv';

dotenv.config();

/**
 * 🗺️ Get coordinates (lat, lng) from address using OpenCage API
 */
export const getAddressCoordinate = async (address) => {
  try {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${process.env.OPENCAGE_KEY}&limit=1`;
    console.log('Requesting:', url);

    const response = await axios.get(url);

    if (response.data.results.length > 0) {
      const location = response.data.results[0].geometry;
      return {
        lat: location.lat,   // ✅ FIXED — use "lat"
        lng: location.lng,
      };
    } else {
      throw new Error('No coordinates found');
    }
  } catch (err) {
    console.error('Error fetching coordinates:', err.message);
    throw err;
  }
};


/**
 * 🚗 Get distance and time between two addresses using OSRM API
 */
export const getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }

  try {
    // ✅ Convert address strings into coordinates
    const originCoords = await getAddressCoordinate(origin);
    const destinationCoords = await getAddressCoordinate(destination);

    const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lng},${originCoords.lat};${destinationCoords.lng},${destinationCoords.lat}?overview=false`;
    console.log('OSRM Request:', url);

    const response = await axios.get(url);

    if (response.data.code === 'Ok' && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      const distanceKm = (route.distance / 1000).toFixed(2); // meters → km
      const durationHours = (route.duration / 3600).toFixed(2); // seconds → hours
      const durationMinutes = Math.round(route.duration / 60); // seconds → minutes (optional)

      return {
distance_km: distanceKm,
        duration_hours: durationHours,
        duration_minutes: durationMinutes
 // seconds
      };
    } else {
      throw new Error('Unable to fetch distance and time');
    }
  } catch (err) {
    console.error('Error fetching distance/time:', err.message);
    throw err;
  }
};

/**
 * 🔍 Get address suggestions (Autocomplete) using Photon API (based on OSM)
 */
export const getAutoCompleteSuggestions = async (input) => {
  if (!input) throw new Error('query is required');

  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&limit=10`;
    const response = await axios.get(url);

    if (response.data.features && response.data.features.length > 0) {
      // Extract names + context info for better quality suggestions
      const rawSuggestions = response.data.features.map(item => {
        const name = item.properties.name;
        const city = item.properties.city || item.properties.state || '';
        const country = item.properties.country || '';
        return name
          ? `${name}${city ? ', ' + city : ''}${country ? ', ' + country : ''}`
          : null;
      });

      // Remove nulls, duplicates, and capitalize properly
      const cleanSuggestions = [...new Set(rawSuggestions.filter(Boolean))].map(s => {
        return s
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      });

      return cleanSuggestions;
    } else {
      throw new Error('No suggestions found');
    }
  } catch (err) {
    console.error('Error fetching autocomplete:', err.message);
    throw err;
  }
};

/**
 * 🧭 Find captains within a radius (MongoDB geospatial query)
 */
export const getCaptainsInTheRadius = async (lat, lng, radiusInMeters) => {
  try {
    // radius must be in radians (divide by Earth's radius)
    const radiusInRadians = 200000 / 6371000;

    const captains = await captainModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[lng, lat], radiusInRadians],
        },
      },
      // status: "active", // only active captains
    });

    return captains;
  } catch (err) {
    console.error("❌ Error fetching captains in radius:", err.message);
    return [];
  }
};

/**
 * ✅ Export all as named + default (for flexibility)
 */
const mapsService = {
  getAddressCoordinate,
  getDistanceTime,
  getAutoCompleteSuggestions,
  getCaptainsInTheRadius,
};

export default mapsService;
