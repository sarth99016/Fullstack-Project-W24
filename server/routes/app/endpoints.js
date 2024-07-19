// Ashita - c0885078
// Divya - c0883916
// Sarthak - c0883191
// Reuben - c0886437
// Dheepasri - c0886900
// Defines the API endpoints used by the protected pages

const {logger} = require("../../logging");
const {Car} = require("../../db/schemaDef");


exports.addCarEndpoint = function (req, res) {

    let imgPath = "uploads/carImg-default.png"
    if (req.file && req.file.path) {
        imgPath = req.file.path.slice(7).replace('\\', '/')
    }

    const {make, model, year, price, color, vin, fuelType, transmission, mileage, engineType, status} = req.body;

    const newCar = new Car({
        make, model, year, price, color, vin, fuelType, transmission, mileage, engineType, status, imgPath
    });

    newCar.save().then(() => {
        logger.info('New car added successfully');
        res.redirect("/app/manage");
    }).catch((error) => {
        logger.error(`Error adding new car: ${error.message}`);
        res.status(500).send("Internal Server Error");
    })
};


exports.deleteCarEndpoint = function (req, res) {
    const selectedCarIds = req.body.selectedCars;

    // Delete selected cars from the database
    Car.deleteMany({_id: {$in: selectedCarIds}})
        .then(() => {
            logger.info('Deleted selected cars');
            res.redirect("/app/manage"); // Redirect to manage page after deleting cars
        })
        .catch((err) => {
            logger.error(`Error deleting cars:', ${err.message}`);
            res.status(500).send("Internal Server Error");
        });
};


exports.updateCarEndpoint = function (req, res) {

    let imgPath = "uploads/carImg-default.png"
    if (req.file && req.file.path) {
        imgPath = req.file.path.slice(7).replace('\\', '/')
    }

    const {_id, make, model, year, price, color, vin, fuelType, transmission, mileage, engineType} = req.body;
    Car.findByIdAndUpdate(
        _id, // Car ID
        {
            make: make,
            model: model,
            year: year,
            price: price,
            color: color,
            vin: vin,
            fuelType: fuelType,
            transmission: transmission,
            mileage: mileage,
            engineType: engineType,
            imgPath: imgPath
        }, // New values to update
        {new: true} // Return the updated document
    ).then((carToUpdate) => {
        if (!carToUpdate) {
            logger.info(`Car ${carToUpdate._id} not found`);
            return res.status(404).send('Car not found');
        }
        logger.info(`Car ${carToUpdate._id} updated successfully`);
        res.redirect("/app/display")

    }).catch((error) => {
        logger.error(`Error updating car: ${error.message}`);
        res.status(500).send('Internal Server Error');
    })
};