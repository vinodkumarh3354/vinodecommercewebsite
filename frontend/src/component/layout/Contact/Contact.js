import React from "react";
import "./Contact.css";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
    <div className="contactContainer">
      <a className="mailBtn" href="mailto:hvinodkumar3354@gmail.com">
        <Button>Contact: hvinodkumar3354@gmail.com</Button>
      </a>
    </div>
  );
};

export default Contact;