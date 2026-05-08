import { useEffect, useState } from "react";
import "./Revenue.css";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Revenue = () => {

  const [bills, setBills] = useState([]);

  const token = localStorage.getItem("token");

  const [data, setData] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    today: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0
  });

  const chartData = [
  { name: "Today", value: data.today },
  { name: "Weekly", value: data.weekly },
  { name: "Month", value: data.monthly },
  { name: "Year", value: data.yearly },
  ];

  const pieData = [
  { name: "Paid", value: data.paid },
  { name: "Pending", value: data.pending }
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  useEffect(() => {
  const fetchBills = async () => {
    try {
      const res = await axios.get("https://bill-management-backend-sj5x.onrender.com/api/bills");
      const bills = res.data;

      setBills(bills); // optional but useful

      let total = 0;
      let paid = 0;
      let pending = 0;
      let today = 0;
      let weekly = 0;
      let monthly = 0;
      let yearly = 0;

      const now = new Date();

      bills.forEach(b => {
        total += b.final || 0;
        paid += b.paid || 0;
        pending += b.balance || 0;

        const billDate = new Date(b.date);

        // TODAY
        if (billDate.toDateString() === now.toDateString()) {
          today += b.final || 0;
        }

        // WEEK (🔥 better logic)
        const diff = (now - billDate) / (1000 * 60 * 60 * 24);
        if (diff >= 0 && diff <= 7) {
          weekly += b.final || 0;
        }

        // MONTH
        if (
          billDate.getMonth() === now.getMonth() &&
          billDate.getFullYear() === now.getFullYear()
        ) {
          monthly += b.final || 0;
        }

        // YEAR
        if (billDate.getFullYear() === now.getFullYear()) {
          yearly += b.final || 0;
        }
      });

      setData({ total, paid, pending, today, weekly, monthly, yearly });

    } catch (err) {
      console.log(err);
    }
  };

  fetchBills();
  }, []);

  return (
    <div className="revenue-page">

      <h1>Revenue Dashboard</h1>

      <div className="cards">

        <div className="card blue">
          <h3>Total Revenue</h3>
          <p>₹ {token ? data.total:"0"}</p>
        </div>

        <div className="card green">
          <h3>Paid</h3>
          <p>₹ {token ? data.paid:"0"}</p>
        </div>

        <div className="card red">
          <h3>Pending</h3>
          <p>₹ {token ? data.pending:"0"}</p>
        </div>

        <div className="card purple">
          <h3>Today</h3>
          <p>₹ {token ? data.today:"0"}</p>
        </div>

        <div className="card cyan">
            <h3>This Week</h3>
            <p>₹ {token ? data.weekly:"0"}</p>
        </div>

        <div className="card orange">
          <h3>This Month</h3>
          <p>₹ {token ? data.monthly:"0"}</p>
        </div>

        <div className="card dark">
          <h3>This Year</h3>
          <p>₹ {token ? data.yearly:"0"}</p>
        </div>

      </div>

      <div className="chart-container">
       <h2>Revenue Overview 📊</h2>

       <ResponsiveContainer width="100%" height={300}>
         <BarChart data={token ? chartData:[]}>
         <XAxis dataKey="name" />
         <YAxis />
         <Tooltip />
         <Bar dataKey="value" />
         </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container-1">
      <h2>Payment Status 💰</h2>

     <ResponsiveContainer width="100%" height={300}>
     <PieChart>
      <Pie
        data={token ? pieData:[]}
        cx="50%"
        cy="50%"
        outerRadius={window.innerWidth < 768 ? 70 : 100}
        innerRadius={window.innerWidth < 768 ? 35 : 50}   //  donut style (premium look)
        dataKey="value"
        label
      >
        {token ? (pieData.map((entry, index) => (
          <Cell key={index} fill={COLORS[index]} />
        ))):(<p>Login to view</p>)}
      </Pie>

      <Tooltip />
    </PieChart>
    </ResponsiveContainer>
    </div>

    </div>
  );
};

export default Revenue;