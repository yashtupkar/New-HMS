import React, { useState, useEffect } from "react";
import Avatar from "react-avatar";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import toast from "react-hot-toast";
import { FaCaretDown } from "react-icons/fa";




const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hover, setHover] = useState(false); // State to track hover status

  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/api/v1/get-user-information`,
          { headers }
        );
        setUser(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const userId = localStorage.getItem("userId");
      console.log("User ID:", userId);

      if (!userId) {
        throw new Error("User not logged in");
      }

      // Remove user info from localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");

      dispatch(authActions.logout());


    
      navigate("/");
       window.location.reload();
       toast.success("Logout successful");
   
    } catch (error) {
      // Handle other errors (localStorage issues, etc.)
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
    
  };





  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="relative p-1 md:p-2 bg-gray-100 rounded-lg">
      {/* Avatar and hover card */}
      <div
        className="flex items-center space-x-3 cursor-pointer"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="w-10 h-10 rounded overflow-hidden">
          <Avatar
            name={user?.name}
            src={user?.profileImg}
            size="40"
            className=" object-cover"
          />
        </div>
        <div className="hidden md:flex flex-col ">
          <p className="text-sm capitalize font-semibold ">{user?.name}</p>
          <p className="text-xs capitalize text-gray-500 font-semibold">
            {user?.role}
          </p>
        </div>
        <div className="text-gray-500 hidden md:block">
          <FaCaretDown />
        </div>
      </div>

      {/* Hover card */}
      {hover && (
        <div
          className="absolute top-15 right-0 w-36 flex flex-col gap-1 bg-white shadow-lg rounded-md p-2 z-10"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => setHover(false)}
          // Ensure it’s on top
        >
          <Link
            to="/profile"
            className="text-sm flex items-center justify-start font-medium w-full text-gray-600 cursor-pointer p-2  hover:bg-gray-100 rounded"
          >
            My Profile
          </Link>
          <button
            onClick={() => {
              handleLogout();
            }}
            className="text-sm font-medium w-full flex items-center justify-start text-gray-600 cursor-pointer p-2  hover:bg-gray-100 rounded"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
