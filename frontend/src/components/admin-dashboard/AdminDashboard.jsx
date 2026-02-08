import React, { useEffect } from "react";
import { connect } from "react-redux";
import DashboardCard from "../order-card/OrderCard";
import { getAdminORders } from "../../redux/order/order.actions";
import "./AdminDashboard.css";

const AdminDashboard = ({ getAdminORders, orders }) => {
  useEffect(() => {
    getAdminORders();
    const interval = setInterval(() => {
      getAdminORders();
    }, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, [getAdminORders]);
  return (
    <div>
      <div className="order-status">
        {orders?.map((order) => (
          <DashboardCard order={order} key={order?._id} />
        ))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  orders: state.order.orders,
});

export default connect(mapStateToProps, { getAdminORders })(AdminDashboard);
