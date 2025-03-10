
import React, { useEffect, useState } from "react";
import axios from "axios";
import DoctorCard from "../patientsComponents/DoctorCard";

const AllDoctor = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filters, setFilters] = useState({
    specialty: "",
    location: "",
    rating: "",
  });
  const apiUrl = process.env.REACT_APP_API_BASE_URL;

  // Fetch doctors with pagination and filters
  useEffect(() => {
    const fetchDoctors = async () => {
      const params = {
      
        ...filters, // Including filters in the API request
      };
      try {
        const response = await axios.get(`${apiUrl}/api/v1/get-doctor-data`, {
          params,
        });
        setData(response.data.doctors);
      } catch (err) {
        console.error("Error fetching doctors", err);
      }
    };

    fetchDoctors();
  }, [filters]);

   useEffect(() => {
     const applyFilters = () => {
       let tempData = [...data];

       if (filters.specialty) {
         tempData = tempData.filter((doctor) =>
           doctor.specialization
             ? doctor.specialization
                 .toLowerCase()
                 .includes(filters.specialty.toLowerCase())
             : false
         );
       }

       if (filters.location) {
         tempData = tempData.filter((doctor) =>
           doctor.address
             ? doctor.location
                 .toLowerCase()
                 .includes(filters.location.toLowerCase())
             : false
         );
       }

       if (filters.rating) {
         tempData = tempData.filter(
           (doctor) => doctor.rating >= parseFloat(filters.rating)
         );
       }

       setFilteredData(tempData);
     };
     applyFilters();
   }, [filters, data]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };



  return (
    <div className=" flex flex-col md:flex-row gap-2  px-4 pt-2 md:pt-10 bg-gray-50">
      <div className="w-full md:w-2/6 h-fit md:h-screen md:p-4 flex flex-col gap-4">
        <h1 className="text-2xl md:text-3xl hidden md:block font-semibold text-blue-600 text-center">
          Best Doctors in India
        </h1>
        <p className="text-lg text-gray-500 font-medium text-center flex flex-col items-center  md:mt-6 mb-4 md:mb-10">
          Results: {filteredData?.length || 0}
          <div className="flex flex-wrap gap-2 md:flex-col md:space-y-4 mt-3">
            <select
              name="specialty"
              value={filters.specialty}
              onChange={handleFilterChange}
              className="md:px-4 px-2 py-1 md:py-2 text-sm md:text-base border rounded-md"
            >
              <option value="">Select Specialty</option>
              <option value="cardiologist">Cardiologist</option>
              <option value="dermatologist">Dermatologist</option>
              <option value="neurologist">Neurologist</option>
              <option value="orthopedic">Orthopedic</option>
              <option value="pediatrician">Pediatrician</option>
              <option value="gynecologist">Gynecologist</option>
              <option value="psychiatrist">Psychiatrist</option>
              <option value="endocrinologist">Endocrinologist</option>
              <option value="surgeon">Surgeon</option>
              <option value="radiologist">Radiologist</option>
              <option value="urologist">Urologist</option>
              <option value="dentist">Dentist</option>
              <option value="ent-specialist">ENT Specialist</option>
              <option value="ophthalmologist">Ophthalmologist</option>
              <option value="nephrology">Nephrologist</option>
              <option value="pulmonologist">Pulmonologist</option>
              <option value="gastroenterologist">Gastroenterologist</option>
              <option value="oncologist">Oncologist</option>
              <option value="dermatology">Dermatology</option>
              <option value="pathologist">Pathologist</option>
              <option value="rheumatologist">Rheumatologist</option>
              <option value="physiotherapist">Physiotherapist</option>
              <option value="cardiothoracic-surgeon">
                Cardiothoracic Surgeon
              </option>
              <option value="obstetrician">Obstetrician</option>
              <option value="general-practitioner">General Practitioner</option>

              <option value="gastro-surgeon">Gastro Surgeon</option>
              <option value="cosmetic-surgeon">Cosmetic Surgeon</option>
              <option value="vascular-surgeon">Vascular Surgeon</option>
              <option value="plastic-surgeon">Plastic Surgeon</option>
              <option value="geriatrician">Geriatrician</option>
              <option value="sleep-specialist">Sleep Specialist</option>
            </select>

            <select
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="md:px-4 px-2 py-1 md:py-2  text-sm md:text-base border rounded-md"
            >
              <option value="">Select Location</option>
              <option value="delhi">Delhi</option>
              <option value="mumbai">Mumbai</option>
              <option value="bangalore">Bangalore</option>
              <option value="kolkata">Kolkata</option>
              {/* Add more locations */}
            </select>

            {/* <select
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              className="px-4 py-2 text-sm md:text-base border rounded-md"
            >
              <option value="">Select Rating</option>
              <option value="4">4 & above</option>
              <option value="4.5">4.5 & above</option>
              <option value="5">5 only</option>
            </select> */}
          </div>{" "}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredData &&
          filteredData.map((doctor, i) => <DoctorCard key={i} data={doctor} />)}
      </div>
    </div>
  );
};

export default AllDoctor;

