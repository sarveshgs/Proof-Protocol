# Proof Protocol

### What is proof?

Proof is mathematical cryptographical representation of any data in EVM.

### What do we want to achieve?

We want to build a Proof protocol which does below things:

- Make inter operating dapps trustable by presenting and verifying proof of any data or value.
- Anyone can become proof verifier with staked amount using POS. Aim is to grow the community. 
- Reward the good Proof Verifiers and punish the bad Proof Verifiers.  
- Proof verifiers gets reward for their computational work.
- Proof Verifiers check existence of data/value on a chain and do verification and outcome is based on POS consensus.  

### Sequence Of Steps

- ProofFacilitators.deploy
- ProofFacilitators.register(name, chanId)
- POS = ProofFacilitators.requestProof
- ProofVerifier.register
- ProofOfStake(POS).startVoting
- ProofOfStake(POS).registerToVote
- ProofOfStake(POS).performVerification
- ProofOfStake(POS).finalize


### Steps To Run

- npm install

### Contract Addresses Ropsten

- Proof Verifiers : 0x58bec60598934f221797810e44a94a771e741ecb 

- Proof Facilitator : 0x3589353f0c0b258976470cb95f676baff9c6513d   

- Register UUID : 0xc6a88d8abdbfd698ca096d21fc12ea61cda66ef773234de61f4adea81337625a

- ProofOfStake : 0xF572ad439093198b96F6dF7FE8790B4BE22a3711

### Steps To Run on Ropsten

- Clone the git repo on your local
    
    git clone git@github.com:sarveshgs/Proof-Protocol.git
    
- Install dependency packages

     - sudo apt-get update 
     - sudo apt-get install nodejs 
     - sudo apt-get install npm  
     - sudo apt-get install software-properties-common
     - sudo add-apt-repository -y ppa:ethereum/ethereum
     - sudo apt-get update
     - sudo apt-get --allow-unauthenticated install solc
         
- Install npm packages

    cd Proof-Protocol
    npm install

- Run proof verifier node

    run node proof_verifier/app.js  

- Load ProofFacilitator In Remix to Perform Transactions

    - Using remix connect to ropsten test network. Load contract ProofOfStake with above given address. 
    - Use contracts/abi/ProofOfStake.abi file for abi.
    - Using Remix perform below transaction:
    - ProofFacilitator => requestProof

- That's it! Proof verifier will perform below actions
    - Generate proof
    - Start Voting
    - Perform Verification
    - Finalize 



