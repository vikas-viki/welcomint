/* eslint-disable react/prop-types */
import { useWeb3Modal } from "@web3modal/react";

const NFTcard = ({ nft }) => {
  const imageUrl = nft.image.split("/");

  const { isOpen } = useWeb3Modal();


  return (
    <div
      className={`border-2 bg-gradient-to-r from-cyan-500 to-blue-500 border-indigo-500 rounded-[19px] ${
        isOpen === false && "drop-shadow-xl"
      } flex items-center justify-center flex-col w-[243px] h-[309px]`}
    >
      <img
        src={`https://gateway.ipfs.io/ipfs/${imageUrl[imageUrl.length - 1]}`}
        alt="img"
        className="w-[235px] h-[250px] rounded-[15px]"
      />
      <span className="font-bold m-2 py-[5px] font-poppins text-[16px] break-words">
        {nft.name.length > 0
          ? nft.name.length >= 17
            ? nft.name.slice(0, 17).trim() + "..."
            : nft.name
          : "Unknown"}
      </span>
    </div>
  );
};

export default NFTcard;
