import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Loader from "../../components/loader/Loader";
import { editFoodItem, getSingleFoodItem } from "../../redux/food/food.actions";
import "./EditFoodPage.css";

const EditFoodPage = ({
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
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (!food || food._id !== match.params.id) {
       getSingleFoodItem(match.params.id);
    } else {
      setFoodType(food.foodType || "");
      setName(food.name || "");
      setPrice(food.price || "");
      setQuantity(food.quantity || "");
      setImagePreview(food.image || "");
    }
  }, [getSingleFoodItem, match, food]);

  const onImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("foodType", foodType);
    data.append("name", name);
    data.append("price", price);
    data.append("quantity", quantity);
    
    if (image) {
      data.append("image", image);
    } else {
      data.append("image", imagePreview);
    }

    editFoodItem(data, match.params.id, history);
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
              onChange={onImageChange}
            />
            <br />
            <button>Submit</button>
          </form>
        </div>
        <div>
          <img
            alt="img"
            src={imagePreview || "https://wallpaperaccess.com/full/1285990.jpg"}
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
  EditFoodPage
);
