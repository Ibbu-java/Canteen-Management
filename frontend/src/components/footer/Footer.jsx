import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="about">
        <h2>About Policy</h2>
        <p>
          The Campus Canteen policy focuses on providing efficient, secure, and reliable management of canteen operations. It ensures proper handling of orders, payments, and user data while reducing manual effort and errors. Access to system data is restricted to authorized users to maintain accuracy and transparency.
        </p>
      </div>
      {/* <div className="header">
        <h2>Header</h2>
        <a href=""></a><p>Link</p>
        <p>Link</p>
        <p>Link</p>
        <p>Link</p>
      </div>
      <div className="header">
        <h2>Header</h2>
        <p>Link</p>
        <p>Link</p>
        <p>Link</p>
        <p>Link</p>
      </div> */}
      <div className="contact-us">
        <h2>Contact Us</h2>
        <p>
          <b>Address:</b> SIES College of Management Studies,Nerul East, Navi Mumbai - 400706{" "}
        </p>
        <p>
          <b>Phone No:</b> +91 9826000000
        </p>
      </div>
    </div>
  );
};

export default Footer;
