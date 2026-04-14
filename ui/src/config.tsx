import React from "react"
// Icons
import Eth from "./components/svg/chains/Eth"
import Arbitrum from "./components/svg/chains/Arbitrum"
import Base from "./components/svg/chains/Base"
import HyperLiquid from "./components/svg/chains/HyperLiquid"
import Monad from "./components/svg/chains/Monad"
import Unichain from "./components/svg/chains/Unichain"
import Polygon from "./components/svg/chains/Polygon"
import ZkSync from "./components/svg/chains/ZkSync"
import Foundry from "./components/svg/chains/Foundry"
import Optimism from "./components/svg/chains/Optimism"

export type RpcConfig = {
  url: string
  chainId: number
  text: string
  test: boolean
  explorer?: (addr: string) => string
  icon?: React.FC<{
    size: number
    color?: string
    className?: string
    onClick?: (e: React.MouseEvent) => void
  }>
}

const EXPLORERS = {
  ethereum: "https://etherscan.io",
  sepolia: "https://sepolia.etherscan.io",
  arbitrum: "https://arbiscan.io",
  "arbitrum-sepolia": "https://sepolia.arbiscan.io",
  base: "https://basescan.org",
  "base-sepolia": "https://sepolia.basescan.org",
  "hyperliquid-mainnet": "https://hyperevmscan.io",
  "monad-mainnet": "https://monad.socialscan.io",
  "monad-testnet": "https://monad-testnet.socialscan.io",
  "unichain-mainnet": "https://unichain.blockscout.com/",
  "unichain-sepolia": "https://unichain-sepolia.blockscout.com/",
  polygon: "https://polygonscan.com",
  "polygon-amoy": "https://amoy.polygonscan.com",
  "optimism-mainnet": "https://optimistic.etherscan.io",
  "optimism-sepolia": "https://sepolia-optimism.etherscan.io",
  zksync: "https://explorer.zksync.io",
  "zksync-sepolia": "https://sepolia.explorer.zksync.io",
}

export const RPC_CONFIG = {
  "foundry-test": {
    url: "",
    chainId: 0,
    text: "Foundry Test",
    test: true,
    icon: Foundry,
  },
  "eth-mainnet": {
    url: import.meta.env.VITE_ETH_MAINNET_RPC_URL,
    chainId: 1,
    text: "ETH",
    test: false,
    explorer: (addr: string) => `${EXPLORERS["ethereum"]}/address/${addr}`,
    icon: Eth,
  },
  "eth-sepolia": {
    url: import.meta.env.VITE_ETH_SEPOLIA_RPC_URL,
    chainId: 11155111,
    text: "ETH Sepolia",
    test: true,
    explorer: (addr: string) => `${EXPLORERS["sepolia"]}/address/${addr}`,
    icon: Eth,
  },
  "arb-mainnet": {
    url: import.meta.env.VITE_ARB_MAINNET_RPC_URL,
    chainId: 42161,
    text: "ARB One",
    test: false,
    explorer: (addr: string) => `${EXPLORERS["arbitrum"]}/address/${addr}`,
    icon: Arbitrum,
  },
  "arb-sepolia": {
    url: import.meta.env.VITE_ARB_SEPOLIA_RPC_URL,
    chainId: 421614,
    text: "ARB Sepolia",
    test: true,
    explorer: (addr: string) =>
      `${EXPLORERS["arbitrum-sepolia"]}/address/${addr}`,
    icon: Arbitrum,
  },
  "base-mainnet": {
    url: import.meta.env.VITE_BASE_MAINNET_RPC_URL,
    chainId: 8453,
    text: "Base",
    test: false,
    explorer: (addr: string) => `${EXPLORERS["base"]}/address/${addr}`,
    icon: Base,
  },
  "base-sepolia": {
    url: import.meta.env.VITE_BASE_SEPOLIA_RPC_URL,
    chainId: 84532,
    text: "Base Sepolia",
    test: true,
    explorer: (addr: string) => `${EXPLORERS["base-sepolia"]}/address/${addr}`,
    icon: Base,
  },
  "hyperliquid-mainnet": {
    url: import.meta.env.VITE_HYPERLIQUID_MAINNET_RPC_URL,
    chainId: 999,
    text: "Hyperliquid",
    test: false,
    explorer: (addr: string) =>
      `${EXPLORERS["hyperliquid-mainnet"]}/address/${addr}`,
    icon: HyperLiquid,
  },
  "monad-mainnet": {
    url: import.meta.env.VITE_MONAD_MAINNET_RPC_URL,
    chainId: 10143,
    text: "Monad",
    test: false,
    explorer: (addr: string) => `${EXPLORERS["monad-mainnet"]}/address/${addr}`,
    icon: Monad,
  },
  "monad-testnet": {
    url: import.meta.env.VITE_MONAD_TESTNET_RPC_URL,
    chainId: 10143_1,
    text: "Monad Testnet",
    test: true,
    explorer: (addr: string) => `${EXPLORERS["monad-testnet"]}/address/${addr}`,
    icon: Monad,
  },
  "unichain-mainnet": {
    url: import.meta.env.VITE_UNICHAIN_MAINNET_RPC_URL,
    chainId: 130,
    text: "Unichain",
    test: false,
    explorer: (addr: string) =>
      `${EXPLORERS["unichain-mainnet"]}/address/${addr}`,
    icon: Unichain,
  },
  "unichain-sepolia": {
    url: import.meta.env.VITE_UNICHAIN_SEPOLIA_RPC_URL,
    chainId: 1301,
    text: "Unichain Sepolia",
    test: true,
    explorer: (addr: string) =>
      `${EXPLORERS["unichain-sepolia"]}/address/${addr}`,
    icon: Unichain,
  },
  "polygon-mainnet": {
    url: import.meta.env.VITE_POLYGON_MAINNET_RPC_URL,
    chainId: 137,
    text: "Polygon",
    test: false,
    explorer: (addr: string) => `${EXPLORERS["polygon"]}/address/${addr}`,
    icon: Polygon,
  },
  "polygon-amoy": {
    url: import.meta.env.VITE_POLYGON_AMOY_RPC_URL,
    chainId: 80002,
    text: "Polygon Amoy",
    test: true,
    explorer: (addr: string) => `${EXPLORERS["polygon-amoy"]}/address/${addr}`,
    icon: Polygon,
  },
  "optimism-mainnet": {
    url: import.meta.env.VITE_OPTIMISM_MAINNET_RPC_URL,
    chainId: 10,
    text: "Optimism",
    test: false,
    explorer: (addr: string) =>
      `${EXPLORERS["optimism-mainnet"]}/address/${addr}`,
    icon: Optimism,
  },
  "optimism-sepolia": {
    url: import.meta.env.VITE_OPTIMISM_SEPOLIA_RPC_URL,
    chainId: 11155420,
    text: "Optimism Sepolia",
    test: true,
    explorer: (addr: string) =>
      `${EXPLORERS["optimism-sepolia"]}/address/${addr}`,
    icon: Optimism,
  },
  "zksync-mainnet": {
    url: import.meta.env.VITE_ZKSYNC_MAINNET_RPC_URL,
    chainId: 324,
    text: "zkSync",
    test: false,
    explorer: (addr: string) => `${EXPLORERS["zksync"]}/address/${addr}`,
    icon: ZkSync,
  },
  "zksync-sepolia": {
    url: import.meta.env.VITE_ZKSYNC_SEPOLIA_RPC_URL,
    chainId: 300,
    text: "zkSync Sepolia",
    test: true,
    explorer: (addr: string) =>
      `${EXPLORERS["zksync-sepolia"]}/address/${addr}`,
    icon: ZkSync,
  },
}
