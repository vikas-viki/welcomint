import { useState } from "react";
import axios from "axios";
const App = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [image, setImage] = useState();

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async() => {
    const data = new FormData();
    data.append("image", image);
    data.append("name", name);
    data.append("description", description);
    data.append("attributes", attributes);
    const hash = await axios
    .post('http://localhost:5000/api/v1/upload-ipfs', data)
    .catch((error) => {
      console.log(error);
    });

    console.log(hash);
  };
  return (
    <div>
      <h1>Welcomint</h1>
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        type="text"
        name="description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <input type="file" onChange={handleImageChange} name="image" />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default App;
