import "./App.scss";
import { HomePage } from "./component/Home";
import { Movie } from "./component/Movie";
import { Navbar } from "./component/Navbar";

function App() {
  return (
    <div className="Page">

      <HomePage />
      <Navbar />
      <Movie />
    </div>
  );
}

export default App;
