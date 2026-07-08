// import PropTypes from "prop-types"
// import { useState } from "react";

// function Course(props){
    
//     //let purchased = false;
//     const [purchased, setPurchased] = useState(false);
//     function BuyCourse(discount, e){
//         console.log(props.name,"purchased with",discount,"% discount");
//         console.log(e);
//         setPurchased(true);
//         console.log(purchased)
//     }
//         return(
//         props.name && <div className = "card"  >
//             <img src={props.image} alt="" />
//             <h3>{props.name}</h3>
//             <p>{props.price}</p>
//             <p>{props.rating}</p>
//             <button onClick={(event) => BuyCourse(20,event)}>Buy Now</button>
//             <button onClick ={() => props.delete(props.id)}>Delete</button>
//             <p>{purchased ? "Already Purchased" : "Get it now"}</p>
//         </div>
//         );

    
// }

// Course.PropTypes = {
//     name : PropTypes.string,
//     rating : PropTypes.number,
//     show : PropTypes.bool
// }

// export default Course;