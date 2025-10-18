import { Link } from "react-router-dom";
import Logo from "../img/Logo.png"; 
export default function Navbar() {
  return (
    <nav>
      <Link to="/"> <img src={Logo} alt="Logo" style={{ height: 150 }} /></Link>
      <Link to="/about"><p>¿Cómo funciona?</p></Link>
      <Link to="/contact"><p>¿A dónde va el dinero?</p></Link>
    </nav>
  );
}