const Lottery = artifacts.require('Lottery')
//const assert = require('assert')

contract("Lottery", () => {
   let lottery;
  let accounts;

    beforeEach( async() => {
     lottery = await Lottery.new()
     accounts = await web3.eth.getAccounts()  
    });
        
        it('Instance is created', async () => {
            assert.ok(lottery);
            //console.log(accounts)
         });
         
         
         //Enter player one
        
         it('Enters one player into Pool', async () =>{
            
            await lottery.enter({from: accounts[0], value: web3.utils.toWei('0.02', 'ether')});
            const players = await lottery.getPlayers({from: accounts[0]})
            
            assert.equal(accounts[0], players[0]);
            assert.equal( 1, players.length)


        })
        // Enters multiple players
        it('Enters multiple players', async () => {
            
            await lottery.enter({from: accounts[0], value: web3.utils.toWei('0.02', 'ether')});
            await lottery.enter({from: accounts[1], value: web3.utils.toWei('0.02', 'ether')});
            await lottery.enter({from: accounts[2], value: web3.utils.toWei('0.02', 'ether')});

            const players = await lottery.getPlayers({from: accounts[1]})
            // console.log('accounts:', accounts);
            //console.log('players:',players)
            assert.equal(accounts[0], players[0]);
            assert.equal(accounts[1], players[1]);
            assert.equal(accounts[2], players[2]);

            assert.equal( 3, players.length)

            
        })

        //Ether amt test

        it('requires a minimum amount of ether', async () => {
            try {
            await lottery.enter({from: accounts[0], value: web3.utils.toWei('0.001', 'ether')});
            assert(false)
            } catch (err){
                assert(err);
            }
        })

        it('only manager can call pickWinner()', async () =>{
            try{
                await lottery.pickWinner({from: accounts[1]})

            }catch(err){
                assert(err)
            }
        })

        it('sends money to winner and resets', async ()=>{
            //console.log(players);
            //assert.ok(false);
            await lottery.enter({from: accounts[0], value: web3.utils.toWei('2' , 'ether')});
            const initialBalance = await web3.eth.getBalance(accounts[0]);
            await lottery.pickWinner({from: accounts[0]});
            const finalBalance = await web3.eth.getBalance(accounts[0]);
            const diff = finalBalance - initialBalance;
            const players = await lottery.getPlayers();
            
            assert.equal(0, players);
            assert(diff > web3.utils.toWei('1.8', 'ether'));
        

        })
    
})