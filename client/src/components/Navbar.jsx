import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import profile from "../assets/profile.png";

const Navbar = () => {
  return (
    <nav className="bg-slate-200 py-[8px] px-[20px] flex justify-between items-center">
      <div className="flex gap-[40px] items-center w-full">
        <div className="flex items-end select-none gap-[2px] ">
          <img src={logo} alt="Welcomint" className=" w-[40px] " />
          <span className="font-poppins font-bold text-[22px]">elcomint</span>
        </div>
        <span className="leading-10 border-r-2 border-black text-[1px]">.</span>
        <Link
          to="/"
          className="py-3 px-2 font-poppins font-bold rounded-[20px]"
        >
          Home
        </Link>
        <Link
          to="/mint"
          className="py-3 px-2 font-poppins font-bold rounded-[20px]"
        >
          Mint
        </Link>
        <div 
        className="flex-1 flex  drop-shadow-xl bg-slate-200 rounded-[8px] items-center px-[15px] border-[2px] border-slate-300"
        >
        
        <span>🔍</span>
          <input
            type="text"
            placeholder={` Search NFTs `}
            className="border-2 w-full bg-slate-200 rounded-[8px] p-[10px] flex-1 outline-none"
          />
        </div>
        <div className="flex items-center  p-[5px] border-black">
          <span className="px-[14px] py-[7px] font-poppins font-bold border-indigo-500 bg-indigo-500 text-white cursor-pointer border-2 rounded-[3px]">
            Connect
          </span>
          <img src={profile} className="w-[70px] cursor-pointer" alt="0" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
