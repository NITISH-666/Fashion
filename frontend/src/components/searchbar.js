import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function SearchBar() {
  const [query, setQuery] = useState("");

  async function sendQuery() {
    var searchbar = document.getElementById("searchbar");
    if (searchbar.value) {
      setQuery(searchbar.value);
    }

    try {
      const response = await axios.post(`http://localhost:8000/search`, {
        query,
      });
      console.log("Response :", response.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="flex justify-center border-r-neutral-500 -z-50">
        <span className="align-middle">
          <input
            type="text"
            name="searchbar"
            id="searchbar"
            className="mx-auto w-[30vw] h-[5vh]"
            placeholder="Sometimes, appropriate apparel must be sought for !"
          ></input>
          <span
            className="w-[6vw] h-[5vh] my-[0.1vh] inline-flex justify-center align-middle bg-slate-400 search-icon cursor-pointer"
            onClick={() => {
              sendQuery();
            }}
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="self-center "
            ></FontAwesomeIcon>
          </span>
        </span>
      </div>
    </>
  );
}

export default SearchBar;
