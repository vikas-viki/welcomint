import { useContext } from "react";
import { Context } from "../context/Context.jsx";
import NFTcard from "../components/NFTcard.jsx";


const Home = () => {
  const { allContractNfts, loading, address } = useContext(Context);
  return (
    <div className="w-full h-full px-[30px] bg-slate-200 py-[2.5em] flex flex-col gap-[30px] justify-start">
      {address.length > 0 ? (
        <>
          <div className=" flex flex-wrap gap-[60px] justify-start w-full h-full">
            {loading == true ? (
              <div className="w-full relative top-[30px] flex justify-start align-middle items-center">
                <span className="font-semibold text-[18px] cursor-pointer px-[30px] py-[8px] ">
                  Loading...
                </span>
              </div>
            ) : (
              allContractNfts?.map((el, i) => (
                <NFTcard key={i} nft={el} buy={true} />
              ))
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-[80vh] w-full ">
          <span className="text-[25px] font-poppins font-semibold leading-1 text-center">
            Connect wallet to see awesome list of NFTS!
          </span>
        </div>
      )}
    </div>
  );
};

export default Home;
