import { useState } from "react";
import axios from "axios";
const App = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [image, setImage] = useState();
  const [address, setAddress] = useState("");

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async() => {
    const data = new FormData();
    data.append("image", image);
    data.append("name", name);
    data.append("description", description);
    data.append("attributes", attributes);
    data.append("address", address);
    const hash = await axios
    .post('http://localhost:5000/api/v1/upload-ipfs', data)
    .catch((error) => {
      console.log(error);
    });

    console.log(hash);
  };

  const handleGetNfts = async ()=>{
    const data = new FormData();
    data.append("address", address);
    const nfts = await axios
    .post('http://localhost:5000/api/v1/get-nfts', {
      address: address
    })
    .catch((error) => {
      console.log(error);
    });

    if(nfts === null){
      console.log("new user ");
    }else{
      console.log(nfts);
    }
  }
  return (
    <>
    <div>
      <h1>Welcomint</h1>
      <input
        type="text"
        name="name"
        value={name}
        placeholder="name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        type="text"
        name="name"
        placeholder="address"
        value={address}
        onChange={(e) => {
          setAddress(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="description"
        name="description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <input type="file" onChange={handleImageChange} name="image" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
    <div>
      <button onClick={handleGetNfts}>get NFTS</button>
    </div>
    </>
  );
};

export default App;
