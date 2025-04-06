import {
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
//import Login from "./pages/Login.jsx"
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from "./components/Footer/Footer.jsx";
//import Book from "./pages/Book.jsx";
//import AdminRegister from "./pages/AdminRegister.jsx";
//import AdminLogin from "./pages/AdminLogin.jsx";




function App() {
  return (
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Register" element={<Register/>} />


        </Routes>
        <Footer/>
        
      </BrowserRouter>
       
  );
}

export default App;