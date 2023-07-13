import { useContext } from "react";
import { Context } from "../context/Context.jsx";
import { useWeb3Modal } from "@web3modal/react";

const Mint = () => {
  const { open } = useWeb3Modal();

  const {
    name,
    setName,
    attributes,
    setAttributes,
    selectedImage,
    description,
    setDescription,
    handleAttributeChange,
    handleImageChange,
    handleImageRemove,
    handleSubmit,
    isHovered,
    setIsHovered,
    price,
    setPrice,
    address,
    listForSale,
    setListForSale,
    imageUploadLoading,
  } = useContext(Context);
  console.log(attributes);
  return (
    <div
      className="flex  justify-center  flex-wrap items-center  flex-col w-full  "
      id="particles-js"
    >
      <div className="flex justify-start flex-wrap items-start flex-col gap-[30px]  w-[620px] p-[40px] rounded-[5px]">
        <h1 className="text-[50px] font-poppins font-[600] leading-1 text-center  w-full">
          Mint NFT
        </h1>
        <p className="text-medium font-poppins leading-1">
          Start minting your NFT by uploading an image, filling in the details
          and clicking <b>Submit</b>.
        </p>

        <label htmlFor="nft-name" className="w-full font-semibold p-1">
          Name *
          <input
            type="text"
            name="name"
            id="nft-name"
            value={name}
            placeholder="Crypto Queen"
            className="border-[3px] border-indigo-500 font-normal font-poppins focus:border-green-500 outline-none rounded-[7px] p-3 w-full"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </label>
        <label htmlFor="user-address" className="w-full font-semibold  p-1">
          Attributes{" "}
          <span className="italic font-normal">(press enter for another)</span>
          {attributes?.map((el, i) => (
            <div
              key={i}
              className={`flex ${
                i !== attributes.length - 1 && "pb-[15px]"
              } gap-[15px]`}
            >
              {console.log(el)}
              <input
                type="text"
                name="name"
                placeholder="Background"
                value={el.title}
                className="border-[3px] border-indigo-500  font-normal font-poppins focus:border-green-500 outline-none rounded-[7px] p-3 w-full"
                onChange={(e) => {
                  handleAttributeChange(e, i, "title");
                }}
              />
              <input
                type="text"
                name="name"
                placeholder="Milky"
                id="attribute-value"
                value={el.value}
                className="border-[3px] border-indigo-500  font-normal font-poppins focus:border-green-500 outline-none rounded-[7px] p-3 w-full"
                onChange={(e) => {
                  handleAttributeChange(e, i, "value");
                }}
                onKeyUp={(event) => {
                  if (
                    event.keyCode === 13 &&
                    !event.shiftKey &&
                    attributes[attributes.length - 1].title.length > 0 &&
                    attributes[attributes.length - 1].value.length > 0
                  ) {
                    // The user pressed Enter without Shift key
                    console.log("Enter key pressed without Shift");

                    setAttributes([...attributes, { title: "", value: "" }]);
                    console.log(attributes);
                  }
                }}
              />
            </div>
          ))}
        </label>
        <label htmlFor="nft-description" className="w-full font-semibold p-1">
          Description *
          <textarea
            rows={3}
            id="nft-description"
            type="text"
            placeholder="Queen of all time..."
            name="description"
            className="border-[3px] border-indigo-500 font-normal font-poppins focus:border-green-500 outline-none rounded-[7px] p-3 w-full"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </label>
        <div
          className="border-[3px] border-indigo-500 cursor-pointer flex justify-center items-center font-poppins focus:border-green-500 outline-none rounded-[7px] p-3 w-full h-[200px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            document.getElementById("nft-image-input").click();
          }}
        >
          {selectedImage ? (
            imageUploadLoading == false ? (
              <>
                <img
                  src={selectedImage}
                  alt="Selected NFT"
                  className="w-full h-full object-contain"
                />
                {isHovered && (
                  <button
                    className="z-10 absolute  p-[8px] border-2 border-indigo-600 text-white rounded-[20px] bg-indigo-500  transition-opacity hover:opacity-90"
                    onClick={handleImageRemove}
                  >
                    Change
                  </button>
                )}
              </>
            ) : (
              <span className="font-semibold">Loading...</span>
            )
          ) : (
            <span className="opacity-80 text-sky-600 z-0">
              Drop your NFT here
            </span>
          )}
        </div>
        <input
          type="file"
          onChange={handleImageChange}
          name="image"
          id="nft-image-input"
          className="hidden"
          accept=".jpg, .jpeg, .png, .gif"
        />

        <div className="flex gap-[10px] justify-center items-center cursor-pointer">
          <input
            type="checkbox"
            name="listForSale"
            checked={listForSale}
            onChange={(e) => {
              setListForSale(e.target.checked);
            }}
            className="w-[22px] h-[22px]"
            id="listForSale"
          />
          <label htmlFor="listForSale" className="w-full cursor-pointer font-semibold p-1">
            List for sale
          </label>
        </div>
        {listForSale === true && (
          <label htmlFor="nft-name" className="w-full cursor-pointer font-semibold p-1">
            Price(ETH) *
            <input
              type="number"
              name="name"
              id="nft-name"
              value={price}
              placeholder="0.01"
              className="border-[3px] border-indigo-500 font-normal font-poppins focus:border-green-500 outline-none rounded-[7px] p-3 w-full"
              onChange={(e) => {
                setPrice(e.target.value);
              }}
            />
          </label>
        )}
        <button
          className="button rounded-full bg-indigo-700 text-[20px] font-semibold leading-8 self-center p-[10px] w-[350px] text-white border-2 border-indigo-500"
          onClick={address.length > 0 ? handleSubmit : open}
        >
          {address.length > 0 ? "Submit" : "Connect Wallet"}
        </button>
      </div>
    </div>
  );
};

export default Mint;

/*
<label htmlFor="user-address" className="w-full font-semibold p-1">
          Wallet Address *
          <input
            type="text"
            name="name"
            id="user-address"
            placeholder="0x32d1dBf80..."
            value={address}
            className="border-[3px] border-indigo-500  font-normal font-poppins focus:border-green-500 outline-none rounded-[7px] p-3 w-full"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />
        </label>
*/
