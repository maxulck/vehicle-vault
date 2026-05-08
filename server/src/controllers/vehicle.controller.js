import Vehicle from "../models/Vehicle.js";

export async function listVehicles(req, res, next) {
  try {
    const { search = "", status } = req.query;
    const query = { owner: req.user._id };

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { brand: new RegExp(search, "i") },
        { model: new RegExp(search, "i") },
        { plate: new RegExp(search, "i") }
      ];
    }

    const vehicles = await Vehicle.find(query).sort({ createdAt: -1 });
    res.json({ vehicles });
  } catch (error) {
    next(error);
  }
}

export async function createVehicle(req, res, next) {
  try {
    const vehicle = await Vehicle.create({
      ...req.body,
      owner: req.user._id
    });

    res.status(201).json({ vehicle });
  } catch (error) {
    next(error);
  }
}

export async function updateVehicle(req, res, next) {
  try {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json({ vehicle });
  } catch (error) {
    next(error);
  }
}

export async function deleteVehicle(req, res, next) {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
