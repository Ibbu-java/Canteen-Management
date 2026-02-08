import React, { useState } from "react";
import { connect } from "react-redux";
import { registerUser } from "../../redux/auth/auth.actions";
import { Redirect } from "react-router-dom";
import { MdAccountCircle } from "react-icons/md";
import { setAlert } from "../../redux/alert/alert.actions";
import { Link } from "react-router-dom";

import "./SignUpPage.css";

const SignUpPage = ({ registerUser, isAuthenticated, setAlert }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    branch: "",
    role: "",
  });

  const { name, email, password, confirmPassword, branch } = formData;

  React.useEffect(() => {
    if (branch === "Administration" || branch === "Library") {
      setFormData((prev) => ({ ...prev, role: "teacher" }));
    }
  }, [branch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    const allowedDomains = [
      "@siescoms.sies.edu.in",
      "@siesascn.sies.edu.in",
      "@ssbs.sies.edu.in",
      "@siesgst.sies.edu.in"
    ];

    const isValidEmail = allowedDomains.some(domain => email.endsWith(domain));

    if (!isValidEmail) {
      setAlert("Please use your institutional email address ", "danger");
      return;
    }

    if (confirmPassword !== password) {
      setAlert("Password do not match", "danger");
    } else {
      registerUser(formData);
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }
  return (
    <div className="root">
      <div className="signup-div">
        <div className="signup-form">
          <MdAccountCircle className="sign-up-icon" />
          <h1>Create an account</h1>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Name"
            />
            <br></br>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="College Email ID"
            />
            <br />
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="New Password"
            />
            <br />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={onChange}
            />
            <br />
            <select
              name="branch"
              value={branch}
              onChange={onChange}
              id="cars"
              disabled={
                !email.includes("@siescoms") &&
                !email.includes("@siesgst") &&
                !email.includes("@ssbs") &&
                !email.includes("@siesascn")
              }
            >
              <option value="null">
                {email.includes("@siescoms") ||
                email.includes("@siesgst") ||
                email.includes("@ssbs") ||
                email.includes("@siesascn")
                  ? "Branch"
                  : "Enter valid email to select Branch"}
              </option>
              {email.includes("@siescoms") ? (
                <>
                  <option value="MCA">MCA</option>
                  <option value="MMS">MMS</option>
                  <option value="PH.D.MS">PH.D.MS</option>
                  <option value="PH.D.CA">PH.D.CA</option>
                  <option value="Administration">Administration</option>
                  <option value="Library">Library</option>
                </>
              ) : email.includes("@siesgst") ? (
                <>
                  <option value="EXTC">EXTC</option>
                  <option value="CE">CE</option>
                  <option value="IT">IT</option>
                  <option value="EXCS">EXCS</option>
                  <option value="AIML">AIML</option>
                  <option value="AIDS">AIDS</option>
                  <option value="Administration">Administration</option>
                  <option value="Library">Library</option>
                </>
              ) : email.includes("@ssbs") ? (
                <>
                  <option value="PGDM">PGDM</option>
                  <option value="PGDM PM">PGDM PM</option>
                  <option value="PGDM BIO">PGDM BIO</option>
                  <option value="PGPLM">PGPLM</option>
                  <option value="Administration">Administration</option>
                  <option value="Library">Library</option>
                </>
              ) : email.includes("@siesascn") ? (
                <>
                  <option value="BAF">BAF</option>
                  <option value="BCOM">BCOM</option>
                  <option value="BBI">BBI</option>
                  <option value="BFM">BFM</option>
                  <option value="BMS">BMS</option>
                  <option value="BSC IT">BSC IT</option>
                  <option value="BSC CS">BSC CS</option>
                  <option value="Administration">Administration</option>
                  <option value="Library">Library</option>
                </>
              ) : null}
            </select>
            <br />

            {branch !== "Administration" && branch !== "Library" && (
              <div className="role-div">
                <input
                  type="radio"
                  id="teacher"
                  value="teacher"
                  onChange={() => setFormData({ ...formData, role: "teacher" })}
                  name="role"
                />
                <label for="teacher">Teacher</label>

                <input
                  type="radio"
                  id="student"
                  name="role"
                  value="student"
                  onChange={() => setFormData({ ...formData, role: "student" })}
                />
                <label for="student">Student</label>
              </div>
            )}

            <br />

            <button type="submit">Submit</button>
          </form>
          <p>
            Already have an account? <Link to="/signin">SignIn</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
});
export default connect(mapStateToProps, { registerUser, setAlert })(SignUpPage);
