import { useDispatch, useSelector } from "react-redux";
import { openDialog } from "../../Store/Slice/AddClientButtonSlice"; // Import Redux actions
import AddClientForm from "../../components/Forms/AddClientForm";
import { AiOutlineUserAdd } from "react-icons/ai";
import { RiResetLeftLine } from "react-icons/ri";
import { useEffect } from "react";

const AddClient = () => {
  const dispatch = useDispatch();
  const isDialogOpen = useSelector((state) => state.client.isDialogOpen);

  useEffect(() => {
    if (isDialogOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => document.body.classList.remove("overflow-hidden");
  }, [isDialogOpen]);

  const handleOpenDialog = () => dispatch(openDialog());

  return (
    <div className="flex justify-end items-center gap-2 mb-2">
      <button
        onClick={handleOpenDialog}
        className="py-2 px-4 h-12 bg-white text-black rounded border border-black flex items-center gap-2 hover:bg-gray-200"
      >
        <AiOutlineUserAdd />
        Add Client
      </button>

      <button className="py-2 px-4 h-12 bg-white text-black rounded border border-black flex items-center gap-2 hover:bg-gray-200">
        <RiResetLeftLine />
        Reset
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto w-full max-w-md">
            <AddClientForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default AddClient;
