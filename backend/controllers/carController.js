const Car = require('../models/Car');

// Add a new car
const addCar = async (req, res) => {
    const { carId, name, model, imageUrl, passengers, fuelEfficiency, availability } = req.body;

    try {
        const newCar = new Car({ carId, name, model, imageUrl, passengers, fuelEfficiency, availability });
        await newCar.save();
        res.status(201).json({ message: 'Car added successfully', car: newCar });
    } catch (error) {
        res.status(500).json({ message: 'Error adding car', error });
    }
};

// Fetch all cars
const getCars = async (req, res) => {
    try {
        const cars = await Car.find();
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars', error });
    }
};

// Update a car
const updateCar = async (req, res) => {
    const { id } = req.params;
    const { name, model, imageUrl, passengers, fuelEfficiency, availability } = req.body;

    try {
        const updatedCar = await Car.findByIdAndUpdate(
            id,
            { name, model, imageUrl, passengers, fuelEfficiency, availability },
            { new: true }
        );
        res.status(200).json({ message: 'Car updated successfully', car: updatedCar });
    } catch (error) {
        res.status(500).json({ message: 'Error updating car', error });
    }
};

// Delete a car
const deleteCar = async (req, res) => {
    const { id } = req.params;

    try {
        await Car.findByIdAndDelete(id);
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting car', error });
    }
};

module.exports = { addCar, getCars, updateCar, deleteCar };