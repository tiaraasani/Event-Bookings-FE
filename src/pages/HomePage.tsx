import Discounting from "@/components/Discounting";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import GetStarted from "@/components/GetStarted";
import HowItWorks from "@/components/HowItWorks";
import Jumbotron from "@/components/Jumbotron";
import Navbar from "@/components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Jumbotron />
      <Discounting />
      <Features />
      <HowItWorks />
      <GetStarted />
      <Footer />
    </div>
  );
}

export default App;
