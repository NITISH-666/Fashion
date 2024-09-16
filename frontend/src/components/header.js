import React from "react";

function Header(props) {
    return (
      <div className="header flex justify-between">
        <div>
          <h2 className="font-bold text-4xl p-[20px] Fashionora text-[4em] logo-red color-font" ref={props.displayRef}>Fashionora</h2>
        </div>
        <div id="links" className="flex-row align-middle my-auto">
          <a href="/none" className="m-[10px]">
            Contact
          </a>
          <a href="/none" className="m-[10px]">
            About us
          </a>
        </div>
      </div>
    );
}

export default Header;