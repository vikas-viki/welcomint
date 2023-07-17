import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createConfig, configureChains, WagmiConfig, sepolia } from "wagmi";
import { w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { publicProvider } from "wagmi/providers/public";
import State from "./context/Context.jsx";

import { BrowserRouter } from "react-router-dom";


const chains = [sepolia];   
export const projectId = "753ca87e729b296cfedf813f7eef158b";

const { publicClient, webSocketPublicClient } = configureChains(chains, [
  w3mProvider({ projectId }),
  publicProvider(),
]);

export const wagmiConfig = createConfig({
  publicClient,
  webSocketPublicClient,
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <WagmiConfig config={wagmiConfig} >
      <State>
        <App />
      </State>
    </WagmiConfig>
  </BrowserRouter>
);
