import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setFormData } from "../../../Store/Slice/SuperAdminFormSlice";
import { globalsettingsPostAPIAuth, globalsettingsPutAPIAuth, globalsettingsGetAPIAuth } from "../../SuperAdminServices";
import { setSport } from "../../../Store/Slice/allMatchSlice";
import { getCreateNewMatchAPIAuth } from "../../../Services/Downlinelistapi";

const SuperAdminForm = () => {
  const formData = useSelector((state) => state.superAdminForm);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
   const { sport } = useSelector((state) => state.allMatch);
  const [recordId, setRecordId] = useState(null); // Store the ID from API response
  const [sportOptions,setSportsOptions] = useState([])


   useEffect(() => {
      const fetchSports = async () => {
        setLoading(true);
        try {
          const response = await getCreateNewMatchAPIAuth('games/getgames');
          if (response.status === 200) {
            setSportsOptions(response.data.data || []);
          }
        } catch (error) {
          console.error('Error fetching sports:', error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchSports();
    }, [dispatch, sport]);


    const handleSportChange = (e) => {
        const selectedSport = e.target.value;
        dispatch(setSport(selectedSport));
      };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching data...");
        const response = await globalsettingsGetAPIAuth("admin/getglobal");
        console.log("Raw API response:", response);
  
        if (response.status === 200 && response.data && response.data.data) {
          const data = response.data.data[0]; // Adjust based on the structure
          setRecordId(data?._id);
          console.log("Fetched data:", data);
  
          // Define the keys you expect in your formData
          const expectedKeys = [
            "oddsDelay", "oddsMinStake", "oddsMaxStake", "oddsMaxProfit",
            "sessionDelay", "sessionMinStake", "sessionMaxStake", "sessionMaxProfit",
            "bookDelay", "bookMinStake", "bookMaxStake", "bookMaxProfit",
            "tossDelay", "tossMinStake", "tossMaxStake", "tossMaxProfit",
            "casinoDelay", "casinoMinStake", "casinoMaxStake", "casinoMaxProfit",
            "oddsBetSlips", "bookmarkerBetSlips", "sessionBetSlips",
            "tossBetSlips", "casinoBetSlips",
          ];
  
          // Filter out unwanted fields from the API response
          const filteredData = data && Object?.keys(data)
            .filter((key) => expectedKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = data[key] || "";
              return obj;
            }, {});
  
          console.log("Filtered Data:", filteredData);
          dispatch(setFormData(filteredData));
          console.log("Data dispatched successfully");
        } else {
          console.error("Unexpected response structure:", response);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [dispatch]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data before submission:", formData);
  
    try {
      let response;
  
      if (recordId) {
        response = await globalsettingsPutAPIAuth(
          `admin/updateGlobalSettings/${recordId}`,
          formData
        );
      } else {
        response = await globalsettingsPostAPIAuth(
          "admin/createGlobalSettings",
          formData
        );
      }
  
      if (response.status === 200 && response.data) {
        alert("Form submitted successfully!");
  
        const updatedData = response.data;
  
        // Filter out unwanted fields from the API response
        const expectedKeys = Object.keys(formData);
        const filteredUpdatedData = Object.keys(updatedData)
          .filter((key) => expectedKeys.includes(key))
          .reduce((obj, key) => {
            obj[key] = updatedData[key];
            return obj;
          }, {});
  
        console.log("Filtered updated data:", filteredUpdatedData);
  
        // Update the Redux state with the filtered data
        dispatch(setFormData({ ...formData, ...filteredUpdatedData }));
  
        if (!recordId && updatedData._id) {
          setRecordId(updatedData._id);
        }
      } else {
        alert("Failed to submit the form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateField({ name, value }));
  };

  // Show loading state until data is fetched
  if (loading) {
    return <div className="text-center text-lg">Loading form data...</div>;
  }

  return (
    <>
    <div className="border border-slate-500 rounded-md max-w-44 p-2 ">
      <select value={sport} onChange={handleSportChange} className="w-full">
        <option>
          Select Sport
        </option>
        {sportOptions.map((sportOption)=>(
          <option key={sportOption.id} value={sportOption.gameId}>
            {sportOption.name}
          </option>
        ))}
      </select>
    </div>
        <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-4 space-y-6 bg-white shadow-md rounded"
    >
      <div className="grid grid-cols-4 gap-4">
        {Object.keys(formData).map((key) => (
          <div key={key} className="col-span-1">
            <label className="block text-gray-700 text-lg font-bold mb-2 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="text"
              name={key}
              value={formData[key] || ""} // Ensure the field is populated with data or empty
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
              placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
            />
            
          </div>
          
        ))}

<div className="col-span-1"></div>

{/* Submit button */}
<div className="col-span-1 flex items-end">
         
        <button
          type="submit"
          className="bg-lightblue text-white px-4 py-2 rounded hover:bg-lightblue w-1/2"
        >
          Submit
        </button>
      </div>
      </div>

      <div className="flex justify-between items-center">
        
        <button
          type="button"
          onClick={() => alert("Place Bet Allow Only In InPlay Mode")}
          className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
        >
          Place Bet Allow Only In InPlay Mode
        </button>
      </div>
    </form>
    </>

  );
};

export default SuperAdminForm;


