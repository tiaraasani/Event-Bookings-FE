import Discounting from "@/components/Discounting";
import Features from "@/components/Features";
import Jumbotron from "@/components/Jumbotron";
import Navbar from "@/components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <Jumbotron />
      <Discounting />
      <Features />
    </div>
  );
}

export default App;
