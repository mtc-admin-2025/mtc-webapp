const { default: axios } = require("axios");

const axiosClient=axios.create({
    baseURL:'https://sparkling-nest-3874afd96c.strapiapp.com/api'
})

const registerUser=(username,email,password)=>axiosClient.post('/auth/local/register',{
    username:username,
    email:email,
    password:password
});

const SignIn=(email,password)=>axiosClient.post('/auth/local',{
    identifier:email,
    password:password,
 
})

const getCourses=()=>axiosClient.get('/courses?populate=*').then(resp=>{
    return resp.data.data
});

const getStudents=()=>axiosClient.get('/students?populate=*').then(resp=>{
    return resp.data.data
});

const getUser = (jwt) => {
    return axiosClient.get('/users/me', {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    }).then(resp => {
        const user = resp.data;
        return {
            username: user.username,
            email: user.email,
            password: user.password,
        };
    });
};

const createStudent = (studentData, jwt) => {
    return axiosClient.post('/students', {
        data: studentData 
    }, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    });
};
const createCourse = (courseData, jwt) => 
    axiosClient.post('/courses', { data: courseData }, {
        headers: { Authorization: `Bearer ${jwt}` }
    }).then(resp => resp.data.data)
    .catch(error => {
        console.error("Error creating course:", error);
        throw error;
    });
    
const deleteCourse = (courseId, jwt) => {
    return axiosClient.delete(`/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${jwt}` }
    });
};

const getEnrolledCourses = (userEmail, jwt) => {
    return axiosClient.get('/enrolls?populate=*', {
        headers: { Authorization: `Bearer ${jwt}` }
    }).then(resp => {
        // Filter enrollments based on the user's email
        const userEnrollments = resp.data.data.filter(enrollment =>
            enrollment.students.some(student => student.Email === userEmail)
        );

        // Extract enrolled courses
        return userEnrollments.flatMap(enrollment => enrollment.courses);
    }).catch(error => {
        console.error("Error fetching enrolled courses:", error);
        throw error;
    });
};

const updateUser = (userId, updatedUser, jwt) => {
    console.log("Updating user with ID:", userId);
    console.log("Updated data:", updatedUser);

    const data = {
      username: updatedUser.username,
      email: updatedUser.email,
    };

    return axiosClient
      .put(
        `/users/${userId}`,
        data, // Directly send the data object without wrapping it in another "data" object
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      )
      .then((resp) => {
        console.log("Response from Strapi:", resp.data);
        return resp.data;
      })
      .catch((error) => {
        console.error("Error updating user:", error.response?.data || error.message);
        throw error;
      });
};



    
const GlobalApi = {
    registerUser,
    SignIn,
    getCourses,
    getStudents,
    getUser,
    createStudent,
    createCourse,
    deleteCourse,
    getEnrolledCourses,
    updateUser,
}



export default GlobalApi;