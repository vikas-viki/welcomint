import axios from "axios";
import { createContext, useState } from "react";
import { useAccount } from "wagmi";
export const Context = createContext();

// eslint-disable-next-line react/prop-types
const State = ({children}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState([{ title: "", value: "" }]);
  const [image, setImage] = useState();
  const [address, setAddress] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const data1 = useAccount({
    onConnect({ address, connector }) {
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
      }}
    >{children}</Context.Provider>
  );
};

export default State;
