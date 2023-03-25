import React, { Fragment, useState, useEffect } from "react";
import "./UpdatePassword.css";
import { useNavigate } from "react-router-dom";
import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { clearErrors, updatePassword } from "../../actions/userAction";
import { useAlert } from "react-alert";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstants";
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { CgEye } from "react-icons/cg";

const UpdatePassword = () => {
    
const dispatch = useDispatch();
const alert = useAlert();
const navigate = useNavigate();

const { error, isUpdated, loading } = useSelector((state) => state.profile);

const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [passwordShow, setPasswordShow] = useState("password");


const updatePasswordSubmit = (e) => {
  e.preventDefault();

  const myForm = new FormData();

  myForm.set("oldPassword", oldPassword);
  myForm.set("newPassword", newPassword); 
  myForm.set("confirmPassword", confirmPassword);

  dispatch(updatePassword(myForm));
};

useEffect(() => {

  if (error) {
    alert.error(error);
    dispatch(clearErrors());
  }
  if (isUpdated) {
    alert.success("Profile Updated Successfully");

    navigate("/account");
    dispatch({
      type: UPDATE_PASSWORD_RESET,
    });
  }
}, [dispatch, error, alert, isUpdated, navigate]);


  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title="Update Password" />
          <div className="updatePasswordContainer">
            <div className="updatePasswordBox">
              <h2 className="updatePasswordHeading">Update Profile</h2>
              <form
                className="updatePasswordForm"
                onSubmit={updatePasswordSubmit}
              >
                <div className="loginPassword">
                  <VpnKeyIcon />
                  <input
                    type={passwordShow}
                    placeholder="Old Password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <CgEye
                    className="eye"
                    onClick={(e) => {
                      passwordShow === "password"
                        ? setPasswordShow("text")
                        : setPasswordShow("password");
                    }}
                  />
                </div>
                <div className="loginPassword">
                  <LockOpenIcon />
                  <input
                    type={passwordShow}
                    placeholder="New Password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <CgEye
                    className="eye"
                    onClick={(e) => {
                      passwordShow === "password"
                        ? setPasswordShow("text")
                        : setPasswordShow("password");
                    }}
                  />
                </div>
                <div className="loginPassword">
                  <LockIcon />
                  <input
                    type={passwordShow}
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <CgEye
                    className="eye"
                    onClick={(e) => {
                      passwordShow === "password"
                        ? setPasswordShow("text")
                        : setPasswordShow("password");
                    }}
                  />
                </div>
                <input
                  type="submit"
                  value="Change Password"
                  className="updatePasswordBtn"
                />
              </form>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default UpdatePassword;
