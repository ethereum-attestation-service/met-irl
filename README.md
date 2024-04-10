# Attest to real-life meetings with metIRL


Check out [metirl.org](https://metirl.org) to play the live version.

## How It Works

1. **User Registration**: Users sign in using their own wallet. The chosen wallet is used to sign offchain attestations.

2. **metIRL Attestation**: A user can attest to meeting any other wallet in real life using the ```bool metIRL```. 

3. **isTrue Attestation**: A user can confirm a meeting by using the metIRL attestation as a referenced attestation and attesting to it with schema ```bool isTrue```, the universal EAS standard for confirming or denying another attestation. 


## Getting Started

To run the RPS project locally:

Ensure that you have Node.js and npm installed before proceeding.

1. Clone the frontend repo:
   ```bash
   git clone https://github.com/ethereum-attestation-service/met-irl.git
   ```
2. Install dependencies:
   ```bash
   cd met-irl
   npm i
   ```
3. Set up your .env file with your Alchemy API key (for resolving ENS names).

4. Start the Development Server
   ```bash
   npm run start
   ```
After completing these steps, the MetIRL display will be shown on port 3000.
