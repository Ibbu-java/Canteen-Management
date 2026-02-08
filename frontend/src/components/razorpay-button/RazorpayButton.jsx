import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { setAlert } from "../../redux/alert/alert.actions";

const RazorpayButton = ({ order, user, setAlert, onSuccess }) => {

  const handlePayment = async () => {
    try {
      // 1. Create Order on Backend
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const body = JSON.stringify({ amount: order.totalPrice });
      const { data: razorpayOrder } = await axios.post(
        "/payment/create-order",
        body,
        config
      );

      // 2. Open Razorpay Modal
      const options = {
        key: "rzp_test_SCx7vFIF4LMXAO", 
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Campus Canteen",
        description: "Food Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          // 3. Verify Payment on Backend
          try {
            const verifyBody = JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              db_order_id: order._id,
            });

            await axios.post("/payment/verify-payment", verifyBody, config);
            
            setAlert("Payment Successful", "success");
            if (onSuccess) onSuccess();

          } catch (error) {
            console.error(error);
            setAlert("Payment verification failed", "danger");
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: "9999999999", // You might want to get this from user profile
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        setAlert(response.error.description, "danger");
      });
      rzp1.open();

    } catch (error) {
      console.error(error);
      setAlert("Error initiating payment", "danger");
    }
  };

  return (
    <button className="online-btn" onClick={handlePayment}>
      Pay Online (Cards/Wallets)
    </button>
  );
};

const mapStateToProps = (state) => ({
    user: state.auth.user
});

export default connect(mapStateToProps, { setAlert })(RazorpayButton);
