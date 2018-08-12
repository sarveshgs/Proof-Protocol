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


### Transaction Steps

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
- 

###Contract Addresses Ropsten
1. Proof Verifiers : 0x58bec60598934f221797810e44a94a771e741ecb 

2. Proof Facilitator : 0x3589353f0c0b258976470cb95f676baff9c6513d   

3. Register  UUID : 0xc6a88d8abdbfd698ca096d21fc12ea61cda66ef773234de61f4adea81337625a

4. ProofOfStake : 0xe56f7A141F324E5ba1B503e80d3847203fa1223D
