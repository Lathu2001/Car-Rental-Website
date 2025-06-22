import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import UserHeader from "./components/Header/UserHeader.jsx";
import AdminHeader from "./components/Header/AdminHeader.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer/Footer.jsx";
import AdminRegister from "./pages/AdminRegister.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx"; 
import EditCar from "./pages/EditCar.jsx";
import AddCar from "./pages/AddCar.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import UserReviews from "./pages/UserReviews.jsx";
import UserDetail from "./pages/UserDetails.jsx";
import AdminAccount from "./pages/AdminAccount.jsx";
import UserHome from "./pages/UserHome.jsx";
import Car from "./pages/Car.jsx";
import LoginUser from "./pages/loginuser.jsx";
import Success from "./pages/Success.jsx";
import EditUserAccount from "./pages/EditUserAccount.jsx";
import MyBookings from "./pages/MyBooking.jsx";
import AdminBookings from "./pages/AdminBooking.jsx";
import EditAdminDetail from "./pages/EditeAdminDetail.jsx";



function AppLayout() {
  const location = useLocation(); 

  const isUserPage =
    location.pathname.startsWith("/user-dashboard") ||
    location.pathname.startsWith("/user-about") ||
    location.pathname.startsWith("/user-home") ||
    location.pathname.startsWith("/book-car/")||
    location.pathname.startsWith("/booking")||
    location.pathname.startsWith("/success")||
    location.pathname.startsWith("/edit-user-account")||
    location.pathname.startsWith("/my-booking")||
    location.pathname.startsWith("/profile");

  const isAdminPage =
    location.pathname.startsWith("/admin-dashboard") ||
    location.pathname.startsWith("/admin-about") ||
    location.pathname.startsWith("/admin-home") ||
    location.pathname.startsWith("/add-car") ||
    location.pathname.startsWith("/edit-car") ||
    location.pathname.startsWith("/delete-car") ||
    location.pathname.startsWith("/User-Rewiews") ||
    location.pathname.startsWith("/account") ||
    location.pathname.startsWith("/All-bookings") ||
    location.pathname.startsWith("/edit-admin-detail") ||
    location.pathname.startsWith("/user-detail");

  return (
    <>
      {isUserPage ? <UserHeader /> : isAdminPage ? <AdminHeader /> : <Header />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/Car" element={<Car/>} />

        {/* Admin Routes (Uses AdminHeader) */}
        
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/add-car" element={<AddCar />} />
        <Route path="/edit-car/:carId" element={<EditCar />} />
        <Route path="/User-Rewiews" element={<UserReviews/>} />  
        <Route path="/account" element={<AdminAccount/>} /> 
        <Route path="/edit-admin-detail" element={<EditAdminDetail />} />
        <Route path="/user-detail" element={<UserDetail/>} /> 
        <Route path="/All-bookings" element={<AdminBookings/>} />



        {/* User Routes (Uses UserHeader) */}
        <Route path="/user-home" element={<UserHome/>} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/book-car/:carId" element={<BookingPage />} />
        <Route path="/profile" element={<LoginUser />} />
        <Route path="/success" element={<Success />} />  
        <Route path="/edit-user-account" element={<EditUserAccount/>} />    
        <Route path="/my-booking" element={<MyBookings/>} /> 

      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
