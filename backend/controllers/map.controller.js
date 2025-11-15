import { validationResult } from 'express-validator';
import * as mapService from '../services/maps.service.js';

// ✅ 1️⃣ Get Coordinates from Address
export const getCoordinates = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { address } = req.query;

  try {
    console.log('Fetching coordinates for address:', address);
    const coordinates = await mapService.getAddressCoordinate(address);

    if (!coordinates) {
      return res.status(404).json({ message: 'Coordinates not found' });
    }

    res.status(200).json(coordinates);
  } catch (error) {
    console.error('Error fetching coordinates:', error.message);
    res.status(404).json({ message: 'Coordinates not found' });
  }
};

// ✅ 2️⃣ Get Distance & Time Between Two Locations
export const getDistanceTime = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;

    const distanceTime = await mapService.getDistanceTime(origin, destination);

    if (!distanceTime) {
      return res.status(404).json({ message: 'Distance/Time not found' });
    }

    res.status(200).json(distanceTime);
  } catch (err) {
    console.error('Error fetching distance/time:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ✅ 3️⃣ Get Autocomplete Suggestions
export const getAutoCompleteSuggestions = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;
    const suggestions = await mapService.getAutoCompleteSuggestions(input);

    if (!suggestions || suggestions.length === 0) {
      return res.status(404).json({ message: 'No suggestions found' });
    }

    res.status(200).json(suggestions);
  } catch (err) {
    console.error('Error fetching suggestions:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
