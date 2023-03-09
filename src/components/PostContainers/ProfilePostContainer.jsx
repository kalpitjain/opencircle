import Post from "../Post";
import PolygonConfigData from "../../PolygonData.json";
import GoerliConfigData from "../../GoerliData.json";
import ShardeumConfigData from "../../ShardeumData.json";
import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

function ProfilePostContainer() {
  const [posts, setPosts] = useState([]);
  const { address: userAddress } = useAccount();

  async function handleReadPost() {
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

    const allPost = await contract.readUserPosts(userAddress);
    setPosts(allPost);
  }

  useEffect(() => {
    handleReadPost();
  }, []);

  return (
    <>
      <div className="middle">
        {posts
          .slice(0)
          .reverse()
          .map((post, index) => {
            return (
              <Post
                key={index}
                id={Number(post.postId)}
                creatorAddress={post.creatorAddress}
                addressOfImage={post.imageAddress}
                postCaption={post.postCaption}
                dateCreated={post.timeCreated}
              />
            );
          })}
      </div>
    </>
  );
}
export default ProfilePostContainer;
