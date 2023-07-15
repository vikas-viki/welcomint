import { useContext } from "react";
import { Context } from "../context/Context.jsx";
import NFTcard from "../components/NFTcard.jsx";

const Home = () => {
  const { userListedNfts, loading } = useContext(Context);
  return (
    <div className="w-full h-full px-[30px] bg-slate-200 py-[10px] flex flex-col gap-[30px] justify-start">
      <h1 className="text-[50px] font-bold">Explore Welcomints!</h1>
    <div className=" flex flex-wrap gap-[60px] justify-start w-full h-full">
      {loading == true ? (
        <div className="w-full relative top-[30px] flex justify-start align-middle items-center">
          <span className="font-semibold text-[18px] cursor-pointer px-[30px] py-[8px] ">
            Loading...
          </span>
        </div>
      ) : ( 
        userListedNfts.map((el, i) => <NFTcard key={i} nft={el} buy={true} />)
        )}
    </div>
        </div>
  );
};

export default Home;
