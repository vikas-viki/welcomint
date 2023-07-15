/* eslint-disable react/prop-types */
import { useWeb3Modal } from "@web3modal/react";
import "../App.css";
const NFTcard = ({ nft, buy }) => {
  const imageUrl = nft.image.split("/");

  const { isOpen } = useWeb3Modal();

  return (
    <div
      className={`border-2 bg-gradient-to-r from-cyan-500 to-blue-500 border-indigo-500 rounded-[19px] ${
        isOpen === false && "drop-shadow-xl"
      } flex items-center justify-center flex-col w-[243px] h-[309px] cursor-pointer nft-card`}
    >
      <img
        src={`https://gateway.ipfs.io/ipfs/${imageUrl[imageUrl.length - 1]}`}
        alt="img"
        className="w-[234px] h-[249px] rounded-[15px] nft-img"
      />
      <div className="nft-desc hidden flex-col h-[200px] items-center justify-between overflow-hidden " >
        <span className="  rounded-[15px]  text-[#fff] text-center h-full">
          {nft.description.length > 0
            ? nft.description.length >= 100
              ? nft.description.slice(0, 100).trim() + "..."
              : nft.description
            : "Unknown"}
        </span>
        {buy == true && (
          <button className="nft-buy mt-[30px] absolute px-[20px] py-[8px] border-2 border-indigo-600 text-white rounded-[20px] bg-indigo-500  transition-opacity hover:opacity-90">
            BUY
          </button>
        )}
      </div>
      {nft.price > 0 ? (
        <div className="flex justify-between">
          <span className="font-bold m-2 py-[5px] font-poppins text-[16px] break-words">
            {nft.name.length > 0
              ? nft.name.length >= 17
                ? nft.name.slice(0, 17).trim() + "..."
                : nft.name
              : "Unknown"}
          </span>
          <span className="font-bold m-2 py-[5px] font-poppins text-[16px] break-words">
            {nft.price / 1e18} ETH
          </span>
        </div>
      ) : (
        <span className="font-bold m-2 py-[5px] font-poppins text-[16px] break-words">
          {nft.name.length > 0
            ? nft.name.length >= 17
              ? nft.name.slice(0, 17).trim() + "..."
              : nft.name
            : "Unknown"}
        </span>
      )}
    </div>
  );
};

export default NFTcard;
