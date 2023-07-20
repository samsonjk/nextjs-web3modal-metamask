"use client";
import './globals.css'
import { Inter } from 'next/font/google'
import { useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { AccountContext } from '../context/context'
import 'easymde/dist/easymde.min.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  /* create local state to save account information after signin */
  const [account, setAccount] = useState<String>('');

  /* web3Modal configuration for enabling wallet access */
  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      cacheProvider: false,
      providerOptions: {
        walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: "your-infura-id"
          },
        },
      },
    })
    return web3Modal
  }

  /* the connect function uses web3 modal to connect to the user's wallet */
  async function connect() {
    try {
      const web3Modal = await getWeb3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(connection)
      const accounts = await provider.listAccounts()
      setAccount(accounts[0])
      localStorage.setItem('isWalletConnected', 'true');
    } catch (err) {
      console.log('error:', err)
    }
  }

  return (
    <html lang="en">
      <body className={inter.className}>

        <nav className="nav">
          <div className="header">
            {
              !account && (
                <div className="accountInfo">
                  <button className='buttonStyle' onClick={connect}>Connect</button>
                </div>
              )
            }
            {
              account && <p className="accountInfo">{account}</p>
            }
          </div>
        </nav>
        <AccountContext.Provider value={account}>
          {children}
        </AccountContext.Provider>
      </body>
    </html>
  )
}
