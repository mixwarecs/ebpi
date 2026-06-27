import { useState } from "react";
import CanonShelf from "./CanonShelf";
import SplashScreen from "./components/SplashScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  return (
    <>
      <CanonShelf />
      {showSplash && <SplashScreen onEnter={() => setShowSplash(false)} />}
    </>
  );
}
