import React, { useState, useEffect, lazy, Suspense } from "react";
import { HiUsers } from "react-icons/hi2";
import { FaUser } from "react-icons/fa6";
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { MdBedroomParent } from "react-icons/md";
import { IoBedSharp } from "react-icons/io5";
import { BsPersonFillAdd } from "react-icons/bs";
import { BsFillHouseAddFill } from "react-icons/bs";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import Avatar from "react-avatar";
import axios from "axios";
import AppointmentsPage from "../components/patientsComponents/appointmentsPage";
import BookAppointment from "../components/patientsComponents/BookAppointment";

// Lazy loading components
const Dashboard = lazy(() =>
  import("../components/patientsComponents/Patient-Dashboard")
);
const Patient = lazy(() => import("../components/AdminDashbordLinks/Patient"));
const Staff = lazy(() => import("../components/AdminDashbordLinks/Staff"));
const AddStaff = lazy(() =>
  import("../components/AdminDashbordLinks/AddStaff")
);
const AddRoom = lazy(() => import("../components/AdminDashbordLinks/AddRoom"));
const BedChecking = lazy(() =>
  import("../components/CommanComponents/BedChecking")
);

const PatientDashboard = () => {

  

  const savedActiveSection = localStorage.getItem("activeSection");
  const [activeSection, setActiveSection] = useState(
    savedActiveSection || "dashboard"
  );
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem("activeSection", activeSection);
  }, [activeSection]);
    const [user, setUser] = useState(null);

    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${localStorage.getItem("token")}`,
    };
 

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            `http://localhost:1000/api/v1/get-user-information`,
            { headers }
          );
          setUser(response.data.data);
        } catch (err) {
        } finally {
        }
      };

      fetchUser();
    }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard user={user} />;
      case "appointments":
        return <AppointmentsPage user={user} />;
      case "book-appointments":
        return <BookAppointment user={user} />;
      case "add-staff":
        return <AddStaff />;
      case "add-rooms":
        return <AddRoom />;
      case "check-bed-availability":
        return <BedChecking />;
      default:
        return <Dashboard />;
    }
  };

  const navigationItems = [
    { label: "Dashboard", icon: <TbLayoutDashboardFilled />, key: "dashboard" },
    { label: "My Appointments", icon: <FaUser />, key: "appointments" },
    { label: "Book Appointments", icon: <HiUsers />, key: "book-appointments" },
    { label: "Add Staff", key: "add-staff", icon: <BsPersonFillAdd /> },
    { label: "Add Rooms", icon: <BsFillHouseAddFill />, key: "add-rooms" },
    {
      label: "Check Beds Availability",
      icon: <IoBedSharp />,
      key: "check-bed-availability",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row  w-full h-[90vh] fixed">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-16" : "w-64"
        } bg-white shadow-md h-full transition-all duration-300 fixed lg:relative z-10`}
      >
        <div className="flex items-center justify-between p-4">
          <div
            className={`text-blue-500 font-semibold text-xl  flex text-center transition-opacity duration-300 ease-in-out `}
          >
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 rounded overflow-hidden">
                <Avatar
                  name={user?.name}
                  src={user?.avatarURL}
                  size="40"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`flex flex-col ${
                  isSidebarCollapsed ? " hidden" : "block"
                }`}
              >
                <p className="text-sm capitalize font-semibold ">
                  {user?.name}
                </p>
                <p className="text-xs capitalize text-gray-500 font-semibold">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1 text-white text-xl bg-blue-500 rounded-full absolute top-16 right-[-12px]  focus:outline-none"
          >
            {isSidebarCollapsed ? (
              <IoMdArrowDropright />
            ) : (
              <IoMdArrowDropleft />
            )}
          </button>
        </div>
        <nav>
          <ul
            className={`space-y-4 border-t-2 border-b-2 border-gray-100 ${
              isSidebarCollapsed ? "p-3" : "p-4"
            }`}
          >
            {navigationItems.map(({ label, icon, key }) => (
              <li
                key={key}
                role="button"
                aria-current={activeSection === key ? "page" : undefined}
                onClick={() => setActiveSection(key)}
                className={`flex items-center gap-2 text-gray-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-600 rounded cursor-pointer ${
                  activeSection === key ? "bg-blue-500 text-white" : ""
                } ${isSidebarCollapsed ? "p-3" : "p-2"}`}
              >
                {icon && <span className="text-lg">{icon}</span>}
                {!isSidebarCollapsed && label}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 shadow-inner">
        <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
          {renderContent()}
        </Suspense>
      </main>
    </div>
  );
};

export default PatientDashboard;
