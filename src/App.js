import { Outlet } from "react-router-dom";
import "./App.scss";
import { Navbar } from "./component/Navbar";
import { HomePage } from "./component/Home";
import { Movie } from "./component/Movie";
function App() {
  return (
    <div className="Page">
      <HomePage/>
      <Navbar />
     
      <Movie/>
      {/* Outlet load page con */}
      {/* luc nay dang load Movie */}
      <Outlet/> 
      {/* <UploadFile/> */}
    </div>
  );
}

export default App;