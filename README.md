# Recovery Example

Example of recovering a smart contract wallet to a new private key. For a detailed explanation check out my [blog post](https://medium.com/@blakecduncan/how-does-wallet-recovery-work-2c0f380192e8)

This example uses the [BLS Wallet](https://blswallet.org/). The smart contract wallet is deployed on Arbitrum Goerli testnet.

## Installation

```bash
npm install
```

- These scripts run agains the Arbitrum Goerli testnet

## Steps

1. Create wallet zero and wallet one

```bash
npm run create-wallets
```

2. Set the recovery hash for wallet zero.  We will use the address of wallet one to create this hash
- Note: this action gives wallet one permission to recover wallet zero to a new private key

```bash
npm run set-recovery
```

3. Recover wallet zero to a new private key.  After successful recovery we will call the recovered wallet, wallet two.

```bash
npm run recover-wallet-zero
```

## Contributing
Pull requests are welcome.

## License
[MIT](https://choosealicense.com/licenses/mit/)