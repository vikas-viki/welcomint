import { useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";

const Mint = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState([{ title: "", value: "" }]);
  const [image, setImage] = useState();
  const [address, setAddress] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const data1 = useAccount({
    onConnect({ address, connector, isReconnected }) {
      setAddress(address);
      console.log(connector);
    },
    onDisconnect() {
      setAddress("");
      console.log("Disconnected.");
    },
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setSelectedImage(e.target.result);
    };

    reader.readAsDataURL(file);
    setImage(event.target.files[0]);
  };

  const handleSubmit = async () => {
    console.log({ image, name, description, attributes, address });
    if (address.length == 0) {
      alert("Please connect your wallet to proceed.");
    } else if (
      description.length == 0 ||
      attributes.length == 0 ||
      image == null
    ) {
      alert("Please fill all the details to proceed.");
    } else {
      const data = new FormData();
      data.append("image", image);
      data.append("name", name);
      data.append("description", description);
      data.append("attributes", attributes);
      data.append("address", address);
      const hash = await axios
        .post("http://localhost:5000/api/v1/upload-ipfs", data)
        .catch((error) => {
          console.log(error);
        });

      console.log(hash);
    }
  };

  const handleGetNfts = async () => {
    const data = new FormData();
    data.append("address", address);
    const nfts = await axios
      .post("http://localhost:5000/api/v1/get-nfts", {
        address: address,
      })
      .catch((error) => {
        console.log(error);
      });

    if (nfts === null) {
      console.log("new user ");
    } else {
      console.log(nfts);
    }
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
  };

  const handleAttributeChange = async (e, _i, t_i) => {
    const data = await attributes.map((el, i) => {
      if (i == _i) {
        if (t_i == "title") {
          el.title = e.target.value;
          return el;
        } else {
          el.value = e.target.value;
          return el;
        }
      } else {
        return el;
      }
    });
    setAttributes(data);
  };

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
            <span className="opacity-80 text-sky-600">Drop your NFT here</span>
          )}
        </div>
        <input
          type="file"
          onChange={handleImageChange}
          name="image"
          id="nft-image-input"
          className="hidden"
        />
        <button
          className="button rounded-full bg-indigo-700 text-[20px] font-semibold leading-8 self-center p-[10px] w-[350px] text-white border-2 border-indigo-500"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <div className="hidden">
        <button onClick={handleGetNfts}>get NFTS</button>
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
