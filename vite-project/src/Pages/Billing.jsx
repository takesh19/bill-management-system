import { useState, useEffect } from "react";
import "./Billing.css";
import { useParams } from "react-router-dom";
import  axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Select from "react-select";

const Billing = () => {

  const {id} = useParams();

  const [billNo, setBillNo] = useState(1000);

  const [itemsList, setItemsList] = useState([]);

  const [cart, setCart] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [mobile, setMobile] = useState("");

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    item: "",
    service: "Dry",
    qty: "",
    rate: ""
  });

  const services = ["Dry", "Steam", "Wash", "RollingPress"];

  const formatDate = (date) => {
    if(!date)return"";

    return new Date(date)
    .toLocaleDateString("en-GB")
    .replace(/\//g,"-");
  };

  useEffect(() => {
  if (id) {
    const bills = JSON.parse(localStorage.getItem("bills")) || [];

    const found = bills.find(b => String(b.billNo) === id);

    if (found) {
      setForm({
        name: found.name,
        mobile: found.mobile,
        discount: found.discount,
        paid: found.paid,
        payment: found.payment,
        delivery: found.delivery
      });

      setCart(found.items);
    }
  }
}, [id]);

  useEffect(() => {
  const fetchItems = async () => {
    try {
      const res = await axios.get("https://bill-management-backend-1-1gij.onrender.com/api/items");
      setItemsList(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  fetchItems();
  }, []);

  useEffect(() => {
  if (id) {
    axios.get(`https://bill-management-backend-1-1gij.onrender.com/api/bills`)
      .then(res => {
        const found = res.data.find(b => b._id === id);

        if (found) {
          setForm({
            name: found.name,
            mobile: found.mobile,
            discount: found.discount,
            paid: found.paid,
            payment: found.payment,
            delivery: found.delivery
          });

          setCart(found.items);

          setBillNo(found.billNo);
        }
      })
      .catch(err => console.log(err));
  }
}, [id]);

  useEffect(() => {
    if(id) return;
  const fetchBillNo = async () => {
    try {
      const res = await axios.get("https://bill-management-backend-1-1gij.onrender.com/api/bills");

      const bills = res.data;

      if (bills.length > 0) {
        const lastBill = bills[bills.length - 1];
        setBillNo(lastBill.billNo + 1);
      } else {
        setBillNo(1000);
      }

    } catch (err) {
      console.log(err);
    }
  };

  fetchBillNo();
  }, []);

  useEffect(() => {

  const fetchCustomers = async () => {

    try {

      const res = await axios.get("https://bill-management-backend-1-1gij.onrender.com/api/bills");

      const uniqueCustomers = [];

      res.data.forEach((b) => {

        const exists = uniqueCustomers.find(
          (c) => c.name === b.name
        );

        if (!exists) {

          uniqueCustomers.push({
            name: b.name,
            mobile: b.mobile
          });

        }

      });

      setCustomers(uniqueCustomers);

    } catch (err) {

      console.log(err);

    }

  };

  fetchCustomers();

  }, []);

  // 🔥 Auto Rate Fetch
  useEffect(() => {
    const selected = itemsList.find(i => i.name === form.item);
    if (selected) {
      const rate = selected.services?.[form.service] || 0;
      setForm(prev => ({ ...prev, rate }));
    }
  }, [form.item, form.service]);

  // 🔥 Add Item
  const addItem = () => {
    if (!form.item || !form.qty) return alert("Fill item details");

    const amount = form.qty * form.rate;

    const newItem = {
      item: form.item,
      service: form.service,
      qty: form.qty,
      rate: form.rate,
      amount
    };

    setCart([...cart, newItem]);

    setForm({
      ...form,
      item:"",
      service:"Dry",
      qty:"",
      rate:""
    });
  };

  const removeItem = (index) =>{
    const updateCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
  }

  const itemOptions = itemsList.map((item) => ({
    value: item.name,
    label: item.name
  }));


  const generateBill = async () => {

    if(!form.name.trim()){
      alert("Customer Name is required");
      return;
    }

    if(!form.mobile.trim()){
      alert("Mobile Number is required");
      return;
    }

    if(cart.length===0){
      alert("Please add at least one item");
      return;
    }

    if(form.mobile.length !== 10){
      alert("Enter valid monile number");
      return;
    }

  const [saving, setSaving] = useSatate(false);  

  const discount = Number(form.discount || 0);
  const paid = Number(form.paid || 0);

  const final = total - discount;
  const balance = final - paid;

  if(saving) return;
  setSaving(true);

  const billData = {
    name: form.name,
    mobile: form.mobile,
    items: cart,
    total,
    discount,
    final,
    paid,
    balance,
    payment: form.payment,
    delivery: form.delivery,
    date: new Date().toISOString(),
    status: balance > 0 ? "PENDING" : "PAID"
  };

  try {
    if (id) {
      //  UPDATE
      await axios.put(`https://bill-management-backend-1-1gij.onrender.com/api/bills/${id}`, billData);
      alert("Bill Updated ✅");
    } else {
      //  CREATE
      await axios.post("https://bill-management-backend-1-1gij.onrender.com/api/bills", billData);
      alert("Bill Created ✅");
    }

  } catch (err) {
    console.log(err);
    alert("Error ❌");

  } finally{
    setSaving(false);
  }
};

  const printBill = () => {
  const printContent = document.getElementById("print-area").innerHTML;

  const win = window.open("", "", "width=800,height=1000");

  win.document.write(`
    <html>
    <head>
      <title>Print Bill</title>

      <style>

      @page{
        size: 80mm auto;
        margin: 0;
      }

      html,body{
        margin:0;
        padding:0;
        width:80mm;
        font-family: monospace;
        font-size:18px;
      }

      #print-root{
        width:78mm;
        padding:2mm;
        box-sizing:border-box;
      }

      table{
        width:100%;
        border-collapse:collapse;
        table-layout:fixed;
      }

      th,td{
        padding:2px;
        overflow:hidden;
      }

      img{
        max-width:120px;
      }

      </style>

    </head>

    <body>

      <div id="print-root">
        ${printContent}
      </div>

    </body>
    </html>
  `);

  win.document.close();

  setTimeout(() => {
    win.print();
    win.close();
  }, 1000);
};


  // 🔥 Total
  const total = cart.reduce((sum, i) => sum + i.amount, 0);
  const balance = (total - (form.discount || 0)) - (form.paid || 0);

  const downloadPDF = async () => {
  const input = document.getElementById("print-area");

  if (!input) {
    alert("Nothing to print ❌");
    return;
  }

  try {
    const canvas = await html2canvas(input,{
      scale: 2
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200] // 🔥 thermal size
    });

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);

    pdf.save(`Bill_${Date.now()}.pdf`);

  } catch (err) {
    console.log(err);
    alert("PDF failed ❌");
  }
  };

 const sendWhatsApp = () => {

  if (!form.mobile) {
    alert("Mobile missing ❌");
    return;
  }

  const discount = Number(form.discount || 0);
  const paid = Number(form.paid || 0);
  const final = total - discount;
  const balance = final - paid;

  let message = `✨ *RIGHT CHOICE DRYCLEANERS* ✨\n`;
  message += `Thank you for visiting 🙏\n\n`;

  message += `🧾 *Bill Details*\n`;
  message += `Bill No: ${billNo}\n`;
  message += `Name: ${form.name}\n`;
  message += `Mobile: ${form.mobile}\n\n`;

  message += `👕 *Items:*\n`;

  cart.forEach((item, i) => {
    message += `${i + 1}. ${item.item} (${item.service}) x${item.qty} = ₹${item.amount}\n`;
  });

  message += `\n💰 *Summary*\n`;
  message += `Total: ₹${total}\n`;
  message += `Discount: ₹${discount}\n`;
  message += `Final: ₹${final}\n`;
  message += `Paid: ₹${paid}\n`;
  message += `Balance: ₹${balance}\n\n`;

  message += `📅 Delivery: ${form.delivery || "N/A"}\n`;
  message += `💳 Payment: ${form.payment || "N/A"}\n\n`;

  message += `🙏 Thank you! Visit Again\n`;
  message += `RIGHT CHOICE DRYCLEANERS`;

  const url = `https://wa.me/91${form.mobile}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank");
  };

  const saveAndPrint = async () => {
    await generateBill();
    printBill();

    setTimeout(() => {
    setCart([]);

  setForm({
    name: "",
    mobile: "",
    item: "",
    service: "Dry",
    qty: "",
    rate: "",
    discount: "",
    paid: "",
    payment: "",
    delivery: ""
  });
  }, 3000);
  };

  return (
    <div className="billing-new">

      <h1>Billing</h1>
      <h2>Bill No: {billNo}</h2>

      {/* CUSTOMER */}
      <div className="card">
        <h3>Customer Details</h3>

        <div className="grid-2">
          <input
         list="customerNames"
        placeholder="Customer Name"
        value={form.name}
       onChange={(e) => {

        const value = e.target.value;

    const found = customers.find(
      (c) => c.name.toLowerCase() === value.toLowerCase()
    );

    setForm({
      ...form,
      name: value,
      mobile: found ? found.mobile : form.mobile
    });
  }}
  />

    <datalist id="customerNames">
       {customers.map((c, index) => (
       <option key={index} value={c.name} />
      ))}
    </datalist>

          <input
            placeholder="Mobile Number"
            maxLength={10}
            value={form.mobile ||""}
            onChange={(e) =>
              setForm({
                ...form,
                mobile: e.target.value.replace(/\D/g, "").slice(0, 10)
              })
            }
          />
        </div>
      </div>

      {/* ADD ITEM */}
      <div className="card">
        <h3>Add Item</h3>

        <div className="grid-4">
          <Select
            options = {itemOptions}
            placeholder = "Select item"
            onChange ={(selected) =>
            setForm({
              ...form,
              item:selected.value
            })
            } 
          />

          <select
            value={form.service}
            onChange={(e) => setForm({ ...form, service: e.target.value })}
          >
            {services.map((s, i) => (
              <option key={i}>{s}</option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Qty"
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
          />

          <input
            type="number"
            placeholder="Rate"
            value={form.rate}
            onChange={(e)=> 
              setForm({ ...form, rate:Number(e.target.value)})
            }
          />
        </div>

        <button className="btn" onClick={addItem}>Add Item</button>
      </div>

      {/* TABLE */}
      <div className="card">
        <h3>Bill Items</h3>

        {cart.length === 0 ? (
          <p>No items added 😴</p>
        ) : (
          <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Service</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amt</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((i, index) => (
                <tr key={index}>
                  <td>{i.item}</td>
                  <td>{i.service}</td>
                  <td>{i.qty}</td>
                  <td>{i.rate}</td>
                  <td>{i.amount}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={()=> removeItem(index)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* SUMMARY */}
      <div className="card">
  <h3>Summary</h3>

  <h2>Total: ₹ {total}</h2>

  <div className="grid-2">

    <input
      type="number"
      placeholder="Discount ₹"
      value={form.discount || ""}
      onChange={(e) => setForm({ ...form, discount: e.target.value })}
    />

    <input
      type="number"
      placeholder="Paid ₹"
      value={form.paid || ""}
      onChange={(e) => setForm({ ...form, paid: e.target.value })}
    />

    <input
      type="date"
      value={formatDate(form.delivery) || ""}
      onChange={(e) => setForm({ ...form, delivery: e.target.value })}
    />

    <select
      value={form.payment || ""}
      onChange={(e) => setForm({ ...form, payment: e.target.value })}
    >
      <option>Select</option>
      <option>Cash</option>
      <option>UPI</option>
      <option>Card</option>
    </select>

  </div>

  {/* FINAL CALC */}
  <div className="summary-box">
    <p>Final: ₹ {total - (form.discount || 0)}</p>
    <p>Balance: ₹ {(total - (form.discount || 0)) - (form.paid || 0)}</p>
  </div>

  <div className="actions">
    {/* <button className="btn" onClick={generateBill}>
    Generate
    </button> */}
    <button className="btn outline" 
    onClick={saveAndPrint}
    disabled={saving}
    >{saving ? "Generating...":"Save & Print"}</button>
    <button className="btn" onClick={downloadPDF}>
    Download PDF
    </button>
    <button className="btn" onClick={()=> {console.log("FORM DATA:", form);
      sendWhatsApp()}}>
    Send WhatsApp
    </button>
   </div>

  </div>

  {/* Print preview */}
  <div id="print-area" style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
  <div style={{ width: "80mm", fontFamily: "monospace", fontSize: "16px" }}>

    <div style={{ textAlign: "center" }}>
      <img src="https://bill-management-system-wb4w.onrender.com/logo.png" width="90" /><br />
      <b style={{ fontSize: "18px" }}>RIGHT CHOICE DRYCLEANERS</b><br />
      Infront of PNB Bank Smriti Nagar Bhilai<br />
      Contact: 6261810154
    </div>

    <div style={{ borderTop: "1px dashed black", margin: "6px 0" }}></div>

    Bill No: {billNo}
    <span style={{ float: "right" }}>
      Date: {formatDate(new Date())}
    </span>

    <div style={{ borderTop: "1px dashed black", margin: "6px 0" }}></div>

    Name: {form.name}<br />
    Mob: {form.mobile}

    <div style={{ borderTop: "1px dashed black", margin: "6px 0" }}></div>

    <table style={{ width: "100%",tableLayout:"fixed", fontSize: "18px", borderCollapse: "collapse" }}>
  <thead>
    <tr>
      <th style={{width:"35%", textAlign: "left" }}>Item</th>
      <th style={{width:"15%", textAlign: "center" }}>Svc</th>
      <th style={{width:"10%", textAlign: "center" }}>Qty</th>
      <th style={{width:"20%", textAlign: "right" }}>Rate</th>
      <th style={{width:"20%", textAlign: "right" }}>Amt</th>
    </tr>
  </thead>

  <tbody>
    {cart.map((i, index) => (
      <tr key={index}>
        <td>{i.item}</td>
        <td style={{ textAlign: "center" }}>
          {i.service === "RollingPress"?"RP"
          :i.service === "Steam"?"ST"
        :i.service}
          </td>
        <td style={{ textAlign: "center" }}>{i.qty}</td>
        <td style={{ textAlign: "right" }}>{i.rate}</td>
        <td style={{ textAlign: "right" }}>{i.amount}</td>
      </tr>
    ))}
  </tbody>
  </table>

    <div style={{ borderTop: "1px dashed black", margin: "6px 0" }}></div>

    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <b>Total:</b> ₹{total}
      </div>

      {form.discount > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <b>Discount:</b> ₹{form.discount}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <b>Final:</b> ₹{total - Number(form.discount||0)}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <b>Paid:</b> ₹{form.paid}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <b>Balance:</b> ₹{balance}
      </div>
    </div>

    <div style={{ borderTop: "1px dashed black", margin: "6px 0" }}></div>

    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>Payment: {form.payment}</span>
      <span>Delivery: {form.delivery}</span>
    </div>

    <div style={{ borderTop: "2px solid black", margin: "6px 0" }}></div>

    <small>
      Clothes at owner's risk<br />
      No guarantee for colour damage<br />
      Please bring this bill at Delivery
    </small>

    <div style={{ borderTop: "1px dashed black", margin: "6px 0" }}></div>

    <div style={{ textAlign: "center" }}>
      THANK YOU 🙏 VISIT AGAIN
    </div>

  </div>
  </div>

    </div>
  );
};

export default Billing;