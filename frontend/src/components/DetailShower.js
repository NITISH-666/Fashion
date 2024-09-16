import Slider from "react-slick";
import VerticalCarouselSlide from "./VerticalCarouselSlide";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { motion } from 'framer-motion';
import right from '../icons/right64.png';
import left from '../icons/left64.png';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <img src={right}
      alt="none"
      onClick={onClick}
      className="cursor-pointer"
      style={{
        ...style,
        display: "inline",
        zIndex: 4000,
        borderRadius: "0%",
        transform: "scale(0.5)",
        position: "absolute",
        top: "47%",
        right : "0"
       }}
    ></img>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  console.log(className);
  return (
    <img
      src={left}
      onClick={onClick}
      className="cursor-pointer"
      style={{
        ...style,
        display: "inline",
        zIndex: 4000,
        borderRadius: "0%",
        transform: "scale(0.5)",
        position: "absolute",
        top: "47%",
        left: "0",
      }}
      alt="left-arrow"
    ></img>
  );
}

const settings = {
  customPaging: function (i) {
    return <></>;
  },
  dots: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  infinite: true,
  speed: 500,
  arrows: true,
  vertical: true,
  verticalSwiping: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

function SideComponent(props) {


  const [dominantColor, setDominantColor] = useState(null);

  let article_id = String(props.clicked.article_id);

  useEffect(() => {
      axios
        .post("http://localhost:8000/getDominantColor", { article_id })
        .then((res) => {
          setDominantColor(res.data);
        });
  }, [article_id])

  return (
    <div className="flex flex-row" id="">
      <img
        id="display-image"
        className="h-[60vh] m-[30px] object-contain"
        src={props.clicked.imgpath}
        alt="item-preview"
      ></img>
      <span className="m-[30px]">
        <h4 className="font-bold text-3xl Fashionora">
          {props.clicked.prod_name}
        </h4>
        <ul className="flex text-md flex-col display-ul">
          <li>
            <p>{props.clicked.department_name}</p>
          </li>
          <li>
            <p>{props.clicked.product_type_name}</p>
          </li>
          <li>
            <p>{props.clicked.product_group_name}</p>
          </li>
          <li>
            <p>{props.clicked.garment_group_name}</p>
          </li>
          <li>
            <p>{props.clicked.section_name}</p>
          </li>
          {props.clicked.index_name === props.clicked.index_group_name ? (
            <>
              <li>
                <p>{props.clicked.index_name}</p>
              </li>
            </>
          ) : (
            <>
              <li>
                <p>{props.clicked.index_name}</p>
              </li>
              <li>
                <p>{props.clicked.index_group_name}</p>
              </li>
            </>
          )}
          <li>
            <dl>
              <dt className="hmbold">Description :</dt>
              <dd>{props.clicked.detail_desc}</dd>
            </dl>
          </li>
        </ul>
        {dominantColor && (
          <>
            <div>
              <p className="hmbold">Colours :</p>
              <p>&#x2022;{" "}{props.clicked.perceived_colour_master_name}</p>
              <div
                className="w-[30px] h-[30px] inline-block m-[10px] rounded-full border border-black"
                style={{ backgroundColor: dominantColor.color1 }}
              ></div>
              <div
                className="w-[30px] h-[30px] inline-block m-[10px] rounded-full border border-black"
                style={{ backgroundColor: dominantColor.color2 }}
              ></div>
            </div>
          </>
        )}
      </span>
    </div>
  );
}

function DetailShower(props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9}} // Initial styles
      animate={{ opacity: 1, scale: 1  }} // Animating to visible state
      transition={{ duration: 0.3 }} // Animation duration
    >
      <div className="flex flex-row justify-normal mb-20">
        <div className="w-[60vw] bg-slate-300 rounded-md displayer">
          <SideComponent
            clicked={props.clicked}
            displayRef={props.displayRef}
          ></SideComponent>
        </div>
        <div className="w-[40vw] flex flex-row justify-center mx-auto self-center">
          <Slider {...settings}>
            {props.fetched.map((item, idx) => {
              return (
                <div className="flex flex-row justify-center">
                  <VerticalCarouselSlide
                    item={item["item"]}
                    setFetched={props.setFetched}
                    setClicked={props.setClicked}
                  ></VerticalCarouselSlide>
                </div>
              );
            })}
          </Slider>
        </div>
      </div>
    </motion.div>
  );
}

export default DetailShower;
