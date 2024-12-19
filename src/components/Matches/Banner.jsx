  import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBanner, deleteBanner, updateBanner, setBanners } from "../../Store/Slice/bannerSlice";
import { createNewMatchAPIAuth, getCreateNewMatchAPIAuth, putUpdateMatchAPIAuth, deleteData } from "../../Services/Newmatchapi";
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
const Banner = () => {
    const dispatch = useDispatch();
    const banners = useSelector((state) => state.banners.banners || []);  
  
    const [bannerUrl, setBannerUrl] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageTitle, setImageTitle] = useState(""); 
    const [editBanner, setEditBanner] = useState(null);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      const fetchBanners = async () => {
        try {
          const response = await getCreateNewMatchAPIAuth("admin/get-banner");
          dispatch(setBanners(response.data.data || []));  
        } catch (error) {
          console.error("Error fetching banners:", error);
        }
      };
  
      fetchBanners();
    }, [dispatch]);
  
    const handleImageSelect = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(file);
          setBannerUrl(reader.result);
          
          
          const fileName = file.name.replace(/\.[^/.]+$/, "");  
          setImageTitle(fileName);  
        };
        reader.readAsDataURL(file);
      }
    };
  
    // const handleAddBanner = async () => {
    //   if (selectedImage && imageTitle) {  
    //     setLoading(true);
    //     const formData = new FormData();
    //     formData.append("title", imageTitle); 
    //     formData.append("picture", selectedImage);
  
    //     try {
    //       const response = await createNewMatchAPIAuth("admin/banner-upload", formData);
  
    //       if (response && response.data && response.data.success === true) {
    //         const newBanner = response.data;
    //         dispatch(addBanner(newBanner)); 
    //         toast.success(response.data.message || "Image uploaded successfully!");
    //         setBannerUrl(""); 
    //         setSelectedImage(null); 
    //         setImageTitle(""); // Clear the title input after successful upload
    //       } else {
    //         toast.error("Error uploading banner: " + (response.data.message || "Unknown error"));
    //       }
    //     } catch (error) {
    //       console.error("Error adding banner:", error);
    //       toast.error("Error uploading banner!");
    //     } finally {
    //       setLoading(false);
    //     }
    //   } else {
    //     toast.error("Please select a file and make sure the title is set.");
    //   }
    // };
  
    const handleAddBanner = async () => {
        if (selectedImage && imageTitle) {
          setLoading(true);
          const formData = new FormData();
          formData.append("title", imageTitle); 
          formData.append("picture", selectedImage);
      
          try {
            const response = await createNewMatchAPIAuth("admin/banner-upload", formData);
      
            if (response && response.data && response.data.success === true) {
              const newBanner = response.data;
      
              // Immediately add the new banner to the state without waiting for a fetch
              dispatch(addBanner(newBanner)); 
      
              // Update the state to trigger the UI update
              toast.success(response.data.message || "Image uploaded successfully!");
      
              setBannerUrl(""); 
              setSelectedImage(null); 
              setImageTitle(""); // Clear the title input after successful upload
            } else {
              toast.error("Error uploading banner: " + (response.data.message || "Unknown error"));
            }
          } catch (error) {
            console.error("Error adding banner:", error);
            toast.error("Error uploading banner!");
          } finally {
            setLoading(false);
          }
        } else {
          toast.error("Please select a file and make sure the title is set.");
        }
      };
      
  
    const handleDeleteBanner = async (_id) => {
        try {
          const response = await deleteData(`admin/delete-banner/${_id}`, {});
          if (response && response.data && response.data.success === true) {
            // Dispatch delete action with _id to remove just the deleted banner
            dispatch(deleteBanner(_id));
            toast.success(response.data.message || "Banner deleted successfully!");
          } else {
            toast.error("Error deleting banner: " + (response.data.message || "Unknown error"));
          }
        } catch (error) {
          console.error("Error deleting banner:", error);
          toast.error("Error deleting banner!");
        }
      };
      
    const handleUpdateBanner = async () => {
      if (editBanner && selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
  
        try {
          const response = await putUpdateMatchAPIAuth(`admin/update-banner/${editBanner}`, formData);
          dispatch(updateBanner(response.data));
          setBannerUrl("");
          setSelectedImage(null);
          setEditBanner(null);
          toast.success("Banner updated successfully!");
        } catch (error) {
          console.error("Error updating banner:", error);
          toast.error("Error updating banner!");
        }
      }
    };
  
    return (
      <div className="p-4">
        <div className="flex mb-4 space-x-4">
          <input
            type="file"
            onChange={handleImageSelect}
            accept="image/*"
            className="border p-2 rounded w-1/4"
            disabled={loading}
          />
          <button
            onClick={handleAddBanner}
            className="bg-lightblue text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
  
        {bannerUrl && (
          <div className="mt-4">
            <img src={bannerUrl} alt="Selected Banner" className="w-full h-40 object-cover mb-2" />
          </div>
        )}
  
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-22 py-2">S.No</th>
                <th className="border px-4 py-2">Image</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.length > 0 ? (
                banners.map((banner, index) => {
                  const imageUrl = banner.imageUrl ? banner.imageUrl.replace(/\\/g, "/") : "";
                  return (
                    <tr key={banner._id}>
                      <td className="border px-2 py-2 text-center">{index + 1}</td>
                      <td className="border px-2 py-2 text-center">
                        {imageUrl ? (
                          <img src={imageUrl} alt="Banner" className="w-64 h-32 object-cover mx-auto" />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>
                      <td className="border px-4 py-2 text-center">
                        <button
                          onClick={() => {
                            setEditBanner(banner._id);
                            setBannerUrl(imageUrl);
                            setImageTitle(banner.title);  
                          }}
                          className="bg-yellow-500 text-white px-2 py-1 rounded mx-1"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner._id)}
                          className="bg-red-500 text-white px-2 py-1 rounded mx-1"
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">No banners found</td> 
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  export default Banner;
  
  
  
  // import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { addBanner, deleteBanner, updateBanner, setBanners } from "../../Store/Slice/bannerSlice";
// import { createNewMatchAPIAuth, getCreateNewMatchAPIAuth, putUpdateMatchAPIAuth, deleteData } from "../../Services/Newmatchapi";
// import { FaEdit, FaTrashAlt } from 'react-icons/fa';
// import { toast } from 'react-toastify';


// const Banner = () => {
//   const dispatch = useDispatch();
//   const banners = useSelector((state) => state.banners.banners || {});

//   const [bannerUrl, setBannerUrl] = useState("");
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [editBanner, setEditBanner] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchBanners = async () => {
//       try {
//         const response = await getCreateNewMatchAPIAuth("admin/get-banner");
//         dispatch(setBanners(response.data || {}));
//       } catch (error) {
//         console.error("Error fetching banners:", error);
//       }
//     };

//     fetchBanners();
//   }, [dispatch]);

//   const handleImageSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setSelectedImage(file);
//         setBannerUrl(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleAddBanner = async () => {
//     if (selectedImage) {
//       setLoading(true);
//       const formData = new FormData();
//       formData.append("title", "newpicture");
//       formData.append("picture", selectedImage);
  
//       try {
//         const response = await createNewMatchAPIAuth("admin/banner-upload", formData);
  
//         // Ensure the response structure is handled correctly
//         console.log("Added response:", response);
  
//         // Check if the response indicates success
//         if (response && response.data && response.data.success === true) {
//           const newBanner = response.data; // Extract the banner data
//           dispatch(addBanner(newBanner)); // Add the new banner to Redux
//           toast.success(response.data.message || "Image uploaded successfully!"); // Correct the toast message
//           setBannerUrl(""); // Clear the preview
//           setSelectedImage(null); // Clear the file input
//         } else {
//           // Handle cases where success is false or response is not as expected
//           toast.error("Error uploading banner: " + (response.data.message || "Unknown error"));
//         }
//       } catch (error) {
//         console.error("Error adding banner:", error);
//         toast.error("Error uploading banner!");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       toast.error("Please select a file before uploading.");
//     }
//   };
  
  
  
// const handleDeleteBanner = async (_id) => {
//     try {
//       const response = await deleteData(`admin/delete-banner/${_id}`, {});
  
//       // Debugging step: log the full response
//       console.log("Delete response:", response);
  
//       // Check if the response indicates success
//       if (response && response.data && response.data.success === true) {
//         dispatch(deleteBanner(_id)); // Update Redux
//         toast.success(response.data.message || "Banner deleted successfully!"); // Use message from response
//       } else {
//         // Handle cases where success is false or response is not as expected
//         toast.error("Error deleting banner: " + (response.data.message || "Unknown error"));
//       }
//     } catch (error) {
//       console.error("Error deleting banner:", error);
//       toast.error("Error deleting banner!");
//     }
//   };
  

//   const handleUpdateBanner = async () => {
//     if (editBanner && selectedImage) {
//       const formData = new FormData();
//       formData.append("image", selectedImage);

//       try {
//         const response = await putUpdateMatchAPIAuth(`admin/update-banner/${editBanner}`, formData);
//         dispatch(updateBanner(response.data));
//         setBannerUrl("");
//         setSelectedImage(null);
//         setEditBanner(null);
//         toast.success("Banner updated successfully!");
//       } catch (error) {
//         console.error("Error updating banner:", error);
//         toast.error("Error updating banner!");
//       }
//     }
//   };

//   return (
//     <div className="p-4">
//       <div className="flex mb-4 space-x-4">
//         <input
//           type="file"
//           onChange={handleImageSelect}
//           accept="image/*"
//           className="border p-2 rounded w-full"
//           disabled={loading}
//         />
//         <button
//           onClick={handleAddBanner}
//           className="bg-lightblue text-white px-4 py-2 rounded"
//           disabled={loading}
//         >
//           {loading ? 'Uploading...' : 'Upload'}
//         </button>
//       </div>

//       {bannerUrl && (
//         <div className="mt-4">
//           <img src={bannerUrl} alt="Selected Banner" className="w-full h-40 object-cover mb-2" />
//         </div>
//       )}

//       <div className="mt-6 overflow-x-auto">
//         <table className="min-w-full table-auto border-collapse">
//           <thead>
//             <tr>
//               <th className="border px-4 py-2">S.No</th>
//               <th className="border px-4 py-2">Image</th>
//               <th className="border px-4 py-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.keys(banners).length > 0 ? (
//               Object.keys(banners).map((key, index) => {
//                 const banner = banners[key];
//                 const imageUrl = banner.imageUrl.replace(/\\/g, "/");
//                 return (
//                   <tr key={banner._id}>
//                     <td className="border px-4 py-2 text-center">{index + 1}</td>
//                     <td className="border px-4 py-2 text-center">
//                       <img src={imageUrl} alt="Banner" className="w-32 h-20 object-cover mx-auto" />
//                     </td>
//                     <td className="border px-4 py-2 text-center">
//                       <button
//                         onClick={() => {
//                           setEditBanner(banner._id);
//                           setBannerUrl(imageUrl);
//                         }}
//                         className="bg-yellow-500 text-white px-2 py-1 rounded mx-1"
//                       >
//                         <FaEdit />
//                       </button>
//                       <button
//                         onClick={() => handleDeleteBanner(banner._id)}
//                         className="bg-red-500 text-white px-2 py-1 rounded mx-1"
//                       >
//                         <FaTrashAlt />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="3" className="text-center py-4">No banners found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Banner;




