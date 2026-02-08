import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoice = (order, currentUser) => {
  const doc = new jsPDF();

  // Resolve Customer Data
  // If order.user has name (populated from backend), use it.
  // Otherwise, use currentUser (logged-in user viewing their own order).
  const customer = order.user?.name ? order.user : currentUser;

  // Add Title
  doc.setFontSize(20);
  doc.text("Campus Canteen Invoice", 105, 20, { align: "center" });

  // Add Company Details (Static for now)
  doc.setFontSize(10);
  doc.text("Campus Canteen Services", 105, 26, { align: "center" });
  doc.text("College Campus, Main Building", 105, 30, { align: "center" });

  // Add Line Separator
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Add Order Details
  doc.setFontSize(12);
  doc.text(`Order ID: ${order._id}`, 20, 45);
  doc.text(`Date: ${new Date(order.date).toLocaleString()}`, 20, 52);
  
  // Add Customer Details
  doc.text(`Customer Name: ${customer?.name || "N/A"}`, 20, 59);
  doc.text(`Branch: ${customer?.branch || "N/A"}`, 20, 66);
  
  const displayRole = ["Administration", "Library"].some(b => b.toLowerCase() === customer?.branch?.trim()?.toLowerCase())
    ? customer?.branch 
    : customer?.role;
  doc.text(`Role: ${displayRole || "N/A"}`, 20, 73);

  if (order.roomNo) {
    doc.text(`Room No: ${order.roomNo}`, 20, 80);
  }

  // Add Payment Status
  const paymentStatus = order.paymentStatus ? "PAID" : "PENDING";
  const paymentMethod = order.paymentType === "online" ? "Online (Razorpay)" : "Cash";
  
  doc.text(`Payment Status: ${paymentStatus}`, 140, 45);
  doc.text(`Payment Method: ${paymentMethod}`, 140, 52);

  // Add Order Items Table
  const tableColumn = ["Item Name", "Quantity", "Price (INR)", "Total (INR)"];
  const tableRows = [];

  console.log("Generating Invoice for Order:", order);

  if (order.orders && order.orders.length > 0) {
    order.orders.forEach((item) => {
      const itemData = [
        item.name,
        item.quantity,
        item.price,
        item.price * (parseInt(item.quantity) || 1), 
      ];
      tableRows.push(itemData); 
    });
  } else {
    tableRows.push(["No items found", "-", "-", "-"]);
  }

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 80,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [22, 160, 133] }, // Greenish color
  });

  // Add Total Price
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text(`Total Amount: INR ${order.totalPrice}`, 140, finalY);

  // Footer
  doc.setFontSize(10);
  doc.text("Thank you for your order!", 105, 280, { align: "center" });

  // Save PDF
  doc.save(`Invoice_${order._id}.pdf`);
};
