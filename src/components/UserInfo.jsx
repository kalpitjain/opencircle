import React, { useState, useEffect } from "react";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import { useAccount } from "wagmi";
import PolygonConfigData from "../PolygonData.json";
import GoerliConfigData from "../GoerliData.json";
import ShardeumConfigData from "../ShardeumData.json";
import { ethers } from "ethers";

function UserInfo(props) {
  const { address: userAddress } = useAccount();
  const [isFollowingStatus, setFollowingStatus] = useState(false);
  const [userImage, setUserImage] = useState("");
  const [userName, setUserNmae] = useState("");

  function truncateAddress(address, startLength = 6, endLength = 4) {
    if (!address) {
      return "";
    }

    const truncatedStart = address.substr(0, startLength);
    const truncatedEnd = address.substr(-endLength);

    return `${truncatedStart}...${truncatedEnd}`;
  }

  async function handleFollowingStatus() {
    let openCircleContract;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);

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
    const contract = new ethers.Contract(
      openCircleContract.contractAddress,
      openCircleContract.contractAbi,
      provider
    );
    const status = await contract.isFollowing(userAddress, props.address);

    setFollowingStatus(status);
  }

  async function handleFollowUser() {
    let openCircleContract;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);

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
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      openCircleContract.contractAddress,
      openCircleContract.contractAbi,
      signer
    );

    const tx = await contract.followUser(props.address, {
      gasLimit: 300000,
    });
    await tx.wait();
    window.location.reload();
  }

  async function handleUnfollowUser() {
    let openCircleContract;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);

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
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      openCircleContract.contractAddress,
      openCircleContract.contractAbi,
      signer
    );

    const tx = await contract.unfollowUser(props.address, {
      gasLimit: 300000,
    });
    await tx.wait();
    window.location.reload();
  }

  async function handleReadDetails() {
    let openCircleContract;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const chainId = await provider
      .getNetwork()
      .then((network) => network.chainId);

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
    const contract = new ethers.Contract(
      openCircleContract.contractAddress,
      openCircleContract.contractAbi,
      provider
    );

    const image = await contract.getUserProfileImage(props.address);
    const name = await contract.getUserName(props.address);
    setUserImage(image);
    setUserNmae(name);
  }

  useEffect(() => {
    handleFollowingStatus();
    handleReadDetails();
  }, []);

  return (
    <span className="profile user-info">
      <div className="profile-photo">
        <img
          src={
            userImage === ""
              ? "https://gateway.pinata.cloud/ipfs/QmZoaBTva3on5hfoMcT4pm9vS4mtHy4w1RNoa7AmdkwPZ4"
              : userImage
          }
          alt="UserImage"
        />
      </div>
      <div className="handle">
        <h4 className="left-sidebar-heading-text">
          {userName === "" ? truncateAddress(props.address) : userName}
        </h4>
        <p className="text-muted">{truncateAddress(props.address)}</p>
      </div>
      {props.address === userAddress ? null : isFollowingStatus === true ? (
        <span className="follow-icon" onClick={handleUnfollowUser}>
          <GroupRemoveIcon />
        </span>
      ) : (
        <span className="follow-icon" onClick={handleFollowUser}>
          <GroupAddIcon />
        </span>
      )}
    </span>
  );
}
export default UserInfo;
