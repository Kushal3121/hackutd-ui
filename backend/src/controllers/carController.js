import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/cars.json');

// Utility function to load cars
const loadCars = () => {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
};

// Get all cars
export const getAllCars = (req, res) => {
  try {
    const cars = loadCars();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load cars data' });
  }
};

// Get car by ID
export const getCarById = (req, res) => {
  try {
    const cars = loadCars();
    const car = cars.find((c) => c.id === req.params.id);
    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching car' });
  }
};

// Filter by region or year (optional)
export const filterCars = (req, res) => {
  try {
    const { region, year } = req.query;
    let cars = loadCars();
    if (region) cars = cars.filter((c) => c.region === region);
    if (year) cars = cars.filter((c) => c.year === parseInt(year));
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Error filtering cars' });
  }
};
