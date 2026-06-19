import { useState } from "react";
import "../index.css";

export const RegistrationForm = () => {


  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [message, setMessage] = useState("");
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "businessName":
        setBusinessName(value);
        break;
      case "message":
        setMessage(value);
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      firstName,
      lastName,
      email,
      businessName,
      message,
    };

    try {
      const res = await fetch("http://localhost:5000/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Failed to submit");
        return;
      }

      alert("Submitted successfully!");
      window.location.href = "/admin";
    } catch (err) {
      console.error(err);
      alert("Network error. Is the backend running?");
    }
  };


  return (
    <>
    <form onSubmit={handleFormSubmit} >
      <div className="container">
        <h1>Sign Up</h1>
        <p>Please fill in this form to create an account</p>

        <label htmlFor="firstName">
          <b>First Name</b>
        </label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          placeholder="Enter first name"
          required
          value={firstName}
          onChange={handleInputChange}
          
        />

        <label htmlFor="lastName">
          <b>Last Name</b>
        </label>
        <input
          id="lastName"
          type="text"
          name="lastName"
          placeholder="Enter last name"
          required
          value={lastName}
          onChange={handleInputChange}
          
        />

        <label htmlFor="email">
          <b>Email</b>
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter email"
          name="email"
          required
          value={email}
          onChange={handleInputChange}
          
        />

        <label htmlFor="businessName">
          <b>Business Name</b>
        </label>
        <input
          id="businessName"
          type="text"
          name="businessName"
          placeholder="Enter business name"
          required
          value={businessName}
          onChange={handleInputChange}
          
        />

        <label htmlFor="message">
          <b>Message</b>
        </label>
        <input
          id="message"
          type="text"
          name="message"
          placeholder="Message"
          required
          value={message}
          onChange={handleInputChange}
        />

        <p>
          By creating an account you agree to our
          <a href="/" style={{ color: "dodgerblue" }}>
            Terms & Privacy
          </a>
        </p>

       
        <div className="clearfix">
          <button type="submit" className="btn" >
            Sign Up
          </button>
        </div>
      </div>
    </form>

    <section
    className="summary"
    style={{ textAlign: "center", marginTop: "30px"}}
    >
      <p>
        Hello, my name is 
        <span>
          {firstName} {lastName}
        </span>
        My email address is <span>{email}</span> & my bussiness name is
        <span>{businessName}</span>
      </p>

    </section>
   </> 
  );
};

