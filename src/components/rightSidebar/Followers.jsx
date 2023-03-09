import UserInfo from "../UserInfo";
import PolygonConfigData from "../../PolygonData.json";
import GoerliConfigData from "../../GoerliData.json";
import ShardeumConfigData from "../../ShardeumData.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

function Followers() {
  const { address: userAddress } = useAccount();
  const [followerUsers, setFollowerUsers] = useState([]);

  async function handleFollowerDetails() {
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

    const allFollowers = await contract.getFollowersAddress(userAddress);
    setFollowerUsers(allFollowers);
  }

  useEffect(() => {
    handleFollowerDetails();
  }, []);

  return (
    <>
      <div className="Rightleft">
        {followerUsers
          .slice(0)
          .reverse()
          .map((followerUsers) => {
            return <UserInfo address={followerUsers} />;
          })}
      </div>
    </>
  );
}
export default Followers;
