// import { useState,useEffect } from 'react';
// import Course from './Course';
// import html from './assets/Screenshot.png'

// function CourseList(){
    
//     const [courses,setCourses] = useState([
//         {   
//             id : 1,
//             name : "HTML", 
//             price : 199, 
//             image : html, 
//             rating : 4.2
//         },
//         {
//             id : 2,
//             name : "CSS", 
//             price : 199, 
//             image : html, 
//             rating : 4.6
//         },
//         {
//             id : 3,
//             name : "JS", 
//             price : 499, 
//             image : html, 
//             rating : 4.5
//         },

//         {
//             id : 4,
//             name : "React", 
//             price : 599, 
//             image : html, 
//             rating : 4.8
//         },
//     ]);

//     useEffect(() => {
//         console.log('use Effect called');
//         console.log(dummy);
//     }, []);

//     function handleDelete(id){
//         console.log(id)
//         const newCourse = courses.filter((course) => course.id != id)
//         setCourses(newCourse);
//     }
//     courses.sort((x,y) => y.rating - x.rating)

//     //const vfmCourses = courses.filter((course) => course.price < 200)

//     const coursesList = courses.map(
//         (course) => 
//         <Course 
//         key = {course.id}
//         name = {course.name} 
//         image = {course.image} 
//         price = {course.price} 
//         rating = {course.rating}
//         delete = {handleDelete}
//         id = {course.id}
//         />
//     )
//     return(
//         <>
//             {coursesList}
//         </>
//     );
// }

// export default CourseList