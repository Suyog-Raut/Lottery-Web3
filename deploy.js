const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface,bytecode} = require('./compile');

const provider = new HDWalletProvider(
    '<your 12 words to connect account>',
     "< link - https://rinkeby.infura.io/v3/....>"
    );

    const web3 = new Web3(provider);

    const deploy = async () => {
        const accounts = await web3.eth.getAccounts();

        console.log(" from: ",accounts[0]);

       const result = await new web3.eth.Contract(JSON.parse(interface))
       .deploy({data: bytecode})
       .send({from: accounts[0], gas: '1000000'});
     console.log(interface);
       console.log("to : ",result.options.address);
    };
    deploy();
