require("dotenv").config();
const axios = require('axios');
const FormData = require('form-data');
const JWT = `Bearer ${process.env.PINATA_JWT}`;

const pinImage = async (buffer, src) => {
    const formData = new FormData();
    formData.append("file", buffer, src);
  
    try {
      const imageUploadConfig = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData,
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data;`,
          Authorization: JWT
        }
      };
      const { IpfsHash: imageHash } = (await axios(imageUploadConfig)).data;
      return imageHash;
    } catch (error) {
      console.log(error.cause);
    }
  };
  

const pinMetadata = async (name, description, img_hash, attributes) => {
    var data = JSON.stringify({
        "pinataOptions": {
            "cidVersion": 1
        },
        "pinataMetadata": {
            "name": name,
            "keyvalues": {
            }
        },
        "pinataContent": {
            "Greet": "Thankyou for uploading",
            "name": name,
            "image": img_hash,
            "description": description,
            "attributes": attributes,
        }
    });

    var config = {
        method: 'post',
        url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': JWT
        },
        data: data
    };

    const res = await axios(config);
    return res.data;
}

module.exports = { pinImage, pinMetadata };