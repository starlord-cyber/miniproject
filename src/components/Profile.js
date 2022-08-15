import React, { Component, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { abi } from "../config";
import { address } from "../config";

class Profile extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  };
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      console.log(window.web3.currentProvider)
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  };
  async loadBlockchainData(){
    const web3=window.web3
    const accounts= await web3.eth.getAccounts()
    console.log(accounts)
    this.setState({account:accounts[0]})
    const networkId=await web3.eth.net.getId()
    if(networkId===5){
      const socialdapp = new web3.eth.Contract(abi, address);
      this.setState({socialdapp})
      const postsCount=await socialdapp.methods.countPosts().call()
      this.setState({postsCount})
      console.log(postsCount)
      console.log(socialdapp.methods)
      let posts=[]
      for(var i=0;i<postsCount;i++){
        const post=await socialdapp.methods.getPost(i).call()
        console.log(post)
        console.log(post[2],this.state.account)
        if(post[2]==this.state.account)
            posts.push(post)
      }
      this.setState({posts})
      console.log(posts)
    }else{
      window.alert('Decentragram contract not deployed to detected network.')
    }
  };
  
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      posts: [],
      loading: true
    }
  }
  render(){
  return (
    <div className="container text-left home pt-3" style={{ height: "100vh" }}>
        {this.state.posts.length>0&&this.state.posts.map(post=><div className="card mt-5 w-100 shadow-lg">
                <div className="card-header text-success">
                    {post[2]}
                </div>
                <div className="card-body">
                    <p>{post[0]}</p>
                </div>
            </div>)}
        {
            this.state.posts.length==0&&<h5>no posts found</h5>
        }
    </div>
  );
}
}
export default Profile;