import {
  CarFront,
  CheckCircle2,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Wrench
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";

const emptyVehicle = {
  brand: "",
  model: "",
  year: 2026,
  plate: "",
  category: "car",
  status: "available",
  mileage: "",
  notes: ""
};

const MAX_YEAR = 2026;

function cleanText(value) {
  return value.replace(/[^a-zA-Z0-9ÁÉÍÓÚÜÑáéíóúüñ ]/g, "");
}

function cleanPlate(value) {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

function getYearOptions() {
  return Array.from({ length: MAX_YEAR - 1900 + 1 }, (_item, index) => MAX_YEAR - index);
}

const statusLabels = {
  available: "Disponible",
  maintenance: "Mantencion",
  sold: "Vendido",
  reserved: "Reservado"
};

const categoryLabels = {
  car: "Auto",
  motorcycle: "Moto",
  truck: "Camion",
  van: "Van",
  other: "Otro"
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [vehicles, setVehicles] = useState([]);
  const [vehicleForm, setVehicleForm] = useState(emptyVehicle);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("vehicle_vault_token");
    if (!token) return;

    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => localStorage.removeItem("vehicle_vault_token"));
  }, []);

  useEffect(() => {
    if (!user) return;
    loadVehicles();
  }, [user, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: vehicles.length,
      available: vehicles.filter((vehicle) => vehicle.status === "available").length,
      maintenance: vehicles.filter((vehicle) => vehicle.status === "maintenance").length
    };
  }, [vehicles]);

  async function loadVehicles() {
    try {
      const { vehicles } = await api.listVehicles({ search, status: statusFilter });
      setVehicles(vehicles);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const action = authMode === "login" ? api.login : api.register;
      const payload =
        authMode === "login"
          ? { email: authForm.email, password: authForm.password }
          : authForm;
      const { user, token } = await action(payload);
      localStorage.setItem("vehicle_vault_token", token);
      setUser(user);
      setAuthForm({ name: "", email: "", password: "" });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVehicleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...vehicleForm,
        mileage: vehicleForm.mileage === "" ? undefined : Number(vehicleForm.mileage)
      };

      if (editingId) {
        await api.updateVehicle(editingId, payload);
        setMessage("Vehiculo actualizado");
      } else {
        await api.createVehicle(payload);
        setMessage("Vehiculo agregado");
      }

      setVehicleForm(emptyVehicle);
      setEditingId(null);
      await loadVehicles();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function startEdit(vehicle) {
    setEditingId(vehicle._id);
    setVehicleForm({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      plate: vehicle.plate,
      category: vehicle.category,
      status: vehicle.status,
      mileage: vehicle.mileage || "",
      notes: vehicle.notes || ""
    });
  }

  async function removeVehicle(id) {
    try {
      await api.deleteVehicle(id);
      await loadVehicles();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    localStorage.removeItem("vehicle_vault_token");
    setUser(null);
    setVehicles([]);
  }

  if (!user) {
    return (
      <main className="auth-shell">
        <section className="auth-panel">
          <div>
            <div className="brand-mark">
              <CarFront size={30} />
            </div>
            <h1>Vehicle Vault</h1>
            <p>
              Gestiona inventario de vehiculos con cuentas seguras, API privada y datos en MongoDB.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="auth-form">
            <div className="mode-switch" aria-label="Modo de autenticacion">
              <button
                type="button"
                className={authMode === "login" ? "active" : ""}
                onClick={() => setAuthMode("login")}
              >
                Iniciar sesion
              </button>
              <button
                type="button"
                className={authMode === "register" ? "active" : ""}
                onClick={() => setAuthMode("register")}
              >
                Crear cuenta
              </button>
            </div>

            {authMode === "register" && (
              <label>
                Nombre
                <input
                  value={authForm.name}
                  onChange={(event) => setAuthForm({ ...authForm, name: cleanText(event.target.value) })}
                  minLength="2"
                  required
                />
              </label>
            )}

            <label>
              Email
              <input
                type="email"
                value={authForm.email}
                onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })}
                required
              />
            </label>

            <label>
              Contrasena
              <input
                type="password"
                value={authForm.password}
                onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })}
                minLength="6"
                required
              />
            </label>

            {message && <p className="message">{message}</p>}

            <button className="primary-button" disabled={loading}>
              <ShieldCheck size={18} />
              {loading ? "Procesando..." : authMode === "login" ? "Entrar" : "Registrarme"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <span className="eyebrow">Inventario privado</span>
          <h1>Vehicle Vault</h1>
        </div>
        <div className="user-actions">
          <span>{user.name}</span>
          <button className="icon-button" onClick={logout} title="Cerrar sesion">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <section className="stats-grid">
        <article>
          <CarFront />
          <span>Total</span>
          <strong>{stats.total}</strong>
        </article>
        <article>
          <CheckCircle2 />
          <span>Disponibles</span>
          <strong>{stats.available}</strong>
        </article>
        <article>
          <Wrench />
          <span>En mantencion</span>
          <strong>{stats.maintenance}</strong>
        </article>
      </section>

      <section className="workspace">
        <form className="vehicle-form" onSubmit={handleVehicleSubmit}>
          <h2>{editingId ? "Editar vehiculo" : "Nuevo vehiculo"}</h2>
          <div className="form-grid">
            <label>
              Marca
              <input
                value={vehicleForm.brand}
                onChange={(event) => setVehicleForm({ ...vehicleForm, brand: cleanText(event.target.value) })}
                required
              />
            </label>
            <label>
              Modelo
              <input
                value={vehicleForm.model}
                onChange={(event) => setVehicleForm({ ...vehicleForm, model: cleanText(event.target.value) })}
                required
              />
            </label>
            <label>
              Año
              <select
                value={vehicleForm.year}
                onChange={(event) => setVehicleForm({ ...vehicleForm, year: Number(event.target.value) })}
                required
              >
                {getYearOptions().map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Patente
              <input
                value={vehicleForm.plate}
                onChange={(event) => setVehicleForm({ ...vehicleForm, plate: cleanPlate(event.target.value) })}
                required
              />
            </label>
            <label>
              Categoria
              <select
                value={vehicleForm.category}
                onChange={(event) => setVehicleForm({ ...vehicleForm, category: event.target.value })}
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Estado
              <select
                value={vehicleForm.status}
                onChange={(event) => setVehicleForm({ ...vehicleForm, status: event.target.value })}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Kilometraje
              <input
                type="number"
                min="0"
                value={vehicleForm.mileage}
                placeholder="Ej: 45000"
                onChange={(event) => setVehicleForm({ ...vehicleForm, mileage: event.target.value })}
              />
            </label>
          </div>
          <label>
            Notas
            <textarea
              value={vehicleForm.notes}
              onChange={(event) => setVehicleForm({ ...vehicleForm, notes: cleanText(event.target.value) })}
              maxLength="500"
            />
          </label>

          {message && <p className="message">{message}</p>}

          <div className="form-actions">
            <button className="primary-button" disabled={loading}>
              <Plus size={18} />
              {editingId ? "Guardar cambios" : "Agregar"}
            </button>
            {editingId && (
              <button
                type="button"
                className="ghost-button"
                onClick={() => {
                  setEditingId(null);
                  setVehicleForm(emptyVehicle);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>

        <section className="list-section">
          <div className="filters">
            <label className="search-box">
              <Search size={18} />
              <input
                placeholder="Buscar marca, modelo o patente"
                value={search}
                onChange={(event) => setSearch(cleanText(event.target.value))}
              />
            </label>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="">Todos</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="vehicle-list">
            {vehicles.map((vehicle) => (
              <article key={vehicle._id} className="vehicle-card">
                <button type="button" onClick={() => startEdit(vehicle)} className="vehicle-main">
                  <span className={`status-dot ${vehicle.status}`} />
                  <div>
                    <h3>
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <p>
                      {vehicle.plate} - {vehicle.year} - {categoryLabels[vehicle.category]}
                    </p>
                  </div>
                </button>
                <div className="vehicle-meta">
                  <span>{statusLabels[vehicle.status]}</span>
                  <span>{Number(vehicle.mileage || 0).toLocaleString("es-CL")} km</span>
                  <button className="icon-button danger" onClick={() => removeVehicle(vehicle._id)} title="Eliminar">
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            ))}

            {vehicles.length === 0 && (
              <div className="empty-state">
                <CarFront size={34} />
                <p>No hay vehiculos para mostrar.</p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
