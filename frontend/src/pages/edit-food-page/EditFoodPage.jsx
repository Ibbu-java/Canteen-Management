import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Loader from "../../components/loader/Loader";
import { editFoodItem, getSingleFoodItem } from "../../redux/food/food.actions";
import "./EditFoodPage.css";

const AddFoodPage = ({
  isAuthenticated,
  loading,
  getSingleFoodItem,
  history,
  match,
  food,
  editFoodItem,
}) => {
  const [foodType, setFoodType] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [image, setImage] = useState("");

  useEffect(() => {
    getSingleFoodItem(match.params.id);
    setFoodType(food?.foodType);
    setName(food?.name);
    setPrice(food?.price);
    setQuantity(food?.quantity);
    setImage(food?.image);
  }, [getSingleFoodItem, match, food]);

  const onSubmit = (e) => {
    e.preventDefault();

    // Send as JSON object instead of FormData
    const foodData = {
      foodType,
      name,
      price,
      quantity,
      image,
    };
    editFoodItem(foodData, match.params.id, history);
  };

  return (
    <div className="root">
      {loading && <Loader />}
      <div className="add-food-div">
        <div>
          <h1>Edit food item</h1>

          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="name"
              className="input"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
              type="text"
              name="price"
              className="input"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <br />
            <input
              type="text"
              name="quantity"
              className="input"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <br />
            <select
              name="foodType"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
            >
              <option value="null">Cateogry </option>
              <option value="breakfast">Breakfast</option>
              <option value="indian">Indian</option>
              <option value="chinese">Chinese</option>
              <option value="chat">Chat</option>
            </select>
            <br />
            <input
              type="text"
              name="image"
              className="input"
              placeholder="Image URL (e.g., https://example.com/image.jpg)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <br />
            <button>Submit</button>
          </form>
        </div>
        <div>
          <img
            alt="img"
            src={image || "https://wallpaperaccess.com/full/1285990.jpg"}
          />
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.food.loading,
  food: state.food.food,
});

export default connect(mapStateToProps, { getSingleFoodItem, editFoodItem })(
  AddFoodPage
);
