import { useState, useEffect } from "react";
import axios from "axios";
import "./Items.css";

const Items = () => {

  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    Dry: "",
    Steam: "",
    Wash: "",
    RollingPress: ""
  });

  const services = ["Dry", "Steam", "Wash", "RollingPress"];

  // 🔥 save to localStorage

  useEffect(() => {
  fetchItems();
  }, []);

  const fetchItems = async () => {
  try {
    const res = await axios.get("https://bill-management-backend-1-1gij.onrender.com/api/items");
    setItems(res.data);
  } catch (err) {
    console.log(err);
    alert("Failed to load items ❌");
  }
  };

  // 🔥 ADD / UPDATE ITEM
  const addItem = async () => {

  if (!form.name) {
    alert("Enter item name");
    return;
  }


  try {
    // check existing by name
    const existing = items.find(i => i.name === form.name);
    const existingServices = existing?.services || {};

const newServices = {
  Dry: form.Dry !== "" 
    ? Number(form.Dry) 
    : existingServices.Dry || 0,

  Steam: form.Steam !== "" 
    ? Number(form.Steam) 
    : existingServices.Steam || 0,

  Wash: form.Wash !== "" 
    ? Number(form.Wash) 
    : existingServices.Wash || 0,

  RollingPress: form.RollingPress !== "" 
    ? Number(form.RollingPress) 
    : existingServices.RollingPress || 0
  };

    if (existing) {
      // UPDATE
      console.log(existing)
      await axios.put(`https://bill-management-backend-1-1gij.onrender.com/api/items/${existing._id}`, {
        name: form.name,
        services: newServices
      });
      alert("Item Updated ✅");
    } else {
      // CREATE
      await axios.post("https://bill-management-backend-1-1gij.onrender.com/api/items", {
        name: form.name,
        services: newServices
      });
      alert("Item Added ✅");
    }

    // refresh list
    await fetchItems();

    // reset form
    setForm({
      name: "",
      Dry: "",
      Steam: "",
      Wash: "",
      RollingPress: ""
    });

  } catch (err) {
    console.log(err);
    alert("Error ❌");
  }
  };

  // 🔥 DELETE ITEM
  const deleteItem = async (id) => {
  try {
    await axios.delete(`https://bill-management-backend-1-1gij.onrender.com/api/items/${id}`);

    await fetchItems();

    // UI update
    setItems(items.filter(i => i._id !== id));

  } catch (err) {
    alert("Delete failed ❌");
    console.log(err);
  }
  };

  return (
    <div className="items-page">

      <h1 className="title">Items</h1>

      {/* FORM */}
      <div className="card">

        <h3 className="section-title">Add Item</h3>

        <div className="form-row">

        <input
          placeholder="Item Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          type="number"
          placeholder="Dry ₹"
          value={form.Dry}
          onChange={(e) => setForm({ ...form, Dry: e.target.value })}
        />

        <input
          type="number"
          placeholder="Steam ₹"
          value={form.Steam}
          onChange={(e) => setForm({ ...form, Steam: e.target.value })}
        />

        <input
          type="number"
          placeholder="Wash ₹"
          value={form.Wash}
          onChange={(e) => setForm({ ...form, Wash: e.target.value })}
        />

        <input
          type="number"
          placeholder="RollingPress ₹"
          value={form.RollingPress}
          onChange={(e) => setForm({ ...form, RollingPress: e.target.value })}
        />

        <button onClick={addItem}>Add / Update</button>

        </div>

      </div>

      {/* TABLE */}
      <div className="card">

        <h3 className="section-title">Item List</h3>

        {items.length === 0 ? (
          <p className="empty">No items added 😴</p>
        ) : (
          <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                {services.map((s) => (
                  <th key={s}>{s}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {token ? (
              items.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>

                  {services.map((s) => (
                    <td key={s}>
                      ₹ {item.services?.[s] || 0}
                    </td>
                  ))}

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deleteItem(item._id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))
            ):(
              <tr>
                <td colSpan={"5"} style={{textAlign: "center"}}>
                  Login to view items details 
                </td>
              </tr>
            )}
            </tbody>
          </table>
          </div>
        )}

      </div>

    </div>
  );
};

export default Items;