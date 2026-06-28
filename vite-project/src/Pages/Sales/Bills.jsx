import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Bills = () => {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

  const [bills, setBills] = useState([]);
  const [bill, setBill] = useState(null);  

  const [search, setSearch] = useState("");
  const [payNow, setPayNow] = useState("");

  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
  fetchBills();
  }, []);

  const fetchBills = async () => {
  try {
    const res = await axios.get("https://bill-management-backend-1-1gij.onrender.com/api/bills");
    setBills(res.data);
  } catch (err) {
    console.log(err);
  }
  };

  const handleEdit = (bill) => {
  navigate(`/bill/${bill._id}`);
  };

  // 🔍 SEARCH BILL
  const searchBill = () => {

  const value = search.trim().toLowerCase();

  const found = bills.find((b) => {

    return (
      String(b.billNo) === value ||
      b.name?.toLowerCase().includes(value) ||
      b.mobile?.includes(value)
    );

  });

  if (!found) {
    alert("Bill not found ❌");
    return;
  }

  setBill(found);

 };

  // 💰 PAYMENT UPDATE
  const handlePayment = async () => {
  if (!payNow) return alert("Enter amount");

  try {
    const pay = Number(payNow);

    const updatedPaid = bill.paid + pay;
    const newBalance = bill.final - updatedPaid;

    const updatedData = {
      ...bill,
      paid: updatedPaid,
      balance: newBalance,
      status: newBalance <= 0 ? "PAID" : "PENDING"
    };

    await axios.put(
      `https://bill-management-backend-1-1gij.onrender.com/api/bills/${bill._id}`,
      updatedData
    );

    alert("Payment Updated ✅");

    setBill(updatedData);
    setPayNow("");

    fetchBills(); // 🔥 refresh list

  } catch (err) {
    console.log(err);
    alert("Error ❌");
  }
  };

  const handleDelete = async (id) => {

  const confirmDelete = window.confirm(
    "Delete this bill permanently?"
  );

  if (!confirmDelete) return;

  try {

    await axios.delete(
      `https://bill-management-backend-1-1gij.onrender.com/api/bills/${id}`
    );

    alert("Bill deleted ✅");

    fetchBills(); // refresh list

    setBill(null);

  } catch (err) {

    console.log(err);

    alert("Delete failed ❌");

  }

  };

  const formateDate = (date) => {
    if(!date) return"";

    return new Date(date)
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");
  }

  return (
    <div className="billing-new">

      <h1>Bill Search</h1>

      {/* 🔍 SEARCH */}
      <div className="card">
        <input
          placeholder="Search by Bill No/ Name/ Mobile No"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if(e.key === "Enter"){
              serchBills();
            }
          }}
        />

        <input
         type="date"
         value={selectedDate}
         onChange={(e) =>
          setSelectedDate(e.target.value)
         } 
         />

         <button
         className="btn"
         onClick={() => setSelectedDate("")}
         >
          clear
         </button>

        <button className="btn" onClick={searchBill}>
          Search
        </button>
      </div>

      {bill && (
        <div className="card">
           <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px"
  }}
>
  <h3>📄 Bill Details</h3>

  <button
    onClick={() => setBill(null)}
    style={{
      background: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "bold"
    }}
  >
    ✕
  </button>
</div>


          <h4>Bill No: {bill.billNo}</h4>

          <p><b>Name:</b> {bill.name}</p>
          <p><b>Mobile:</b> {bill.mobile}</p>

          {/* TABLE */}
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Service</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>

            <tbody>
              {bill.items.map((i, index) => (
                <tr key={index}>
                  <td>{i.item}</td>
                  <td>{i.service}</td>
                  <td>{i.qty}</td>
                  <td>{i.rate}</td>
                  <td>{i.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 💰 SUMMARY */}
          <h3>Total: ₹ {bill.total}</h3>
          <p>Discount: ₹ {bill.discount}</p>
          <p>Final: ₹ {bill.final}</p>
          <p>Paid: ₹ {bill.paid}</p>

          <p className={bill.balance > 0 ? "pending" : "paid"}>
              Balance: ₹ {bill.balance}{" "}
              {bill.balance > 0 ? "🔴 Pending" : "🟢 Paid"}
          </p>

          {/* 💳 PAYMENT */}
          {bill.balance > 0 && (
            <div style={{ marginTop: "10px" }}>
              <input
                type="number"
                placeholder="Pay Now"
                value={payNow}
                onChange={(e) => setPayNow(e.target.value)}
              />

              <button className="btn" onClick={handlePayment}>
                Pay
              </button>
            </div>
          )}

        </div>
      )}


       <h2>All Bills</h2>

        <div className="table-wrapper">
        <table>
         <thead>
         <tr>
         <th>Bill No</th>
         <th>Name</th>
         <th>Amount</th>
         <th>Date</th>
         <th>Status</th>
         <th>Action</th>
         </tr>
        </thead>

        <tbody>
          {token ? (
          bills
          .filter((b) => {
            if(!selectedDate) return true;

            return b.date?.slice(0, 10) === selectedDate;
          })
          .map((b) => (
          <tr key={b._id}>
          <td>{b.billNo}</td>
          <td>{b.name}</td>
          <td>₹{b.final}</td>
          <td>{formateDate(b.date)}</td>
          <td>
          {b.balance > 0 ? "🔴 Pending" : "🟢 Paid"}
          </td>
          <td>
          <button onClick={() => setBill(b)}>View</button>

          <button onClick={() => handleEdit(b)}>Edit</button>

          <button
            onClick={() => handleDelete(b._id)}
            style={{ background: "red", color: "white" }}
            >
              Delete
          </button>

        </td>
        </tr>
        ))
      ):(
        <tr>
          <td colSpan={"6"} style={{textAlign: "center"}}>
            Login to view bills
          </td>
        </tr>
      )}
        </tbody>
        </table>
        </div>

      {/* 📄 BILL DETAILS */}
      
    </div>
  );
};

export default Bills;