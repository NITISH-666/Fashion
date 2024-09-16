import axios from 'axios';


function Card(props) {

  function sendData(data) {
    data['imgpath'] = "http://localhost:8000/"+data.img;
    console.log(data.img);
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







  const style = {
    border: "2px solid gray",
    margin: 30,
    padding: 10,
    paddingRight: 30,
    paddingLeft: 30,
    borderRadius: 10,
    boxShadow: "5px 5px 5px #797f82",
  };

    return (
      <div
        className="card w-[300px] inline-block cursor-pointer text-center align-middle"
        style={style}
        onClick={(event) => {
          sendData(props.json);
          props.scroll();
        }}
      >
        {props.json.img === null ? (
          <p className="my-auto">No image available</p>
        ) : (
          <img
            src={"http://localhost:8000" + props.json.img}
            alt="Preview Unavailable"
            className="w-full h-[200px] object-contain justify-center card-img"
          ></img>
        )}
        <h4 className="font-bold cursor-pointer">{props.json.prod_name}</h4>
        <ul className="flex text-xs flex-col text-neutral-600">
          <li>
            {" "}
            <p>{props.json.product_type_name}</p>
          </li>
          <li>
            {" "}
            <p>{props.json.product_group_name}</p>
          </li>
          <li>
            {" "}
            <p>{props.json.department_name}</p>
          </li>
          <li>
            {" "}
            <p>{props.json.index_group_name}</p>
          </li>
        </ul>
      </div>
    );
}

export default Card;