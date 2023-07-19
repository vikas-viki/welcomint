/* eslint-disable react/prop-types */
import { useWeb3Modal } from "@web3modal/react";
import "../App.css";
import { useContext, useState } from "react";
import { Context } from "../context/Context";
import BigNumber from "bignumber.js";

const NFTcard = ({ nft, buy }) => {
  const imageUrl = nft.image.split("/");
  const { buyNFT, listNFTForSale } = useContext(Context);
  const { isOpen } = useWeb3Modal();
  const [price, setPrice] = useState("");

  const listNFT = () => {
    if (Number(price) > 0) {
      listNFTForSale({
        args: [nft.tokenId, new BigNumber(price * 1e18)],
      });
    } else {
      alert("Price must not be 0");
    }
  };

  return (
    <div
      className={`border-2 bg-gradient-to-r from-cyan-500 to-blue-500 border-indigo-500 rounded-[19px] ${
        isOpen === false && "drop-shadow-xl"
      } flex items-center justify-center flex-col w-[243px] h-[309px] cursor-pointer nft-card `}
    >
      <img
        src={`https://gateway.ipfs.io/ipfs/${imageUrl[imageUrl.length - 1]}`}
        alt="img"
        className="w-[234px] h-[249px] rounded-[15px] nft-img"
      />
      <div className="nft-desc hidden flex-col h-[200px] items-center justify-between overflow-hidden ">
        <span className="  rounded-[15px]  text-[#fff] text-center h-full">
          {nft.description.length > 0
            ? nft.description.length >= 100
              ? nft.description.slice(0, 100).trim() + "..."
              : nft.description
            : "Unknown"}
        </span>
        {buy == true && (
          <button
            className="nft-buy mt-[110px] absolute px-[20px] py-[8px] border-2 border-indigo-600 text-white rounded-[20px] bg-indigo-500  transition-opacity hover:opacity-90"
            onClick={() => {
              buyNFT({
                args: [nft.tokenId],
                value: new BigNumber(nft.price),
              });
            }}
          >
            BUY
          </button>
        )}
        {nft.price <= 0 && (
          <div className="nft-buy mt-[110px] gap-[8px] justify-center flex items-center flex-col absolute  px-[20px] py-[8px] border-2 border-indigo-600 text-white rounded-[20px] bg-indigo-500  transition-opacity hover:opacity-90">
            <input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
              }}
              className="text-[black] font-bold w-[180px] outline-none border-none rounded"
            />
            <button className="font-bold" onClick={listNFT}>LIST FOR SALE</button>
          </div>
        )}
      </div>
      {nft.price > 0 ? (
        <div className="flex justify-between">
          <span className="font-bold m-2 py-[5px] font-poppins text-[16px] break-words">
            {nft.name.length > 0
              ? nft.name.length >= 10
                ? nft.name.slice(0, 10).trim() + "..."
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
