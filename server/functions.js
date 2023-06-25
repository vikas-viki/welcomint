require("dotenv").config();
const axios = require('axios');
const FormData = require('form-data');
const JWT = `Bearer ${process.env.PINATA_JWT}`;
const User = require('./models/User');

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

const pinMetadata = async (name, description, img_hash, attributes, address) => {
  try {
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
        "address": address,
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

    const metaHash = res.data.IpfsHash;

    let user = await User.findOne({ address: address }); // Increase timeout to 30 seconds

    if (user === null) {
      await User.insertMany([{ address: address, nfts: [metaHash] }]);
    } else {
      await User.updateOne({ address: address }, { $set: { nfts: [...user.nfts, metaHash] } });
    }
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

const getNfts = async (address) =>{
  try {
    const user = await User.findOne({address: address});
    return user;
  } catch (error) {
    console.log(error);
  }
}

module.exports = { pinImage, pinMetadata, getNfts };