import React, { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { updateField } from "../../Store/Slice/editStakeSlice";
import { putUpdateMatchAPIAuth } from "../../Services/Newmatchapi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditStakeModal = ({ onCancel, onSubmit, match,fetchMatches }) => {
  console.log(match);
  const dispatch = useDispatch();

  // Local state for form values
  const [formValues, setFormValues] = useState({
    oddsDelay: "",
    oddsMinStake: "",
    oddsMaxStake: "",
    oddsMaxProfit: "",
    sessionDelay: "",
    sessionMinStake: "",
    sessionMaxStake: "",
    sessionMaxProfit: "",
    bookDelay: "",
    bookMinStake: "",
    bookMaxStake: "",
    bookMaxProfit: "",
    tossDelay: "",
    tossMinStake: "",
    tossMaxStake: "",
    tossMaxProfit: "",
  });

  const inputRefs = useRef({});

  // Pre-populate form values with match data when the modal opens
  useEffect(() => {
    if (match) {
      setFormValues({
        oddsDelay: match.oddsDelay || "",
        oddsMinStake: match.oddsMinStake || "",
        oddsMaxStake: match.oddsMaxStake || "",
        oddsMaxProfit: match.oddsMaxProfit || "",
        sessionDelay: match.sessionDelay || "",
        sessionMinStake: match.sessionMinStake || "",
        sessionMaxStake: match.sessionMaxStake || "",
        sessionMaxProfit: match.sessionMaxProfit || "",
        bookDelay: match.bookDelay || "",
        bookMinStake: match.bookMinStake || "",
        bookMaxStake: match.bookMaxStake || "",
        bookMaxProfit: match.bookMaxProfit || "",
        tossDelay: match.tossDelay || "",
        tossMinStake: match.tossMinStake || "",
        tossMaxStake: match.tossMaxStake || "",
        tossMaxProfit: match.tossMaxProfit || "",
      });
    }
  }, [match]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    dispatch(updateField({ name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!match || !match._id) {
      toast.error("Match ID is missing.", { position: "top-center" });
      return;
    }

    const payload = { ...formValues };

    try {
      const response = await putUpdateMatchAPIAuth(
        `match/updatematch/${match._id}`,
        payload
      );

      if (response.status === 200) {
        toast.success("Stake updated successfully!", {
          position: "top-center",
        });
        fetchMatches()
        onSubmit(); // Trigger parent update callback
        onCancel(); // Close modal
      } else {
        toast.error("Failed to update stake. Please try again.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error updating stake:", error);
      toast.error("An error occurred while updating the stake.", {
        position: "top-center",
      });
    }
  };

  const handleKeyDown = (e, fieldName) => {
    const keys = {
      ArrowDown: () => moveFocus("down", fieldName),
      ArrowUp: () => moveFocus("up", fieldName),
      ArrowLeft: () => moveFocus("left", fieldName),
      ArrowRight: () => moveFocus("right", fieldName),
    };

    if (keys[e.key]) {
      keys[e.key]();
    }
  };

  const moveFocus = (direction, currentField) => {
    const fieldNames = Object.keys(formValues);
    const currentIndex = fieldNames.indexOf(currentField);
    let nextIndex = currentIndex;

    if (direction === "down" && currentIndex + 2 < fieldNames.length) {
      nextIndex = currentIndex + 2;
    } else if (direction === "up" && currentIndex - 2 >= 0) {
      nextIndex = currentIndex - 2;
    } else if (direction === "left" && currentIndex % 2 !== 0) {
      nextIndex = currentIndex - 1;
    } else if (
      direction === "right" &&
      currentIndex % 2 === 0 &&
      currentIndex + 1 < fieldNames.length
    ) {
      nextIndex = currentIndex + 1;
    }

    if (inputRefs.current[fieldNames[nextIndex]]) {
      inputRefs.current[fieldNames[nextIndex]].focus();
    }
  };

  console.log('matchmatchmatchmatch',match)
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-start justify-center bg-gray-500 bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-[700px] mt-0 p-4 shadow-lg">
        {/* Header */}
        {/* <div className="bg-gray-100 p-3 rounded-t-lg flex justify-end items-center"> */}

        {/* </div> */}

        {/* Heading */}
        <div className="overflow-y-auto">
          <div className="flex justify-between">
            <h2 className="text-gray-800 text-lg font-semibold">Edit Stake</h2>
            <IoClose
              onClick={onCancel}
              className="cursor-pointer text-gray-600 text-2xl"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3 mt-4">
            {Object.keys(formValues).map((field) => (
              <div key={field} className="space-y-1">
                <label className="block items-center text-xs font-custom text-black">
                  {field.replace(/([A-Z])/g, " $1").toUpperCase()}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formValues[field]}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, field)}
                  ref={(el) => (inputRefs.current[field] = el)}
                  className="w-full p-1.5 border border-gray-300 rounded-md text-sm"
                />
              </div>
            ))}
          </form>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded-lg text-gray-800 hover:bg-gray-400 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-4 py-2 bg-lightblue text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStakeModal;
