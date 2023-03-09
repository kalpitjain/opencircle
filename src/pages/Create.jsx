import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import axios from "axios";
import { ethers } from "ethers";
import React, { useState } from "react";
import PolygonConfigData from "../PolygonData.json";
import GoerliConfigData from "../GoerliData.json";
import ShardeumConfigData from "../ShardeumData.json";

function Create() {
  const [image, setImage] = useState("");
  const [displayImage, setDisplayImage] = useState(null);
  function handleImageChange(event) {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setDisplayImage(URL.createObjectURL(img));
      setImage(event.target.files[0]);
    }
  }

  const [caption, setCaption] = useState("");
  function handleCaptionChange(event) {
    setCaption(event.target.value);
  }

  const now = Date.now();
  const [time, setTime] = useState(now);
  function handleTimeChange() {
    const currentTime = Date.now();
    setTime(currentTime);
  }

  async function uploadPost() {
    let openCircleContract;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);

    console.log(chainId);

    if (chainId === 80001) {
      openCircleContract = {
        contractAddress: PolygonConfigData.MumbaiContractAddress,
        contractAbi: PolygonConfigData.abi,
      };
    } else if (chainId === 5) {
      openCircleContract = {
        contractAddress: GoerliConfigData.GoerliContractAddress,
        contractAbi: GoerliConfigData.abi,
      };
    } else {
      openCircleContract = {
        contractAddress: ShardeumConfigData.ShardeumSphinxContractAddress,
        contractAbi: ShardeumConfigData.abi,
      };
    }

    const data = new FormData();
    data.append("file", image);
    let imgUrl = "";

    try {
      if (image) {
        const response = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              pinata_api_key: "52a084fdd2c59360dcb7",
              pinata_secret_api_key:
                "8ce0d49080a717d547482ac09191e276dd4cdbe49e67200313cd82c9cd6d7cfd",
            },
          }
        );
        imgUrl = "https://gateway.ipfs.io/ipfs/" + response.data.IpfsHash;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        openCircleContract.contractAddress,
        openCircleContract.contractAbi,
        signer
      );

      const createPost = async (url, postCaption, postCreationTime) => {
        const tx = await contract.createPost(
          url,
          postCaption,
          postCreationTime
        );
        await tx.wait();
      };

      handleTimeChange();
      await createPost(imgUrl, caption, time.toString(), { gasLimit: 300000 });
      setCaption("");
      setImage(null);
      setDisplayImage(null);
    } catch (err) {
      console.log(err);
      alert("Unable to Upload Image");
    }
  }

  return (
    <>
      <Header />
      <main>
        <div className="container">
          <LeftSidebar />
          <div className="middle">
            <div className="feeds">
              <div className="feed">
                <div className="head">
                  <input
                    className="itemp"
                    accept="image/*"
                    type="file"
                    onChange={handleImageChange}
                    id="upload-file"
                  />
                </div>
                <div className="tme">
                  {image && (
                    <div className="photo">
                      <img src={displayImage} alt="user's post" />
                    </div>
                  )}
                </div>
                <div className="caption">
                  <textarea
                    className="post-textarea post-header"
                    id="style-1"
                    rows="4"
                    value={caption}
                    onChange={handleCaptionChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="right">
            <label htmlFor="upload-file" className="custom-file-upload">
              Choose Image
            </label>
            <button className="btn btn-primary postButton" onClick={uploadPost}>
              Post
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default Create;
