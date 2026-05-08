import User from "../models/User.js";
import Vehicle from "../models/Vehicle.js";

const demoUser = {
  name: process.env.DEMO_USER_NAME || "Usuario Demo",
  email: process.env.DEMO_USER_EMAIL || "demo@vehiclevault.dev",
  password: process.env.DEMO_USER_PASSWORD || "Demo1234"
};

const demoVehicles = [
  {
    brand: "Toyota",
    model: "Corolla",
    year: 2021,
    plate: "DEMO-01",
    category: "car",
    status: "available",
    mileage: 38200,
    notes: "Vehiculo demo disponible para pruebas"
  },
  {
    brand: "Ford",
    model: "Ranger",
    year: 2020,
    plate: "DEMO-02",
    category: "truck",
    status: "maintenance",
    mileage: 74100,
    notes: "Unidad demo en mantencion preventiva"
  }
];

export async function seedDemoUser() {
  if (process.env.SEED_DEMO_USER === "false") return;

  let user = await User.findOne({ email: demoUser.email });

  if (!user) {
    user = await User.create(demoUser);
    console.log(`Demo user created: ${demoUser.email} / ${demoUser.password}`);
  }

  const vehicleCount = await Vehicle.countDocuments({ owner: user._id });

  if (vehicleCount === 0) {
    await Vehicle.create(
      demoVehicles.map((vehicle) => ({
        ...vehicle,
        owner: user._id
      }))
    );
    console.log("Demo vehicles created");
  }
}
