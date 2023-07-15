import { useContext, useEffect } from "react";
import { Context } from "../context/Context";
import NFTcard from "../components/NFTcard";

const Profile = () => {
  const { NFTs, setCurrentNFTpage, address, currentNFTpage, loading, refetch, allContractNfts } =
    useContext(Context);


    useEffect(()=>{
      refetch();
      console.log(allContractNfts);
    }, []);

  return (
    <>
      {address.length > 0 ? (
        <div className="flex ga-[20px] flex-col iems-center w-full justify-center">
          <div className="justify-center pt-[30px] align-middle text-center  ">
            <span className="text-[45px] font-poppins font-[600]  leading-1 text-center  w-full">
              Your NFTs
            </span>
          </div>
          <div className="justify-center select-none  pt-10 align-middle text-center w-full">
            <ul className="flex  w-full pb-2   justify-center">
              <li
                className={`font-semibold text-[18px] cursor-pointer px-[30px] py-[8px] ${
                  currentNFTpage == "All" ? "bg-green-500" : "bg-indigo-500"
                }  rounded-[5px]`}
                onClick={() => {
                  setCurrentNFTpage("All");
                }}
              >
                All
              </li>
              <span>_____________________________________</span>
              <li
                className={`font-semibold text-[18px] cursor-pointer px-[30px] py-[8px]  ${
                  currentNFTpage == "Listed" ? "bg-green-500" : "bg-indigo-500"
                }  rounded-[5px]`}
                onClick={() => {
                  setCurrentNFTpage("Listed");
                }}
              >
                Listed
              </li>
              <span>_____________________________________</span>
              <li
                className={`font-semibold text-[18px] cursor-pointer px-[30px] py-[8px]  ${
                  currentNFTpage == "Minted" ? "bg-green-500" : "bg-indigo-500"
                }  rounded-[5px]`}
                onClick={() => {
                  setCurrentNFTpage("Minted");
                }}
              >
                Minted
              </li>
            </ul>
          </div>
          <div className="flex gap-[100px] p-[50px] flex-wrap justify-center">
            {loading ? (
              <div className="w-full relative top-[30px] flex justify-center align-middle items-center">
                <span className="font-semibold text-[18px] cursor-pointer px-[30px] py-[8px] ">Loading...</span>
              </div>
            ) : (
              NFTs.map((el, i) => <NFTcard key={i} nft={el} />)
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-[80vh] w-full ">
          <span className="text-[25px] font-poppins font-semibold leading-1 text-center">
            Connect wallet to get list of NFTs you hold!
          </span>
        </div>
      )}
    </>
  );
};

export default Profile;
