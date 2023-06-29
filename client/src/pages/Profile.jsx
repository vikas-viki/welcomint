import { useState } from "react";

const Profile = () => {
  const [NFTs, setNFTs] = useState("All NFTs");

  return (
    <div className="flex ga-[20px] flex-col iems-center w-full justify-center">
      <div className="justify-center mt-[30px] align-middle text-center w-full">
        <span className="text-[45px] font-poppins font-[600] leading-1 text-center  w-full">
          Your NFTs
        </span>
      </div>
      <div className="justify-center mt-10 align-middle text-center w-full">
        <ul className="flex gap-[20px] w-full border-b-4 border-orange-500 pb-2  top-[] justify-around">
          <li className="font-semibold text-[18px] px-[30px] py-[8px] bg-indigo-500 rounded-[5px]" onClick={()=>{setNFTs("All NFTs")}}>
            All
          </li>
          <li className="font-semibold text-[18px] px-[30px] py-[8px] bg-indigo-500 rounded-[5px]" onClick={()=>{setNFTs("Listed NFTs")}}>
            Listed
          </li>
          <li className="font-semibold text-[18px] px-[30px] py-[8px] bg-indigo-500 rounded-[5px]" onClick={()=>{setNFTs("Minted NFTs")}}>
            Minter
          </li>
        </ul>
      </div>
      <div>{NFTs}</div>
    </div>
  );
};

export default Profile;
