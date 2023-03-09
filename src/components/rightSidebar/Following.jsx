import UserInfo from "../UserInfo";
import PolygonConfigData from "../../PolygonData.json";
import GoerliConfigData from "../../GoerliData.json";
import ShardeumConfigData from "../../ShardeumData.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

function Following() {
  const { address: userAddress } = useAccount();
  const [followingUsers, setFollowingUsers] = useState([]);

  async function handleFollowingDetails() {
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

    const allFollowings = await contract.getFollowingAddresses(userAddress);
    setFollowingUsers(allFollowings);
  }

  useEffect(() => {
    handleFollowingDetails();
  }, []);

  return (
    <>
      <div className="Rightleft">
        {followingUsers
          .slice(0)
          .reverse()
          .map((followingUsers) => {
            return <UserInfo address={followingUsers} />;
          })}
      </div>
    </>
  );
}
export default Following;
