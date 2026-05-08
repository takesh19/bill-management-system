import "./Customers.css";
import {useState, useEffect} from "react";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerBills, setCustomerBills] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const token = localStorage.getItem("token");

  const filteredCustomers = customers.filter(c =>
  c.name.toLowerCase().includes(search.toLowerCase()) ||
  c.mobile.includes(search)
  );

  const handleView = async (mobile) => {
  try {
    const res = await axios.get("https://bill-management-backend-1-1gij.onrender.com/api/bills");

    const filtered = res.data.filter(b => b.mobile === mobile);

    setCustomerBills(filtered);
    setSelectedCustomer(mobile);
  } catch (err) {
    console.log(err);
  }
  };

  useEffect(() => {
  axios.get("https://bill-management-backend-1-1gij.onrender.com/api/bills")
    .then(res => {
      const bills = res.data;

      const customersData = [];

      bills.forEach(b => {
        const exists = customersData.find(c => c.mobile === b.mobile);

        if (!exists) {
          customersData.push({
            name: b.name,
            mobile: b.mobile,
            totalSpent: b.final || 0,
            totalBills: 1,
            balance: b.balance || 0
          });
        } else {
          exists.totalSpent += b.final || 0;
          exists.totalBills += 1;
          exists.balance += b.balance || 0;
        }
      });

      setCustomers(customersData);
    })
    .catch(err => console.log(err));
  }, []);

  

  const addCustomer = () => {
    if (!name || !mobile) return;

    const newCustomer = {
      id: Date.now(),
      name,
      mobile,
      balance: 0,
    };

    setCustomers([...customers, newCustomer]);
    setName("");
    setMobile("");
  };

  const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  width: "400px",
  maxHeight: "80vh",
  overflowY: "auto"
};

  const handleDeleteCustomer = async (mobile) => {

  const confirmDelete = window.confirm(
    "Delete this customer and all bills?"
  );

  if (!confirmDelete) return;

  try {

    const res = await axios.get(
      "https://bill-management-backend-1-1gij.onrender.com/api/bills"
    );

    const customerBills = res.data.filter(
      (b) => b.mobile === mobile
    );

    // 🔥 delete all bills
    await Promise.all(
      customerBills.map((b) =>
        axios.delete(
          `https://bill-management-backend-1-1gij.onrender.com/api/bills/${b._id}`
        )
      )
    );

    // 🔥 refresh customers list
    const updated = customers.filter(
      (c) => c.mobile !== mobile
    );

    setCustomers(updated);

    alert("Customer deleted ✅");

  } catch (err) {

    console.log(err);

    alert("Delete failed ❌");

  }

  };

  return (
    <div className="customers-page">
      <h1 className="page-title">Customers</h1>

      {/* ADD CUSTOMER */}
      <div className="card form-card">
        <h3>Add Customer</h3>
        <div className="form-row">
          <input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <button onClick={addCustomer}>Add</button>
        </div>
      </div>

      {/* CUSTOMER LIST */}
      <div className="card table-card">
        <h3>Customer List</h3>

        <input
        placeholder="Search by name or mobile"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        />

        {customers.length === 0 ? (
          <p className="empty">No customers yet 😴</p>
        ) : (
          <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Mobile</th>
                <th>Total Spent</th>
                <th>Balance</th>
                <th>Total Bills</th>
              </tr>
            </thead>
            <tbody>
              {token ? (
              filteredCustomers.map((c) => (
                <tr key={c.mobile}>
                  <td>{c.name}</td>
                  <td>{c.mobile}</td>
                  <td style={{fontWeight: "bold"}}>₹ {c.totalSpent}</td>
                  <td style={{color:c.balance>0?"red":"green"}}>₹ {c.balance}</td>
                  <td> {c.totalBills}</td>
                  <td><button onClick={() => handleView(c.mobile)}>View</button></td>
                  <td><button
                        onClick={() => handleDeleteCustomer(c.mobile)}
                        style={{
                            background: "red",
                            color: "white",
                            marginLeft: "5px"
                          }}
                        >
                         Delete
                      </button></td>
                </tr>
              ))
              ):(
                <tr>
                 <td colSpan={"5"} style={{textAlign: "center"}}>
                   Login to view customers details 
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {selectedCustomer && (
      <div style={overlayStyle}>
      <div style={modalStyle}>

      <h3>Customer Bills</h3>

      <div className="table-wrapper">
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Bill No</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          {customerBills.map((b, i) => (
            <tr key={i}>
              <td>{b.billNo}</td>
              <td>{new Date(b.date).toLocaleDateString()}</td>
              <td>₹ {b.final}</td>
              <td style={{ color: b.balance > 0 ? "red" : "green" }}>
                ₹ {b.balance}
              </td>
              <td onClick={() => setSelectedBill(b)} style={{backgroundColor: "#2563eb"}}>View Items</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <button onClick={() => setSelectedCustomer(null)}>
        Close
      </button>

    </div>
  </div>
  )}

      {selectedBill && (
       <div style={overlayStyle}>
       <div style={modalStyle}>

      <h3>Bill Items</h3>

      <div className="table-wrapper">
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Service</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Amt</th>
          </tr>
        </thead>

        <tbody>
          {selectedBill.items.map((item, i) => (
            <tr key={i}>
              <td>{item.name || item.item}</td>
              <td>{item.service || "-"}</td>
              <td>{item.qty}</td>
              <td>{item.price || item.rate}</td>
              <td>{item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <br />

      <button onClick={() => setSelectedBill(null)}>
        Close
      </button>

     </div>
     </div>
    )}

    </div>
  );
};

export default Customers;