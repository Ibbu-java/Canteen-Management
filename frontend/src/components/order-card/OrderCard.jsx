import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  confirmOrder,
  setpaymentStatus,
  setpaymentType,
  submitFeedback,
} from "../../redux/order/order.actions";
import RazorpayButton from "../../components/razorpay-button/RazorpayButton";
import { generateInvoice } from "../../utils/invoiceGenerator";
import "./OrderCard.css";

const OrderCard = ({
  order,
  user,
  confirmOrder,
  setpaymentType,
  setpaymentStatus,
  submitFeedback,
  history,
}) => {
  const [feedbackText, setFeedbackText] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleFeedbackSubmit = () => {
    if (feedbackText.trim()) {
      submitFeedback(order._id, feedbackText);
    }
  };

  const handleRejectSubmit = () => {
    if (rejectionReason.trim()) {
      confirmOrder(order._id, false, history, rejectionReason);
      setIsRejecting(false);
    }
  };

  return (
    <div className="order-card">
      <h3>Order Id: {order?._id}</h3>

      {order?.orders && order.orders.length > 0 ? (
        order.orders.map((ord, index) => (
        <div className="ordered-food" key={index}>
          <img alt={ord?.name} src={ord?.image} />
          <p>{ord?.name}</p>
          <p>{ord?.quantity}</p>
          <p>₹{ord?.price}</p>
        </div>
      ))
      ) : (
        <p style={{ color: "red" }}>No items found in this order.</p>
      )}

      <p>
        <b>Total Price: </b>₹{order?.totalPrice}
      </p>
      <p>
        <b>Status: </b>
        {order?.isConfirmed !== null ? (
          order?.isConfirmed === true ? (
            <span className="accepted-span">Accepted</span>
          ) : (
            <span className="rejected-span">Rejected</span>
          )
        ) : (
          <span className="notConfirm-span">Not confirmed yet</span>
        )}
      </p>

      {order?.paymentStatus === true ? (
        <p>
          <b>Payment Status: </b>
          <span className="accepted-span">Paid</span>
        </p>
      ) : (
        order?.isConfirmed &&
        !user?.isAdmin &&
        (order?.paymentType === "" ? (
          <>
            <h3>Choose your payment method</h3>
            <div className="payment-button">
              <button
                className="online-btn"
                onClick={() => setpaymentType(order?._id, "online", history)}
              >
                Online
              </button>
              <button
                className="offline-btn"
                onClick={() => setpaymentType(order?._id, "offline", history)}
              >
                Cash
              </button>
            </div>
          </>
        ) : order?.paymentType === "online" ? (
          <RazorpayButton order={order} onSuccess={() => setpaymentStatus(order?._id)} />
        ) : (
          <p>You have to pay in Cash</p>
        ))
      )}
      {user?.isAdmin && (
        <div>
          <h4>User details</h4>
          <div className="user-details">
            <p>Name: {order?.user?.name}</p>
            <p>Branch: {order?.user?.branch}</p>
          </div>
          <p>
            Role:{" "}
            {["Administration", "Library"].some(b => b.toLowerCase() === order?.user?.branch?.trim()?.toLowerCase())
              ? order?.user?.branch
              : order?.user?.role}
          </p>
        </div>
      )}

      {order?.user?.role === "teacher" && (
        <div>
          <p>
            <b>Room No: </b>
            {order?.roomNo}
          </p>
          <p>
            <b>Message: </b> {order?.message}
          </p>
        </div>
      )}

      {user?.isAdmin && order?.isConfirmed === null && (
        <div className="admin-buttons-container">
          {!isRejecting ? (
            <div className="admin-buttons">
              <button
                className="accept"
                onClick={() => confirmOrder(order?._id, true, history)}
              >
                Accept
              </button>
              <button
                className="reject"
                onClick={() => setIsRejecting(true)}
              >
                Reject
              </button>
            </div>
          ) : (
            <div className="feedback-form">
               <h4>Rejection Reason</h4>
               <textarea
                 value={rejectionReason}
                 onChange={(e) => setRejectionReason(e.target.value)}
                 placeholder="Enter reason for rejection..."
                 className="feedback-input"
               />
               <div className="rejection-actions">
                 <button
                   className="submit-feedback-btn"
                   onClick={handleRejectSubmit}
                   disabled={!rejectionReason.trim()}
                   style={{ backgroundColor: "#dc3545" }}
                 >
                   Confirm Reject
                 </button>
                 <button
                   className="cancel-btn"
                   onClick={() => setIsRejecting(false)}
                 >
                   Cancel
                 </button>
               </div>
            </div>
          )}
        </div>
      )}

      {user?.isAdmin &&
        order?.isConfirmed &&
        order?.paymentType === "offline" &&
        order?.paymentStatus === false ? (
        <button
          className="payment-done"
          onClick={() => setpaymentStatus(order?._id, history)}
        >
          Payment Done
        </button>
      ) : (
        ""
      )}

      {order?.paymentType && (
        <p>
          <b>Payment Type:</b> {order?.paymentType}
        </p>
      )}

      {(order?.paymentType === "offline" ||
        (order?.paymentType === "online" && order?.paymentStatus === true)) && (
        <button
          className="invoice-btn"
          onClick={() => generateInvoice(order, user)}
        >
          Download Invoice
        </button>
      )}

      {order?.feedback && (
        <div className="feedback-section">
          <p><b>Feedback:</b> {order.feedback}</p>
        </div>
      )}

      {!user?.isAdmin && order?.paymentStatus && !order?.feedback && (
        <div className="feedback-form">
          <h4>Rate your experience</h4>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Write your feedback here..."
            className="feedback-input"
          />
          <button
            className="submit-feedback-btn"
            onClick={handleFeedbackSubmit}
            disabled={!feedbackText.trim()}
          >
            Submit Feedback
          </button>
        </div>
      )}

      {order?.isConfirmed === false && (
        <div className="rejection-info">
          {order?.rejectionReason && (
             <p className="rejection-reason"><b>Rejection Reason:</b> {order.rejectionReason}</p>
          )}
          {!user?.isAdmin && (
            <p className="support-info">
              <b>Support:</b> For any queries, please contact the canteen at: 
              <a href="tel:+919826000000" style={{ marginLeft: "5px", color: "#007bff", textDecoration: "none" }}>
                +91 9826000000
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, {
  confirmOrder,
  setpaymentType,
  setpaymentStatus,
  submitFeedback,
})(OrderCard);
