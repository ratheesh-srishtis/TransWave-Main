import React, { useState, useEffect } from "react";
import "../../css/profile.css";
import { Tabs, Tab, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import {
  getEmployeeChangedDetails,
  acceptEmployeeChanges,
  rejectEmployeeChanges,
} from "../../services/apiSettings";
import { useLocation } from "react-router-dom";

import PopUp from "../../pages/PopUp";
import Loader from "../../pages/Loader";
import { useAuth } from "../../context/AuthContext";
import { getAllDesignations } from "../../services/apiEmployee";
const ViewEmployeeDetails = () => {
  const { loginResponse } = useAuth();
  console.log(loginResponse, "loginResponse_profile");
  const navigate = useNavigate();

  const location = useLocation();
  const emp = location.state;
  console.log("Employee data from navigation state:", emp);

  const [isLoading, setIsLoading] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);
  const [message, setMessage] = useState("");
  const [employeeData, setEmployeeData] = useState("");

  const fetchProfileDetails = async () => {
    let payload = {
      changeId: emp?._id,
    };
    try {
      setIsLoading(true);
      const response = await getEmployeeChangedDetails(payload);
      console.log("fetchProfileDetails:", response);
      setEmployeeData(response?.employeeDetails[0]);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch customers", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, []);
  // State for all editable fields
  const [formData, setFormData] = useState({
    passportDetails: [],
    contractDetails: [],
    visaDetails: [],
    licenseDetails: [],
    medicalRecordDetails: [],
    certificationDetails: [],
  });
  useEffect(() => {
    if (!employeeData) return;
    console.log(employeeData, "employeeData");
    const {
      passportDetails = [],
      contractDetails = [],
      visaDetails = [],
      licenseDetails = [],
      medicalRecordDetails = [],
      certificationDetails = [],
      ...rest
    } = employeeData;

    setFormData({
      ...rest,
      passportDetails,
      contractDetails,
      visaDetails,
      licenseDetails,
      medicalRecordDetails,
      certificationDetails,
    });
  }, [employeeData]);
  const [desiginationlist, setDesiginations] = useState([]);

  const fetchAllDesignations = async () => {
    let listdesiginations = await getAllDesignations();
    setDesiginations(listdesiginations?.designations || []);
  };
  useEffect(() => {
    fetchAllDesignations();
  }, []);

  const BASE_URL = `${process.env.REACT_APP_ASSET_URL}`;

  const handleView = (url) => {
    console.log("Viewing file at URL:", `${BASE_URL}${url}`);
    window.open(`${BASE_URL}${url}`, "_blank");
  };

  // Update button handler
  const handleApprove = async () => {
    let payload = {
      changeId: emp?._id,
    };
    const response = await acceptEmployeeChanges(payload);
    console.log("Update Response:", response);
    if (response?.status == true) {
      setIsLoading(false);
      setMessage("Employee details updated successfully!");
      setOpenPopUp(true);
      fetchProfileDetails();
    } else {
      setIsLoading(false);
      setMessage("Failed to update Employee details. Please try again.");
      setOpenPopUp(true);
      fetchProfileDetails();
      navigate("/employee-details-modifications");
    }
  };
  const handleReject = async () => {
    let payload = {
      changeId: emp?._id,
    };
    const response = await rejectEmployeeChanges(payload);
    console.log("Update Response:", response);
    if (response?.status == true) {
      setIsLoading(false);
      setMessage("Employee details updated successfully!");
      setOpenPopUp(true);
    } else {
      setIsLoading(false);
      setMessage("Failed to update Employee details. Please try again.");
      setOpenPopUp(true);
    }
  };

  const handleClosePopup = () => {
    setOpenPopUp(false);
    navigate("/employee-details-modifications"); // ✅ navigate after close
  };

  return (
    <>
      <div className="container home-container">
        {/* Toggle button and view/edit logic */}
        <React.Fragment>
          <>
            <form className="profile-form">
              {/* Personal Information */}
              <div className="row">
                <div className="section-title">Personal Information</div>

                <div className="">
                  <label>First Name : </label>
                  <span>{formData.employeeName}</span>
                </div>
                <div className="">
                  <label>Last Name : </label>
                  <span>{formData.employeeLastName}</span>
                </div>
                <div className="">
                  <label>Date of Birth : </label>
                  <span>{formData.dob}</span>
                </div>
                <div className="col-md-6 mb-3">
                  <label>Address</label>
                  <span>{formData.address}</span>
                </div>

                <div>
                  <label>City :</label>
                  <span>{formData.city}</span>
                </div>
                <div>
                  <label>State :</label>
                  <span>{formData.state}</span>
                </div>
                <div>
                  <label>Post Code :</label>
                  <span>{formData.postcode}</span>
                </div>
                <div>
                  <label>Nationality :</label>
                  <span>{formData.nationality}</span>
                </div>

                <div>
                  <label>Contact Number :</label>
                  <span>{formData.contactNumber}</span>
                </div>

                <div>
                  <label>Email ID :</label>
                  <span>{formData.email}</span>
                </div>

                <div>
                  <label>Passport Number :</label>
                  <span>{formData.passportNumber}</span>
                </div>

                <div>
                  <label>Civil ID :</label>
                  <span>{formData.iqamaNumber}</span>
                </div>
              </div>

              {/* Official Information */}
              <div className="row">
                <div className="section-title mt-4">Official Information</div>

                <div className="col-md-4 mb-3">
                  <label>Date of Joining :</label>
                  <span>{formData.dateOfJoining}</span>
                </div>
                <div className="col-md-4 mb-3">
                  <label>Desigination :</label>
                  <span>
                    {desiginationlist.find(
                      (d) => d._id === formData.designation
                    )?.designationName || ""}
                  </span>
                </div>

                <div className="col-md-4 mb-3">
                  <label>Email ID :</label>
                  <span>{formData.officialEmail}</span>
                </div>

                <div className="col-md-4 mb-3">
                  <label>Profession Title :</label>
                  <span>{formData.profession}</span>
                </div>
              </div>

              {/* Passport Details */}
              {formData.passportDetails.map((item, idx) => (
                <div className="row align-items-end" key={idx}>
                  <div className="section-title mt-4">Passport Details</div>

                  <div className="col-md-4 mb-3">
                    <label>Passport Number :</label>
                    <span>{item.passportNumber}</span>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Date of Expiry :</label>
                    <span>{item.dateOfExpiry}</span>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Uploaded Files</label>
                    {item.document?.url && (
                      <div className="uploaded-file">
                        <span>{item.document.originalName}</span>
                        <i
                          className="bi bi-eye invoiceeyee"
                          onClick={() => handleView(item.document?.url)}
                        ></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Contract Details */}
              {formData.contractDetails.map((item, idx) => (
                <div className="row align-items-end" key={idx}>
                  <div className="section-title mt-4">Contract Details</div>

                  <div className="col-md-4 mb-3">
                    <label>Contract Name :</label>
                    <span>{item.contractName}</span>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Date of Expiry :</label>
                    <span>{item.dateOfExpiry}</span>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Uploaded Files</label>
                    {item.document?.url && (
                      <div className="uploaded-file">
                        <span>{item.document.originalName}</span>
                        <i
                          className="bi bi-eye invoiceeyee"
                          onClick={() => handleView(item.document?.url)}
                        ></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Visa Details */}
              {formData.visaDetails.map((item, idx) => (
                <div className="row align-items-end" key={idx}>
                  <div className="section-title mt-4">Visa Details</div>

                  <div className="col-md-4 mb-3">
                    <label>Visa Number :</label>
                    <span>{item.visaNumber}</span>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Date of Expiry :</label>
                    <span>{item.dateOfExpiry}</span>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Uploaded Files</label>
                    {item.document?.url && (
                      <div className="uploaded-file">
                        <span>{item.document.originalName}</span>
                        <i
                          className="bi bi-eye invoiceeyee"
                          onClick={() => handleView(item.document?.url)}
                        ></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* License Details */}
              {formData.licenseDetails.map((item, idx) => (
                <div className="row align-items-end" key={idx}>
                  <div className="section-title mt-4">License Details</div>

                  <div className="col-md-4 mb-3">
                    <label>License Number :</label>
                    <span>{item.licenseNumber}</span>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Date of Expiry :</label>
                    <span>{item.dateOfExpiry}</span>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label>Uploaded Files</label>
                    {item.document?.url && (
                      <div className="uploaded-file">
                        <span>{item.document.originalName}</span>
                        <i
                          className="bi bi-eye invoiceeyee"
                          onClick={() => handleView(item.document?.url)}
                        ></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Certificate Details */}
              <div className="section-title mt-4">Certificate Details </div>
              {formData.certificationDetails.map((item, idx) => (
                <div className="row align-items-end" key={idx}>
                  <div className="col-md-4 mb-3">
                    <label>Certificate Name :</label>
                    <span>{item.certification}</span>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Certificate Description :</label>
                    <span>{item.certificateDescription}</span>
                  </div>

                  <div className="col-md-4 mb-3 d-flex align-items-center">
                    <div>
                      <label>Uploaded Files</label>
                      {item.document?.url && (
                        <div className="uploaded-file">
                          <span>{item.document.originalName}</span>
                          <i
                            className="bi bi-eye invoiceeyee"
                            onClick={() => handleView(item.document?.url)}
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Medical Details */}
              <div className="section-title mt-4">Medical Details </div>
              {formData.medicalRecordDetails.map((item, idx) => (
                <div className="row align-items-end" key={idx}>
                  <div className="col-md-4 mb-3">
                    <label>Description :</label>
                    <span>{item.description}</span>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label>Relationship :</label>
                    <span>{item.relationship}</span>
                  </div>

                  <div className="col-md-4 mb-3 d-flex align-items-center">
                    <div>
                      <label>Uploaded Files</label>
                      {item.document?.url && (
                        <div className="uploaded-file">
                          <span>{item.document.originalName}</span>
                          <i
                            className="bi bi-eye invoiceeyee"
                            onClick={() => handleView(item.document?.url)}
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </form>

            <div className="button-row">
              <button className="approve-btn" onClick={handleApprove}>
                Approve
              </button>
              <button className="reject-btn" onClick={handleReject}>
                Reject
              </button>
            </div>
          </>
        </React.Fragment>
      </div>
      {openPopUp && <PopUp message={message} closePopup={handleClosePopup} />}{" "}
      <Loader isLoading={isLoading} />
    </>
  );
};

export default ViewEmployeeDetails;
