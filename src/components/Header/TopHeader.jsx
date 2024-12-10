const TopHeader = () => {
    return (
      <div className="w-full bg-NavyBlue text-white py-6 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="text-xl font-bold ml-8 pl-2">SPEXCH</div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-LightGreen px-2 py-1 rounded text-sm">WHITE_LABEL</span>
          <span>Lvit</span>
          <span>IRP 0</span>
          <button className="hover:underline">Logout</button>
        </div>
      </div>
    );
  };
  
  export default TopHeader;
  