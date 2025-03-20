import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, setFormData } from "../../../Store/Slice/SuperAdminFormSlice";
import { globalsettingsPostAPIAuth, globalsettingsPutAPIAuth, globalsettingsGetAPIAuth } from "../../SuperAdminServices";
import { setSport } from "../../../Store/Slice/allMatchSlice";
import { getCreateNewMatchAPIAuth } from "../../../Services/Downlinelistapi";
import { toast } from "react-toastify";
import BannerModal from "../../../components/Modal/BannerModal";

const SuperAdminForm = () => {
  const formData = useSelector((state) => state.superAdminForm);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [image,setImage] = useState({
    file : [],
    url : []
});
   const { sport } = useSelector((state) => state.allMatch);
   const [bannerModal,setBannerModal] = useState(false);
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
        const response = await globalsettingsGetAPIAuth(`admin/getglobal?gameId=${sport}`);
        
        if (response.status === 200 && response.data && response.data.data) {
          const data = response.data?.data; // Adjust based on the structure
          console.log("Raw API response:", data);
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

    let updatedObj = {};

    for (let key in formData) {
      if (formData[key] !== undefined && formData[key] !== null && formData[key] !== '' ) {
        updatedObj[key] = formData[key];
      }
    }
    try {
      let response;
  
        response = await globalsettingsPutAPIAuth(
          `admin/updateGlobalSettings/${recordId}`,
          {...updatedObj,gameId : sport}
        );
      
      if (response.status === 200 && response.data) {
        const updatedData = response.data;
  
        // Filter out unwanted fields from the API response
        const expectedKeys = Object.keys(formData);
        const filteredUpdatedData = Object.keys(updatedData)
          .filter((key) => expectedKeys.includes(key))
          .reduce((obj, key) => {
            obj[key] = updatedData[key];
            return obj;
          }, {});
  
        // console.log("Filtered updated data:", );
        toast.success(response?.data?.message)
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
    <div className="md:mx-0 mx-2 sm:mt-3 mt-2">
      <div className="border border-gray-300 rounded-[5px] md:p-4 p-3 overflow-hidden bg-white">
        <form
          onSubmit={handleSubmit}
          className=""
        >
          <div className="flex justify-between">
            <div className=" rounded-md max-w-44">
              <select value={sport} onChange={handleSportChange} className="w-full text-[13px] border outline-none px-4 py-2 border-gray-300 rounded-[5px]">
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
            <div>
            <button type="button" className="bg-gradient-seablue text-[14px] px-4 rounded-md text-white font-bold py-2" onClick={(e)=>{
              e.stopPropagation()
              setBannerModal(true)
              }}>
                Add Banner
              </button>
            </div>
          </div>
          <div className="grid lg:grid-cols-5 md:grid-cols-4 grid-cols-2 md:gap-4 gap-2.5 mt-4">
            {Object.keys(formData).map((key) => (
              <div key={key} className="">
                <label className="text-lightblack text-[14px] capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </label>
                <input
                  type="text"
                  name={key}
                  value={formData[key] || ""} // Ensure the field is populated with data or empty
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 sm:h-[38px] h-[35px] mt-0.5 sm:text-[14px] text-[13px] text-gray-700 outline-none"
                  // placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
                />
                
              </div>
              
            ))}

            {/* Submit button */}
            <div className="lg:col-span-5 md:col-span-4 sm:col-span-2 col-span-2 flex justify-center items-center mt-3">
              <button
                type="submit"
                className="bg-gradient-seablue font-semibold text-sm text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            
            <button
              type="button"
              onClick={() => alert("Place Bet Allow Only In InPlay Mode")}
              className="bg-yellow-500 text-white sm:px-6 px-3 py-2 sm:text-[14px] text-[12px] font-semibold rounded hover:bg-yellow-600"
            >
              Place Bet Allow Only In InPlay Mode
            </button>
          </div>
        </form>
      </div>
    </div>
    {bannerModal && 
    <BannerModal 
    setImage={setImage}
    image={image}
    onCancel={()=>{
      setBannerModal(false)
      setImage({
        file:[],
        url:''
      })
    }}
      />
}
    </>

  );
};

export default SuperAdminForm;


