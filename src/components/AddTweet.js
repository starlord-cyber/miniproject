import React, { Component } from "react";
import Web3 from "web3";
import { nabi } from "../config";
import { naddress } from "../config";
import { Web3Storage } from  'web3.storage/dist/bundle.esm.min.js';
import axios from 'axios';
//import { v4 as uuidv4 } from 'uuid';
import "./style.css"
require('dotenv').config()
console.log("i am here")
//console.log(process.env.REACT_APP_WEB3_API_KEY)
class AddTweet extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  };
  async storeFiles () {
    /*const ext = file.name.split('.').pop();
        const fileName = '${uuidv4()}.${ext}';
        const newFile = new File([file], fileName, {type: file.type});
        const cid = await this.client.put([newFile], {
            name: fileName,
        });*/
    //console.log("kkk")
    //let x=[new File(files)]
    //console.log(x)
    let file=this.state.Buffer
    let blob=new Blob([file],{type:'image/png'})
    const client = new Web3Storage({ token: process.env.REACT_APP_WEB3_API_KEY })
    let cid = await client.put([new File([blob],"image.png")])
    console.log(cid)
    //my(this.state.values["text"],cid+".ipfs.w3s.link/image.png")
    //return cid
    cid=cid+".ipfs.w3s.link/image.png"
    console.log(cid)
    this.addPost(this.state.values["text"],cid)
  }
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
      const socialdapp = new web3.eth.Contract(nabi,naddress);
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
  addPost(a,b,c) {
    console.log(a,b,c)
        console.log(this.state.socialdapp)
        this.state.socialdapp.methods.addPost(b,a,c).send({from:this.state.account}).on('transactionHash', (hash) => {
            console.log(hash)
        })
    }
  addComment(u,v){
    console.log("commentsinside")
    this.state.socialdapp.methods.addComment(parseInt(u),v).send({from:this.state.account}).on('transactionHash', (hash) => {
      console.log(hash)
    })
  }
  
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      posts: [],
      comments:{},
      socialdapp:null,
      loading: true,
      values:{},
      cvalues:{},
      npost:[],
      x:'',
      i:0,
      cid:''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.storeText = this.storeText.bind(this);
    this.storeWeb3 = this.storeWeb3.bind(this);
    //this.handleCha = this.handleCha.bind(this);
    //this.handleSub = this.handleSub.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.handlenewSubmit=this.handlenewSubmit.bind(this);
  }
  storeText(x,y){
      console.log(x,y)
      if("errors" in x){
        alert("try again")
      }
      else{
      let m=this.state.posts
      let flag=0
      for(var i=0;i<m.length;i++){
        if(m[i][3].localeCompare(y)==0){
            flag=1
            alert("tweet already present")
        }
      }
      if(flag!=1){
        console.log(x["data"]["0"]["text"])
        let m=this.storeWeb3(x["data"]["0"]["text"],x,y);
        
      }
    }
  }
  async storeWeb3(y,x,ny){
    console.log(y)
    const blob= new Blob([y],{type:'application/json'})
    const client = new Web3Storage({ token: process.env.REACT_APP_WEB3_API_KEY })
    let ncid = await client.put([new File([blob],"tweet.txt")])
    console.log(ncid)
    ncid=ncid+".ipfs.w3s.link/tweet.txt"
    this.addPost(ny,ncid,x["data"]["0"]["author_id"])
  }
  captureFile(event) {
    //console.log(event)
    event.preventDefault()
    const file = event.target.files[0]
    console.log(event.target.files)
    console.log(event.target.files[0])
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      console.log("pp")
      console.log(reader.result)
      this.setState({Buffer:(reader.result)})
      
    }
    console.log(this.state.Buffer)
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
    console.log(this.state.values["image"])
    console.log(this.state.values)
  }
  handleCha(y,e){
    console.log("insdie")
    console.log(y,e.target.value)
    const f=e.target.value
    //alert(event.target.value);
    this.setState(prevState=>{
      let oldcvalues=prevState.cvalues
      oldcvalues[y]=f
      return{
          cvalues:oldcvalues
      }
    })
  
    console.log(this.state.cvalues)
  }
  async handlenewSubmit(event){
    if(this.state.values["ntext"].localeCompare('')==0){
      alert("empty tweet id")
  }
  else{
    let n=this.state.values["ntext"]
    let m=this.state.posts
    console.log(m)
      let flag=0
      let z=""
      for(var i=0;i<m.length;i++){
        if(m[i][1].localeCompare(n)==0){
            flag=1
            console.log(m[i])
            await axios.get('/api/text',{params:{link:m[i][0]}}).then(
              response=>{
                console.log(response.data)
                z=response.data
              }
            ).catch(error=>console.log(error.message))
            m[i][0]=z
            this.state.npost.push(m[i])
            console.log(this.state.npost)
        }
      }
      if(flag!=1){
        alert("the tweet you have requested is not stored in the blockchain try to store it")
      }
    }
  }
  handleSubmit(event) {
    if(this.state.values["text"].localeCompare('')==0){
        alert("empty tweet id")
    }
    else{
      let m=this.state.values["text"]
      axios.get('/api/tweet', { params: { id: m } }).then(
        response=>{
          console.log(response.data)
          this.storeText(response.data,m)
        }
      ).catch(error=>console.log(error.message))
    event.preventDefault();
    }
  }
  render(){
  return (
    <div className="container home pt-3 ml-5" style={{ height: "100vh" }}>
       <form onSubmit={this.handleSubmit}>
            <div className="input-group  w-100 pt-3">
                <input type="text" class="form-control" placeholder="tweetid" name="text" onChange={this.handleChange}/>
                <button class="btn btn-outline-secondary" type="submit" id="button-addon2" >addTweet</button>
            </div>
        </form>
        <form onSubmit={this.handlenewSubmit}>
            <div className="input-group  w-100 pt-3">
                <input type="text" class="form-control" placeholder="tweeterid" name="ntext" onChange={this.handleChange}/>
                <button class="btn btn-outline-secondary" type="submit" id="button-addon2" >getTweet</button>
            </div>
        </form>
      {
        this.state.npost.map(p=><div className="card mt-5 w-100 shadow-lg">
          <div className="card-header bg-light text-success">
              tweetid:{p[1]}
          </div>
          <div className="card-body">
              {p[0]}
          </div>
        </div>
        )
      }  
      </div>
  );
}
}
export default AddTweet;