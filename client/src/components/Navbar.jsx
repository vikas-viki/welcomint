import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";
import { Web3Button, Web3Modal } from "@web3modal/react";
import { EthereumClient } from "@web3modal/ethereum";
import { sepolia } from "wagmi";
import { projectId, wagmiConfig } from "../main.jsx";
import { useContext } from "react";
import { Context } from "../context/Context";

const Navbar = () => {
  const chains = [sepolia];

  const {
    searchedNFT,
    allContractNfts,
    setRenderNFTS,
    refetch
  } = useContext(Context);

  const ethereumClient = new EthereumClient(wagmiConfig, chains);

  return (
    <nav className="bg-slate-200 z-10 sticky top-[0px] py-[8px] px-[20px] flex justify-between items-center">
      <div className="flex gap-[20px] items-center justify-center w-full">
        <div className="flex items-end select-none gap-[2px] ">
          <img src={logo} alt="Welcomint" className=" w-[40px] " />
          <span className="font-poppins font-bold text-[22px]">elcomint</span>
        </div>
        <span className="leading-10 border-r-2 border-black text-[1px]">.</span>
        <Link
          to="/"
          className="py-3 px-2 font-poppins font-bold rounded-[20px]"
          onClick={refetch}
        >
          Home
        </Link>
        <Link
          to="/mint"
          className="py-3 px-2 font-poppins font-bold rounded-[20px]"
        >
          Mint
        </Link>
        <div className="flex-1 flex  drop-shadow-xl bg-slate-200 rounded-[8px] items-center px-[15px] border-[2px] border-slate-300 max-w-[950px]">
          <span>🔍</span>
          <input
            type="text"
            value={searchedNFT}
            onChange={(e) => {
              const searchValue = e.target.value.trim();
              const filteredNFTs = allContractNfts.filter((el) =>
                el.name.toLowerCase().includes(searchValue.toLowerCase())
              );
              setRenderNFTS(filteredNFTs);
            }}
            placeholder={` Search NFTs `}
            className="border-2 w-full bg-slate-200 rounded-[8px] p-[10px] flex-1 outline-none"
          />
        </div>
        <div className="flex items-center  p-[5px] border-black">
          <Web3Button />

          <Web3Modal
            projectId={projectId}
            ethereumClient={ethereumClient}
            defaultChain={sepolia}
          />
          <Link to="/profile">
            <img src={profile} className="w-[70px] cursor-pointer" alt="0" />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
