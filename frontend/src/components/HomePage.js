import React, { useState, useEffect } from "react";
import axios from "axios";
import CarouselSlide from "./CarouselSlide";
import Slider from "react-slick";
import DetailShower from "./DetailShower";
import right from "../icons/right64.png";
import left from "../icons/left64.png";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <img src={right}
      alt="right"
      style={{
        ...style,
        display: "block",
        position: "absolute",
        right: "20vw",
        top: "95%",
        cursor : "pointer",
        transform : 'scale(0.5)',
        zIndex: 4000,
        borderRadius: "0%",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <img
      src={left}
      alt="left"
      style={{
        ...style,
        position: "absolute",
        left: "20vw",
        top: "95%",
        cursor : "pointer",
        transform : "scale(0.5)",
        zIndex: 4000,
        borderRadius: "0%",
      }}
      onClick={onClick}
    />
  );
}

function HomePage(props) {
  const [data, setData] = useState(null);

  const scroll = props.scroll;

  useEffect(() => {
    function FetchData() {
      axios.get("http://localhost:8000/homepage").then((res) => {
        let jsonArray = [];
        for (let key in res.data.jsons) {
          jsonArray.push(res.data.jsons[key]);
        }
        setData(jsonArray);
      });
    }

    FetchData();
  }, []);

  const settings = {
    dots: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite: true,
    speed: 500,
    centerMode: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <>
      <div
        className="pt-[60px] pb-[60px] z-50"
        style={{ backgroundColor: "#e8e7e509" }}
      >
        {props.clicked && props.fetched && (
          <DetailShower
            clicked={props.clicked}
            fetched={props.fetched}
            setFetched={props.setFetched}
            setClicked={props.setClicked}
          ></DetailShower>
        )}
        <Slider {...settings}>
          {data == null ? (
            <p>Fetching data</p>
          ) : (
            data.map((item, idx) => {
              return (
                <CarouselSlide
                  item={item}
                  setFetched={props.setFetched}
                  setClicked={props.setClicked}
                  scroll={scroll}
                ></CarouselSlide>
              );
            })
          )}
        </Slider>
      </div>
    </>
  );
}

export default HomePage;
