import './App.css';

import web3 from './web3';
import lottery from './lottery';
import { useState ,useEffect} from 'react';

function App() {
  const [val,setVal] = useState({
    value:'',
    message :''
  });
  const [message,setMessage] = useState('');
  const [data,setData] = useState({
    manager :'',
    players: [],
    balance: ''
  });
  useEffect(()=> {
    async function getData() {
      let x =await lottery.methods.manager().call();
      let y =await lottery.methods.getPlayers().call();
      let z = await web3.eth.getBalance(lottery.options.address);
      setData({manager : x,
      players : y.length,
      balance : z});
    }

    getData();
  })

  const pick = async() => {
    let accounts =await web3.eth.getAccounts();
    setMessage( 'Transaction pending ...');
    
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });
   
    setMessage('Winner has been picked!!!');
    
  }

  const submit = async(event) => {
    event.preventDefault();
    
    let accounts =await web3.eth.getAccounts();
    setMessage( 'Transaction pending ...');
    
    await lottery.methods.enter().send({
      from: accounts[0],
      value : web3.utils.toWei(val.value, 'ether')
    });
    setMessage('Successfully entered! ');
    
    
  }

  return (
    <div className="App">
      <header className="App-header">
      <h2>LOTTERY CONTRACT!!! </h2>
      <div className='top-div'>
        <p>This contract is managed by {data.manager} .
          <br/>
          There are currently {data.players} people entered,competing to win {web3.utils.fromWei(data.balance,'ether')} ether!
         </p>
      </div>
      <form onSubmit={submit}> 
<h3>Want to try your Luck? </h3>
        <p>Amount of ether to enter</p>
        <input placeholder='Above 0.01 ether' value={val.value} onChange={event => setVal({value : event.target.value})}></input>
        <button type='submit'>Enter</button>
        <p>{message}</p>
</form>
<div >
<h3>Time to pick a Winner? <br /> (Only Manager)</h3>
        <button onClick={pick}>Pick WInner</button>
</div>
      </header>
    </div>
  );
}

export default App;
