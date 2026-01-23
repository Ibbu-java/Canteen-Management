import React, { useState } from "react";
import { connect } from "react-redux";
import { addFoodItem } from "../../redux/food/food.actions";
import "./AddFoodPage.css";

const AddFoodPage = ({ isAuthenticated, loading, addFoodItem, history }) => {
  const [formData, setFormData] = useState({
    foodType: "",
    name: "",
    price: "",
    quantity: "",
    image: "",
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const { name, price, foodType, quantity, image } = formData;

  const onSubmit = (e) => {
    e.preventDefault();

    addFoodItem(formData, history);
  };

  return (
    <div className="root">
      <div className="add-food-div">
        <div>
          <h1>Add food item</h1>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="name"
              className="input"
              placeholder="Name"
              value={name}
              onChange={onChange}
            />
            <br />
            <input
              type="text"
              name="price"
              className="input"
              placeholder="Price"
              value={price}
              onChange={onChange}
            />
            <br />
            <input
              type="text"
              name="quantity"
              className="input"
              placeholder="Quantity"
              value={quantity}
              onChange={onChange}
            />
            <br />
            <select name="foodType" value={foodType} onChange={onChange}>
              <option value="null">Cateogry </option>
              <option value="breakfast">Breakfast</option>
              <option value="indian">Indian</option>
              <option value="chinese">Chinese</option>
              <option value="chat">Chat</option>
            </select>
            <br />
            <input
              type="url"
              name="image"
              className="input"
              placeholder="Image URL"
              value={image}
              onChange={onChange}
            />
            <br />
            <button>Submit</button>
          </form>
        </div>
        <div>
          <img
            alt="img"
            src={
              image
                ? image
                : "https://wallpaperaccess.com/full/1285990.jpg"
            }
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.food.loading,
});

export default connect(mapStateToProps, { addFoodItem })(AddFoodPage);
