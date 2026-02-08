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
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  const onChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const { name, price, foodType, quantity } = formData;

  const onSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", name);
    data.append("price", price);
    data.append("foodType", foodType);
    data.append("quantity", quantity);
    if (formData.image) {
      data.append("image", formData.image);
    }

    addFoodItem(data, history);
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
              <option value="null">Category </option>
              <option value="breakfast">Breakfast</option>
              <option value="indian">Indian</option>
              <option value="chinese">Chinese</option>
              <option value="chat">Chat</option>
              <option value="beverages">Beverages</option>
            </select>
            <br />
            <label style={{ display: 'block', margin: '10px 0', fontSize: '17px' }}>Food Image:</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="input"
              style={{ paddingTop: '10px' }}
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
              imagePreview
                ? imagePreview
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
