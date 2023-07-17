import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { useNavigate } from "react-router-dom";
import BigNumber from "bignumber.js";
export const Context = createContext();
import { Alchemy, Network } from "alchemy-sdk";
const alchemy = new Alchemy({
  apiKey: "jAEKmV9y62iWG6flNQ7KpWkikKXv9PJk",
  network: Network.ETH_SEPOLIA,
});
import { ethers } from "ethers";
import { CAddress, CABI } from "./Constant.js";

// eslint-disable-next-line react/prop-types
const State = ({ children }) => {
  const navigate = useNavigate();
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
  const [tokenURI, setTokenURI] = useState("");
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [allContractNfts, setAllContractNfts] = useState(null);
  const [userListedNfts, setUserListedNfts] = useState(null);
  const [userMintedNfts, setUserMintedNfts] = useState(null);
  const [allAlchemyNfts, setAllAlchemyNfts] = useState(null);

  const { refetch } = useContractRead({
    address: CAddress,
    abi: CABI,
    functionName: "getAllNFTs",
    async onSuccess(data) {
      let all = [];
      let list = [];
      let mint = [];
      console.log(data);
      for (let i = 1; i < data[2].length; i++) {
        if (String(data[1][i]).length > 0 && data[1][i] != undefined) {
          const response = await fetch(`https://ipfs.io/ipfs/${data[1][i]}`);
          const fetchedData = await response.json(); // Assuming the response data is in JSON format
          const weiValue = new BigNumber(String(data[0][i])); // Example Wei value (1 ETH)

          // Convert Wei to Ether
          const ethValue = weiValue.dividedBy(
            new BigNumber("1000000000000000000")
          );
          if (ethValue > 0 && String(data[2][i]) == address) {
            list.push({
              price: Number(data[0][i]),
              forSale: String(data[3][i]),
              seller: String(data[2][i]),
              name: fetchedData.name,
              description: fetchedData.description,
              image: fetchedData.image,
            });
          } else if (address == data[2][i]) {
            mint.push({
              price: Number(data[0][i]),
              forSale: String(data[3][i]),
              seller: String(data[2][i]),
              name: fetchedData.name,
              description: fetchedData.description,
              image: fetchedData.image,
            });
          }
          if (ethValue > 0) {
            all.push({
              price: Number(data[0][i]),
              forSale: String(data[3][i]),
              seller: String(data[2][i]),
              name: fetchedData.name,
              description: fetchedData.description,
              image: fetchedData.image,
            });
          }
        }
      }
      setUserListedNfts(list);
      setUserMintedNfts(mint);
      setAllContractNfts(all);
    },
  });

  const {
    data: listNewNFTData,
    isLoading: listNewNFTLoading,
    isSuccess: listNewNFTSuccess,
    write: listNewNFT,
  } = useContractWrite({
    address: CAddress,
    abi: CABI,
    functionName: "listNFT",
    onSuccess() {
      navigate("/profile");
    },
  });

  const {
    data: mintedNFT,
    isLoading: minting,
    isSuccess: minted,
    write: mintNewNFT,
  } = useContractWrite({
    address: CAddress,
    abi: CABI,
    functionName: "safeMint",
  });

  const data1 = useAccount({
    onConnect({ address }) {
      setAddress(address);
    },
    onDisconnect() {
      setAddress("");
      console.log("Disconnected.");
    },
  });

  const handleImageChange = async (event) => {
    setImageUploadLoading(true);
    const file = await event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      await setSelectedImage(e.target.result);
    };

    await reader.readAsDataURL(file);
    await setImage(event.target.files[0]);
    setImageUploadLoading(false);
  };

  const handleSubmit = async () => {
    try {
      if (listForSale == true && Number(price) <= 0) {
        alert("Price must not be 0");
        return;
      }
      if (description.length == 0 || image == null) {
        alert("Please fill all the details to proceed.");
      } else {
        const data = new FormData();
        data.append("image", image);
        data.append("name", name);
        data.append("description", description);
        data.append("attributes", attributes);
        data.append("address", address);
        const token_URI = await axios
          .post("http://localhost:5000/api/v1/upload-ipfs", data)
          .catch((error) => {
            console.log(error);
          });
        await setTokenURI(token_URI.data.metaHash.IpfsHash);
        console.log(token_URI.data.metaHash.IpfsHash);
      }
      await setTimeout(() => {
        console.log(tokenURI.data.metaHash.IpfsHash);
      }, 2000);
      if (listForSale == true && price > 0) {
        await listNewNFT({
          args: [ethers.parseEther(String(Number(price))), tokenURI],
        });
      } else {
        await mintNewNFT({
          args: [tokenURI],
        });
      }
    } catch (error) {
      console.log(error);
    }
    refetch();
  };

  const handleGetMintedNfts = async () => {
    const data = new FormData();
    data.append("address", address);
    const nfts = await axios
      .post("http://localhost:5000/api/v1/get-nfts", {
        address: address,
      })
      .then((data) => {
        console.log("SERVER", data);
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
      alchemy?.nft
        .getNftsForOwner(address)
        .then(async (data) => {
          console.log(data);
          const nfts = [];
          await data?.ownedNfts.map(async (el) => {
            if (el.rawMetadata.image.length > 0) {
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
                const data = await fetch(el?.tokenUri?.raw);
                if (data.url.length > 0) {
                  nfts.push({
                    name: el.title,
                    description: el.description,
                    image: data.url,
                  });
                }
              }
            }
          });
          setAllAlchemyNfts(nfts);
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
    setAddress(address);
    getAllNFTs();
    handleGetMintedNfts();
    refetch();
  }, [address]);

  useEffect(() => {
    console.log(listNewNFTData, listNewNFTLoading, listNewNFTSuccess);
    console.log(minted, minting, mintedNFT);
  }, [listNewNFTData, mintedNFT]);

  useEffect(() => {
    if (currentNFTpage == "Listed") {
      setNFTs(userListedNfts);
    } else if (currentNFTpage == "Minted") {
      setNFTs(userMintedNfts);
    } else {
      setNFTs(allAlchemyNfts);
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
        handleGetMintedNfts,
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
        imageUploadLoading,
        allContractNfts,
        refetch,
        userListedNfts,
        userMintedNfts,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default State;
