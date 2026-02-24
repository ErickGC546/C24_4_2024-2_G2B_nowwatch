import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="nw-footer">
      <div className="nw-footer-bottom">
        <span>© {new Date().getFullYear()} NoWatch. Streaming sin límites.</span>
      </div>
    </footer>
  );
};

export default Footer;
