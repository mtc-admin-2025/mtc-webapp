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
  
    // Prepare the data with all the updated fields
    const data = {
        username: updatedUser.username,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        middle_name: updatedUser.middle_name,
        last_name: updatedUser.last_name,
        suffix: updatedUser.suffix,
        address: updatedUser.address,
        mother_name: updatedUser.mother_name,
        father_name: updatedUser.father_name,
        contact_number: updatedUser.contact_number,
        birthdate: updatedUser.birthdate,
        birthplace: updatedUser.birthplace,
        sex: updatedUser.sex,
        civil_status: updatedUser.civil_status,
        employment: updatedUser.employment,
        educational_attainment: updatedUser.educational_attainment,
        age: updatedUser.age,
        picture: updatedUser.picture,
        signature: updatedUser.signature
    };
  
    return axiosClient
      .put(
        `/users/${userId}`,
        data, 
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
  

const updateCourse = async (courseId, updatedCourse, jwt) => {
    try {
      console.log("Updating course with ID:", courseId);
      console.log("Updated data:", updatedCourse);
    
      const data = {
        Course_ID: updatedCourse.Course_ID,
        Course_Name: updatedCourse.Course_Name,
      };
    
      // Make the PUT request to Strapi
      const response = await axiosClient.put(
        `/courses/${courseId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
  
      console.log("Response from Strapi:", response.data);
      return response.data;
  
    } catch (error) {
      console.error("Error updating course:", error.response?.data || error.message);
      throw error;
    }
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
    updateCourse,
    
}



export default GlobalApi;