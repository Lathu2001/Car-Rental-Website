import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerStyle = {
    backgroundColor: '#1e3a8a', // Dark Blue background
    color: '#fff',
    padding: '40px 20px',
    textAlign: 'left',
    marginTop: '10px',
  };

  const footerContentStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  };

  const sectionStyle = {
    flex: '1 1 200px',
    margin: '10px',
    textAlign: 'center'
  };

  const headingStyle = {
    textAlign: 'center', // Justify alignment for the heading
    marginBottom: '10px',
    fontSize: '1.2em',
    fontWeight: 'bold',
  };

  const textStyle = {
    margin: '5px 0',
    lineHeight: '1.6',
  };

  const socialLinksContainerStyle = {
    display: 'flex',
    justifyContent: 'center', // Center alignment for the container
    alignItems: 'center',
    flexDirection: 'column'
  };

  const socialLinkStyle = {
    margin: '0 10px',
  };

  const iconStyle = {
    width: '24px',
    height: '24px',
  };

  const footerBottomStyle = {
    marginTop: '20px',
    textAlign: 'center',
  };

  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        {/* About Us Section */}
        <div style={sectionStyle}>
          <h3 style={headingStyle}>About Us</h3>
          <p style={{textStyle, textAlign: 'justify'}}>Welcome to ISGA Holdings Pvt Ltd, your trusted partner in  car rental services.
          Based in the heart of Nuwara Eliya, we specialize in offering a wide range of vehicles to cater to all your travel needs.With years of experience in the industry, we take pride in providing top-notch service .
          At ISGA Holdings, customer satisfaction is our top priority. Whether you need a car for a few hours, a day, or an extended period, our flexible rental plans are designed to suit your schedule and budget.</p>
        </div>

        {/* Quick Links Section */}
        <div style={sectionStyle}>
          <h3 style={headingStyle}>Quick Links</h3>
          <p style={textStyle}><Link to="/about" style={{ color: '#fff' }}>About</Link></p>
          <p style={textStyle}><Link to="/cars" style={{ color: '#fff' }}>Car Listing</Link></p>
        </div>

        {/* Contact Details Section */}
        <div style={sectionStyle}>
          <h3 style={headingStyle}>Head Office</h3>
          <p style={textStyle}><i className="fa fa-map-marker"></i>  <a href='https://maps.app.goo.gl/CkrQhGsameiGocuZA' style={{ color: '#fff' }}>   : Nuwara Eliya, Sri Lanka</a></p>
          <p style={textStyle}><i className="fa fa-phone"></i>  : <a href="tel:+94777800060" style={{ color: '#fff' }}>+94-777-800060</a></p>
         {/* <p style={textStyle}> <i className="fa fa-phone"></i> : <a href="tel:+94706300000" style={{ color: '#fff' }}>+94-706-300000</a></p>*/}
          <p style={textStyle}> <i className="fa fa-phone"></i> : <a href="tel:+94706668666" style={{ color: '#fff' }}>+94-706-668666</a></p>
          <p style={textStyle}>  <i className="fa fa-envelope"></i> : <a href="mailto:Isgaholdings@gmail.com" style={{ color: '#fff' }}>Isgaholdings@gmail.com</a></p>
          <p style={textStyle}>  <i className="fa fa-clock"> </i>   : Monday to Saturday 8am - 8pm </p>
        </div>

        {/* Social Media Links Section */}
        <div style={sectionStyle}>
          <h3 style={headingStyle}>Follow Us</h3>
          <div style={socialLinksContainerStyle}>
            <a 
              href="https://www.facebook.com/Isgaholdings?mibextid=LQQJ4d"
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
            >
              <img
                src="https://th.bing.com/th/id/R.70ecfdd862bdc3fdbf5715085812f49e?rik=fDJPk4oWTEisvw&pid=ImgRaw&r=0"
                alt="Facebook"
                style={iconStyle}
              />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div style={footerBottomStyle}>
        <p style={textStyle}>
          &copy; {new Date().getFullYear()} ISGA Holdings PVT LTD. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
