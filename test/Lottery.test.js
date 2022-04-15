const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const {interface, bytecode} = require('../compile');
 const provider = ganache.provider();
const web3 = new Web3(provider);

 let accounts;
 let lottery;

 beforeEach(async()=> {
     accounts = await web3.eth.getAccounts();
     lottery = await new web3.eth.Contract(JSON.parse(interface))
     .deploy({data : bytecode})
     .send({ from :accounts[0],gas : '1000000'});
 })

 describe('Lottery Contract', ()=>{
     it('deploys a contract',()=> {
         assert.ok(lottery.options.address);
     });
     it('allows a player to enter',async()=> { 
        await lottery.methods.enter().send({
            from: accounts[0],
            value : web3.utils.toWei('0.0011','ether')
        });
        const players = await lottery.methods.getPlayers().call({
            from :accounts[0]
        });
        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);
     });
   
     it('allows multiple player to enter',async()=> { 
        await lottery.methods.enter().send({
            from: accounts[0],
            value : web3.utils.toWei('0.0011','ether')
        });

        await lottery.methods.enter().send({
            from: accounts[1],
            value : web3.utils.toWei('0.0011','ether')
        });

        await lottery.methods.enter().send({
            from: accounts[2],
            value : web3.utils.toWei('0.0011','ether')
        });

        const players = await lottery.methods.getPlayers().call({
            from :accounts[0]
        });
        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);
        assert.equal(3,players.length);
     });
    
     it('check min ether ', async()=> {
       try {  
           await lottery.methods.enter().send({
             from: accounts[0],
             value: 0
         });
         assert(false);
        } catch(err){
          assert(err);
         } 
     });

     it('check pickWinner legitimacy', async()=>{
      try {
          await lottery.methods.pickWinner().send({
              from : accounts[0]
          });
          assert(false);
      } catch (err){
          assert(err);
      }
     });

     it('end to end test-send money and reset array', async()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value : web3.utils.toWei('0.1','ether')
        });
        const initialBalance = await web3.eth.getBalance(accounts[0]);
        await lottery.methods.pickWinner().send({
            from : accounts[0]
        });
        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const diff = finalBalance - initialBalance;
        
        const lotteryBalance = await web3.eth.getBalance(lottery.options.address);
        assert(diff > web3.utils.toWei('0.08','ether'));
        const players = await lottery.methods.getPlayers().call({
            from :accounts[0]
        });
        assert.equal(0,players.length);
        assert.equal(0,lotteryBalance);
     });
 });