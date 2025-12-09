import React, { useState, useEffect } from "react";
import "../css/reports.css";
import { useNavigate } from "react-router-dom";
import {
  getAnchorageStayChargePorts,
  getAnchorageStayCharge,
} from "../services/apiSettings";
import StayCharge from "./StayCharge";
const AnchorageStayCharges = () => {
  const navigate = useNavigate();
  const Group = require("../assets/images/Reports.png");

//Raji 

const [formData, setFormData] = useState({
    comment1: "",
    comment2: "",
    comment3: ""
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };


  const validate = () => {
    const newErrors = {};
    if (!formData.comment1.trim()) {
      newErrors.comment1 = "Text area1 is required";
    }
    if (!formData.comment2.trim()) {
      newErrors.comment2 = "Text area2 is required";
    }
    if (!formData.comment3.trim()) {
      newErrors.comment3 = "Text area3 is required";
    }
    return newErrors;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      // Submit logic here, e.g. API call or sending data somewhere
      console.log("Form submitted:", formData);
      // maybe reset form
      setFormData({
        comment1: "",
        comment2: "",
        comment3: ""
      });
    }
  };

//Raji

  const [anchorageStayCharges, setAnchorageStayCharges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [openPopUp, setOpenPopUp] = useState(false);
  const fetchAnchorageStayChargePorts = async () => {
    try {
      setIsLoading(true);
      const response = await getAnchorageStayChargePorts();
      setAnchorageStayCharges(response?.ports);
      console.log(response, "response_fetchAnchorageStayChargePorts");
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch vendors", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnchorageStayChargePorts();
  }, []);



  useEffect(() => {
    console.log(anchorageStayCharges, "anchorageStayCharges");
  }, [anchorageStayCharges]);

  return (
    <>
      <div>
        <div className="charge">
          <div className="rectangle"></div>
          <div>
            <img src={Group}></img>
          </div>
        </div>
        <div>
          {anchorageStayCharges.map((port, index) => (
            <>
              <div
                onClick={() =>
                  navigate("/stay-charge", { state: { port: port } })
                }
              >
                <div key={port._id} className="jobreporrt mb-3">
                  {`${index + 1}. ${port.portName.toUpperCase()}`}
                </div>
              </div>
            </>
          ))}
        </div>
      </div>



      <form onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-12 mb-3 align-items-start">
          <label htmlFor="comment1" className="form-label">
            Text area1 <span className="required">*</span>:
          </label>
          <textarea
            name="comment1"
            className="form-control vessel-voyage"
            id="comment1"
            value={formData.comment1}
            onChange={handleChange}
            style={{ width: "100%", resize: "none" }}
          />
          {errors.comment1 && <span className="invalid">{errors.comment1}</span>}
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-3 align-items-start">
          <label htmlFor="comment2" className="form-label">
            Text area2 <span className="required">*</span>:
          </label>
          <textarea
            name="comment2"
            className="form-control vessel-voyage"
            id="comment2"
            value={formData.comment2}
            onChange={handleChange}
            style={{ width: "100%", resize: "none" }}
          />
          {errors.comment2 && <span className="invalid">{errors.comment2}</span>}
        </div>
      </div>

      <div className="row">
        <div className="col-12 mb-3 align-items-start">
          <label htmlFor="comment3" className="form-label">
            Text area3 <span className="required">*</span>:
          </label>
          <textarea
            name="comment3"
            className="form-control vessel-voyage"
            id="comment3"
            value={formData.comment3}
            onChange={handleChange}
            style={{ width: "100%", resize: "none" }}
          />
          {errors.comment3 && <span className="invalid">{errors.comment3}</span>}
        </div>
      </div>

      <div className="btnuser">
        <button type="submit" className="btn btna submit-button btnfsize">
          Submit
        </button>
      </div>
    </form>


       
    </>
   
  );
};

export default AnchorageStayCharges;
