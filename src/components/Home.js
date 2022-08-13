import React, { Component, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { abi } from "../config";
import { address } from "../config";
require('dotenv').config()
console.log("i am here")
console.log(process.env.REACT_APP_WEB3_API_KEY)
class Home extends Component {
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
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  };
  async loadBlockchainData(){
    const web3=window.web3
    const accounts= await web3.eth.getAccounts()
    this.setState({account:accounts[0]})
    const networkId=await web3.eth.net.getId()
    if(networkId===5){
      const socialdapp = new web3.eth.Contract(abi, address);
      this.setState({socialdapp:socialdapp})
      const postsCount=await socialdapp.methods.countPosts().call()
      this.setState({postsCount})
      console.log(postsCount)
      console.log(socialdapp.methods)
      let posts=[]
      for(var i=0;i<postsCount;i++){
        const post=await socialdapp.methods.getPost(i).call()
        console.log(post)
        posts.push(post)
      }
      this.setState({posts})
      console.log(posts)
    }else{
      window.alert('Decentragram contract not deployed to detected network.')
    }
  };
  addPost(a) {
    console.log(a)
        if(a.localeCompare('')==0){
        a="none"
        }
        let b="empty post"
        console.log(a,b)
        console.log(this.state.socialdapp)
        this.state.socialdapp.methods.addPost(a,b).send({from:this.state.account}).on('transactionHash', (hash) => {
            console.log(hash)
        })
    }
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      posts: [],
      socialdapp:null,
      loading: true,
      values:{}
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;
    console.log(value)
    this.setState(prevState=>{
        let oldvalues=prevState.values
        oldvalues[name]=value
        return{
            values:oldvalues
        }
    })
    
    console.log(this.state.values)
  }

  handleSubmit(event) {
    if(this.state.values["text"].localeCompare('')==0){
        alert("empty post")
    }
    else{
    this.addPost(this.state.values["text"])}
    event.preventDefault();
  }
  render(){
  return (
    <div className="container text-left home pt-3" style={{ height: "100vh" }}>
       <form onSubmit={this.handleSubmit}>
            <div className="form-group w-100">
                <label for="post">post
                    <textarea name="text" className="form-control w-100" id="post" rows="2" onChange={this.handleChange}/>
                </label>
            </div>
            <button type="submit"  className="btn btn-primary mb-2">add Post</button>
        </form>
        {
                
        this.state.posts.map(post=><div className="card mt-5 w-100">
                <div className="card-header">
                    {post[2]}
                </div>
                <div className="card-body">
                    <p>{post[0]}</p>
                </div>
            </div>)
        }
    </div>
  );
}
}
export default Home;