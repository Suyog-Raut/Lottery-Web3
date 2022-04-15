import web3 from './web3';

const abi = <your abi/interface> ;
      const address = <your address>;

export default new web3.eth.Contract(abi,address);
