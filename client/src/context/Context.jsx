import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { useNavigate } from "react-router-dom";
import BigNumber from "bignumber.js";
export const Context = createContext();
import { Alchemy, Network } from "alchemy-sdk";
const alchemy = new Alchemy({
  apiKey: import.meta.APIKEY,
  network: Network.ETH_SEPOLIA,
});
import { ethers } from "ethers";
import { CAddress, CABI, server_url } from "./Constant.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// eslint-disable-next-line react/prop-types
const State = ({ children }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState([{ trait_type: "", value: "" }]);
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
  const [renderNFTS, setRenderNFTS] = useState(null);

  const price0 = () =>
    toast.error("Price must not be 0", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const listErr = (data) =>
    toast.error(data, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const details_none = () =>
    toast.error("Please fill all the deatils.", {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const buyError = (err) =>
    toast.error(err, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

    const listForSaleError = (err) =>
    toast.error(err, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });

  const { refetch } = useContractRead({
    address: CAddress,
    abi: CABI,
    functionName: "getAllNFTs",
    async onSuccess(data) {
      let all = [];
      let list = [];
      let mint = [];
      console.log(data);
      for (let i = 0; i < data[2].length; i++) {
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
              tokenId: i + 1
            });
          }
          if (address == String(data[2][i]) && ethValue <= 0) {
            mint.push({
              price: Number(data[0][i]),
              forSale: String(data[3][i]),
              seller: String(data[2][i]),
              name: fetchedData.name,
              description: fetchedData.description,
              image: fetchedData.image,
              tokenId: i + 1,
            });
          }
          if (ethValue > 0 && address != String(data[2][i])) {
            all.push({
              price: Number(data[0][i]),
              forSale: String(data[3][i]),
              seller: String(data[2][i]),
              name: fetchedData.name,
              description: fetchedData.description,
              image: fetchedData.image,
              tokenId: i + 1,
            });
          }
        }
      }
      setUserListedNfts(list);
      setUserMintedNfts(mint);
      setAllContractNfts(all);
      setRenderNFTS(all);
      console.log(all);
    },
  });

  const {
    data: buyData,
    isLoading: buyLoading,
    isSuccess: buyNFTSuccess,
    write: buyNFT,
  } = useContractWrite({
    address: CAddress,
    abi: CABI,
    functionName: "buyNFT",
    onSuccess(data) {
      toast.promise(
        new Promise((resolve) =>
          setTimeout(() => {
            resolve();
          }, 9000)
        ),
        {
          pending: `tx hash: ${data.hash}`,
          success: "NFT bought successfully",
          error: "Error occured🤯",
        },
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      navigate("/profile");
    },
    onError(data) {
      if (String(data).includes("User denied transaction")) {
        buyError("User denied transaction");
      } else if (String(data).includes("Details: err:")) {
        let err = String(data).split("Details: err:")[1].split(" * price +")[0];
        console.log(err);
        buyError(err);
      } else {
        const reason = String(data)
          .split("reason:")[1]
          .split("nContract Call")[0]
          .split("Contract Call:")[0]
          .trim();
        console.log("err", reason);
        buyError(reason);
      }
    },
  });

  const { write: listNFTForSale } = useContractWrite({
    address: CAddress,
    abi: CABI,
    functionName: "listForSale",
    onSuccess(data) {
      toast.promise(
        new Promise((resolve) =>
          setTimeout(() => {
            resolve();
          }, 9000)
        ),
        {
          pending: `tx hash: ${data.hash}`,
          success: "NFT listed successfully",
          error: "Error occured🤯",
        },
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      navigate("/profile");
      resetAll();
    },
    onError(data) {
      if (String(data).includes("User denied transaction")) {
        buyError("User denied transaction");
      } else if (String(data).includes("Details: err:")) {
        let err = String(data).split("Details: err:")[1].split(" * price +")[0];
        console.log(err);
        buyError(err);
      } else {
        const reason = String(data)
          .split("reason:")[1]
          .split("nContract Call")[0]
          .split("Contract Call:")[0]
          .trim();
        console.log("err", reason);
        buyError(reason);
      }
    },
  });

  const { write: cancelNFTListing } = useContractWrite({
    address: CAddress,
    abi: CABI,
    functionName: "cancelListing",
    onSuccess(data) {
      toast.promise(
        new Promise((resolve) =>
          setTimeout(() => {
            resolve();
          }, 9000)
        ),
        {
          pending: `tx hash: ${data.hash}`,
          success: "NFT listed successfully",
          error: "Error occured🤯",
        },
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      navigate("/profile");
      resetAll();
    },
    onError(data) {
      if (String(data).includes("User denied transaction")) {
        buyError("User denied transaction");
      } else if (String(data).includes("Details: err:")) {
        let err = String(data).split("Details: err:")[1].split(" * price +")[0];
        console.log(err);
        buyError(err);
      } else {
        const reason = String(data)
          .split("reason:")[1]
          .split("nContract Call")[0]
          .split("Contract Call:")[0]
          .trim();
        console.log("err", reason);
        buyError(reason);
      }
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
    onSuccess(data) {
      toast.promise(
        new Promise((resolve) =>
          setTimeout(() => {
            resolve();
          }, 9000)
        ),
        {
          pending: `tx hash: ${data.hash}`,
          success: "NFT minted successfully",
          error: "Error occured🤯",
        },
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      navigate("/profile");
      resetAll();
    },
    onError(data) {
      listErr(String(data).split(":")[1].split(".")[0]);
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
    onSuccess(data) {
      toast.promise(
        new Promise((resolve) =>
          setTimeout(() => {
            resolve();
          }, 9000)
        ),
        {
          pending: `tx hash: ${data.hash}`,
          success: "NFT minted successfully",
          error: "Error occured🤯",
        },
        {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    },
    onError(data) {
      if (String(data).includes("User denied transaction")) {
        buyError("User denied transaction");
      } else if (String(data).includes("Details: err:")) {
        let err = String(data).split("Details: err:")[1].split(" * price +")[0];
        console.log(err);
        buyError(err);
      } else {
        const reason = String(data)
          .split("reason:")[1]
          .split("nContract Call")[0]
          .split("Contract Call:")[0]
          .trim();
        console.log("err", reason);
        buyError(reason);
      }
    },
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
        price0();
        return;
      }
      if (description.length == 0 || image == null) {
        details_none();
      } else {
        const data = new FormData();
        data.append("image", image);
        data.append("name", name);
        data.append("description", description);
        data.append("address", address);

        // Loop through the attributes array and append each attribute as a separate entry
        attributes.forEach((attribute, index) => {
          data.append(`attributes[${index}][trait_type]`, attribute.trait_type);
          data.append(`attributes[${index}][value]`, attribute.value);

          // If the attribute has a display_type property, append it as well
          if (attribute.display_type) {
            data.append(
              `attributes[${index}][display_type]`,
              attribute.display_type
            );
          }
        });

        const token_URI = await axios.post(server_url, data).catch((error) => {
          console.log(error);
        });
        const tokenuri = token_URI.data.metaHash.IpfsHash;
        await setTokenURI(tokenuri);
        console.log({ tokenuri });
        if (listForSale == true && price > 0) {
          console.log({ tokenuri });
          await listNewNFT({
            args: [ethers.parseEther(String(Number(price))), tokenuri],
          });
        } else {
          await mintNewNFT({
            args: [tokenuri],
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
    refetch();
  };

  const resetAll = () =>{
    setListForSale(false);
    setDescription("");
    setName("");
    setImage(null);
    setSelectedImage(null);
    setPrice("");
    setAttributes([{trait_type: "", value: ""}]);
  }


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
          await data?.ownedNfts?.map(async (el) => {
            if (el?.rawMetadata?.image?.length > 0) {
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
    refetch();
  }, [address]);

  useEffect(() => {
    console.log(listNewNFTData, listNewNFTLoading, listNewNFTSuccess);
    console.log(minted, minting, mintedNFT);
  }, [listNewNFTData, mintedNFT]);

  useEffect(() => {
    console.log(buyLoading, buyData, buyNFTSuccess);
  }, [buyLoading, buyData]);

  useEffect(() => {
    if (currentNFTpage == "Listed") {
      setNFTs(userListedNfts);
      refetch();
    } else if (currentNFTpage == "Minted") {
      setNFTs(userMintedNfts);
      refetch();
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
        buyNFT,
        tokenURI,
        setAllContractNfts,
        setRenderNFTS,
        renderNFTS,
        listNFTForSale,
        listForSaleError,
        cancelNFTListing
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default State;
