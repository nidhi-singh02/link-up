"use client";
import Image from "next/image";
import React from "react";
import logingrp from "../assets/logingrp.svg";
import { RiWallet3Fill } from "react-icons/ri";
import Link from "next/link";
import "@rainbow-me/rainbowkit/styles.css";
import { PetraWallet } from "petra-plugin-wallet-adapter";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { polygonAmoy, coreDao } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

const queryClient = new QueryClient();
const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [polygonAmoy, coreDao],
  ssr: true,
});

export default function Page() {
  const selectedNetwork = useSelector((state: RootState) => state.auth.network);
  const wallets = [new PetraWallet()];
  const router = useRouter();
  const handleWalletConnect = (address: string) => {
    if (address) {
      router.push("/Home");
    }
  };
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={false}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <main className="bg-[#FDF7FD] min-h-screen">
              <div className="bg-[url('/bg2.svg')] bgimg2 bg-cover min-h-screen bg-no-repeat">
                <div className="mx-32 pt-48 flex items-center justify-center gap-20">
                  <div className="flex flex-col items-center">
                    <p className="text-[#F24E80] text-5xl font-medium dmsansfont">
                      LinkUp.
                    </p>
                    <p className="text-2xl w-60 text-center py-10 font-semibold">
                      Let’s meet new people around you
                    </p>

                    <span>
                      {(() => {
                        return (
                          <ConnectButton.Custom>
                            {({
                              account,
                              chain,
                              openAccountModal,
                              openChainModal,
                              openConnectModal,
                              authenticationStatus,
                              mounted,
                            }) => {
                              const ready =
                                mounted && authenticationStatus !== "loading";
                              const connected =
                                ready &&
                                account &&
                                chain &&
                                (!authenticationStatus ||
                                  authenticationStatus === "authenticated");

                              if (connected) {
                                console.log("ethadd", account.address);
                                handleWalletConnect(account.address);
                              }

                              return (
                                <>
                                  {!connected ? (
                                    <button
                                      onClick={openConnectModal}
                                      className="bg-[#F24E80] flex justify-center gap-10 items-center mt-5 text-white text-lg w-72 py-4 rounded-full"
                                    >
                                      <RiWallet3Fill className="text-[#F24E80] bg-white px-2 rounded-full text-4xl" />
                                      Login with Wallet
                                    </button>
                                  ) : chain.unsupported ? (
                                    <button
                                      onClick={openChainModal}
                                      type="button"
                                    >
                                      Wrong network
                                    </button>
                                  ) : (
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: 12,
                                      }}
                                    >
                                      <button
                                        onClick={openChainModal}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                        type="button"
                                      >
                                        {chain.hasIcon && (
                                          <div
                                            style={{
                                              background: chain.iconBackground,
                                              width: 12,
                                              height: 12,
                                              borderRadius: 999,
                                              overflow: "hidden",
                                              marginRight: 4,
                                            }}
                                          >
                                            {chain.iconUrl && (
                                              <img
                                                alt={chain.name ?? "Chain icon"}
                                                src={chain.iconUrl}
                                                style={{
                                                  width: 12,
                                                  height: 12,
                                                }}
                                              />
                                            )}
                                          </div>
                                        )}
                                        {chain.name}
                                      </button>

                                      <button
                                        onClick={openAccountModal}
                                        type="button"
                                      >
                                        {account.displayName}
                                      </button>
                                    </div>
                                  )}
                                </>
                              );
                            }}
                          </ConnectButton.Custom>
                        );
                      })()}
                    </span>
                    <p className="pt-10 font-semibold text-[15px]">
                      Don&apos;t have an account?{" "}
                      <Link href="/Signup">
                        <span className="text-[#F24E80] font-semibold">
                          Sign Up
                        </span>
                      </Link>
                    </p>
                  </div>
                  <Image src={logingrp} width={400} alt="" height={400} />
                </div>
              </div>
            </main>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </AptosWalletAdapterProvider>
  );
}
