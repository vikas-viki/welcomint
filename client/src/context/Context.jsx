import axios from "axios";
import { createContext, useEffect, useState } from "react";
// import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { useAccount} from "wagmi";
export const Context = createContext();
import { Alchemy, Network } from "alchemy-sdk";
const alchemy = new Alchemy({
  apiKey: "jAEKmV9y62iWG6flNQ7KpWkikKXv9PJk",
  network: Network.ETH_SEPOLIA,
});
// import {CAddress, CABI} from "./Constant.js";

// eslint-disable-next-line react/prop-types
const State = ({ children }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState([{ title: "", value: "" }]);
  const [image, setImage] = useState();
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [NFTs, setNFTs] = useState([]);
  const [currentNFTpage, setCurrentNFTpage] = useState("All");
  const [loading, setLoading] = useState(true);
  const [listForSale, setListForSale] = useState(false);
  
/*
  const { config: listNewNFTConfig } = usePrepareContractWrite({
    address: "0xecb504d39723b0be0e3a9aa33d646642d1051ee1",
    abi: ["abi"],
    functionName: "listNFT",
  });

  const {
    data: listNewNFTData,
    isLoading: listNewNFTLoading,
    isSuccess: listNewNFTSuccess,
    write: listNewNFT,
  } = useContractWrite(listNewNFTConfig);*/

  const data1 = useAccount({
    onConnect({ address }) {
      setAddress(address);
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
    console.log({
      image,
      name,
      description,
      attributes,
      address,
      listForSale,
      price,
    });
    if (description.length == 0 || image == null) {
      alert("Please fill all the details to proceed.");
    } else {
      const data = new FormData();
      data.append("image", image);
      data.append("name", name);
      data.append("description", description);
      data.append("attributes", attributes);
      data.append("address", address);
      const tokenURI = await axios
        .post("http://localhost:5000/api/v1/upload-ipfs", data)
        .catch((error) => {
          console.log(error);
        });
        console.log(tokenURI);
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

  const getAllNFTs = async () => {
    setLoading(true);
    if (address.length > 0) {
      alchemy.nft
        .getNftsForOwner(address)
        .then(async (data) => {
          console.log(data);
          const nfts = [];
          await data.ownedNfts.map(async (el) => {
            if (
              el.rawMetadata.name != null ||
              el.rawMetadata.description != undefined
            ) {
              nfts.push({
                name: el.rawMetadata.name,
                description: el.rawMetadata.description,
                image: el.rawMetadata.image,
                attributes: el.rawMetadata.attributes,
              });
            } else {
              const data = await fetch(el.tokenUri.raw);
              nfts.push({
                name: el.title,
                description: el.description,
                image: data.url,
              });
            }
          });
          setNFTs(nfts);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleAttributeChange = (e, index, field) => {
    const updatedAttributes = attributes.map((attribute, i) => {
      if (i === index) {
        return {
          ...attribute,
          [field]: e.target.value,
        };
      }
      return attribute;
    });

    setAttributes(updatedAttributes);
  };

  useEffect(() => {
    getAllNFTs();
  }, [address]);

  useEffect(() => {
    if (currentNFTpage == "Listed") {
      setNFTs([{ title: "listed" }]);
    } else if (currentNFTpage == "Minted") {
      setNFTs([{ title: "Minted" }]);
    } else {
      getAllNFTs();
    }
  }, [currentNFTpage]);

  return (
    <Context.Provider
      value={{
        name,
        setName,
        address,
        setAddress,
        attributes,
        setAttributes,
        image,
        setImage,
        selectedImage,
        setSelectedImage,
        description,
        setDescription,
        handleAttributeChange,
        handleGetNfts,
        handleImageChange,
        handleImageRemove,
        handleSubmit,
        isHovered,
        setIsHovered,
        data1,
        NFTs,
        setNFTs,
        getAllNFTs,
        currentNFTpage,
        setCurrentNFTpage,
        loading,
        price,
        setPrice,
        listForSale,
        setListForSale,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default State;
