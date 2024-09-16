import axios from 'axios';



let imgStyle = {
    width: '15vw',
    objectFit: 'contain',
    zIndex: 10,
    outerHeight: 'auto'
}

function CarouselSlide(props) {

  



  function sendData(data) {

    props.setClicked(data);

      axios
        .post("http://localhost:8000/fetch", data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          props.setFetched(response.data);
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle errors here
        });
    }

















    return (
      <div
        className="carousel-img px-[10px] py-[3px] border-gray-500 border backdrop-filter-none bg-slate-100 z-[1000] rounded-md flex justify-center flex-col cursor-pointer"
        onClick={(event) => {
          sendData(props.item);
          props.scroll();
        }}
      >
        <img
          className="mx-auto"
          style={imgStyle}
          src={props.item.imgpath}
          alt="pic"
        ></img>
        <div>
          <h4 className="font-bold cursor-pointer mx-auto">
            {props.item.prod_name + " " + props.item.product_type_name}
          </h4>
        </div>
      </div>
    );
}

export default CarouselSlide;