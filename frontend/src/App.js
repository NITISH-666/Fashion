import "./App.css";
import axios from "axios";
import { useState , useEffect, useRef} from "react";
import Header from "./components/header";
import Card from "./components/card";
import HomePage from "./components/HomePage";




function App() {
  const [msg, setmsg] = useState(null);
  const [fetched, setFetched] = useState(null);
  const [clicked, setClicked] = useState(null);

  const displayRef = useRef(null);

  const scroll = () => {
    if (displayRef.current) {
      displayRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  useEffect(() => {
      axios.get("http://localhost:8000/").then((res) => {
        console.log("Fetched data");
        const jsonArray = [];

        for (const key in res.data) {
          if (res.data.hasOwnProperty(key)) {
            const nestedObject = res.data[key];
            jsonArray.push(nestedObject);
          }
        }
        setmsg(jsonArray);
      });
  },[])
  return (
    <>
      <div className="w-full h-fit bg-slate-100 text-black">
        <Header displayRef={displayRef}></Header>
        <HomePage
          clicked={clicked}
          fetched={fetched}
          setFetched={setFetched}
          setClicked={setClicked}
          scroll={scroll}
        ></HomePage>
        <div className="w-full h-fit flex-row">
          {msg === null
            ? "fetching data"
            : msg.map((item) => {
                return (
                  <Card
                    json={item}
                    setClicked={setClicked}
                    setFetched={setFetched}
                    scroll={scroll}
                  ></Card>
                );
              })}
        </div>
      </div>
    </>
  );
}

export default App;
