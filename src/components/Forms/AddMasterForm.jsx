import { saveMaster } from "../../Store/Slice/masterSlice";
import CommonForm from "./CommonForm";

const AddMasterForm = () => {
  const handleSubmit = async (formData) => {
    await saveMaster(formData); 
  };

  return (
    <CommonForm formType="master" formTitle="Add Master" onSubmit={handleSubmit} />
  );
};

export default AddMasterForm;
