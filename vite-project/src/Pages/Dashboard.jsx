import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

function Dashboard() {

  const token = localStorage.getItem("token");

  const [bills, setBills] = useState([]);

  const totalSales = bills.reduce(
    (sum, b) => sum + (b.final || 0),
    0
  );

  const paid = bills
    .filter((b) => b.balance === 0)
    .reduce((sum, b) => sum + (b.final || 0), 0);

  const unpaid = bills
    .filter((b) => b.balance > 0)
    .reduce((sum, b) => sum + (b.balance || 0), 0);

  const totalBills = bills.length;

  const customers = [
    ...new Set(bills.map((b) => b.mobile))
  ];

  const today = new Date().toLocaleDateString();

  const todaySales = bills
    .filter(
      (b) =>
        new Date(b.date).toLocaleDateString() === today
    )
    .reduce((sum, b) => sum + (b.final || 0), 0);

  useEffect(() => {

    const fetchBills = async () => {

      try {

        const res = await axios.get(
          "https://bill-management-backend-sj5x.onrender.com/api/bills"
        );

        setBills(res.data);

      } catch (err) {

        console.log(err);

      }

    };

    fetchBills();

  }, []);

  const navigate = useNavigate();

  return (

    <div className="dashboard-page">

      <h1 style={{ marginBottom: "20px" }}>
        Dashboard
      </h1>

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}
      >

        <Card
          title="Today Sales"
          value={`₹ ${token ? todaySales : "0"}`}
          color="#ff9800"
        />

        <Card
          title="Total Bills"
          value={token ? totalBills : "0"}
          color="#009688"
        />

        <Card
          title="Total Sales"
          value={`₹ ${token ? totalSales : "0"}`}
          color="#3b82f6"
        />

        <Card
          title="Paid"
          value={`₹ ${token ? paid : "0"}`}
          color="#22c55e"
        />

        <Card
          title="Unpaid"
          value={`₹ ${token ? unpaid : "0"}`}
          color="#ef4444"
        />

        <Card
          title="Customers"
          value={token ? customers.length : "0"}
          color="#a855f7"
        />

      </div>

      {/* RECENT BILLS */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "10px"
        }}
      >

        <h2>Recent Bills</h2>

        <div className="table-wrapper">

          <table className="dashboard-table">

            <thead>
              <tr>
                <th>Bill No</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {token ? (

                bills
                  .slice(-5)
                  .reverse()
                  .map((b, i) => (

                    <tr key={i}>

                      <td>{b.billNo}</td>

                      <td>{b.name}</td>

                      <td>₹ {b.final}</td>

                      <td
                        style={{
                          color:
                            b.balance > 0
                              ? "red"
                              : "green"
                        }}
                      >
                        {b.balance > 0
                          ? "Pending"
                          : "Paid"}
                      </td>

                      <td>

                        <button
                          onClick={() =>
                            navigate(`/bill/${b._id}`)
                          }
                        >
                          View
                        </button>

                      </td>

                    </tr>

                  ))

              ) : (

                <tr>

                  <td
                    colSpan={"5"}
                    style={{ textAlign: "center" }}
                  >
                    Login to view dashboard data 🔒
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

}

function Card({ title, value, color }) {

  return (

    <div
      className="dashboard-card"
      style={{
        background: color
      }}
    >

      <h3>{title}</h3>

      <h2>{value}</h2>

    </div>

  );

}

export default Dashboard;