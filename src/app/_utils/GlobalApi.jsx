const { default: axios } = require("axios");

const axiosClient=axios.create({
    baseURL:'https://wonderful-ball-735c4b8f11.strapiapp.com/api'
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

const getUsers = () => {
  return axiosClient.get('/users?populate=*')
    .then(resp => {
      console.log("Full Response:", resp);
      console.log("Response Data:", resp.data);  // Log the entire data object
      return resp.data.data;  // Ensure we're accessing the correct part
    })
    .catch(error => {
      console.error("Error fetching users:", error);
      return []; // Return an empty array in case of an error
    });
};



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


  const createAssessmentEnrollment = (enrollmentData, jwt) => {
    console.log("Sending enrollment data:", enrollmentData);
  
    return axiosClient.post('/assessments', {  // Ensure this is the correct endpoint
      data: {
        Course_Name: enrollmentData.data.Course_Name,  // Ensure correct field names
        NCtier: enrollmentData.data.NCtier,            // Use correct field names (case-sensitive)
        Students_Name: enrollmentData.data.Students_Name,
        Students_Email: enrollmentData.data.Students_Email,
        Schedule: enrollmentData.data.Schedule,
        Client_Type: enrollmentData.data.Client_Type,
        Competency: enrollmentData.data.Competency || null,  // Optional field handling
        Confirmed: enrollmentData.data.Confirmed || null,    // Optional field handling
        users_permissions_user: enrollmentData.data.users_permissions_user,  // Add user ID here
      }
    }, {
      headers: {
        Authorization: `Bearer ${jwt}`  // Add JWT token in Authorization header
      }
    })
    .then(resp => {
      console.log("Enrollment created:", resp.data);
      return resp.data;
    })
    .catch(error => {
      console.error("Error creating enrollment:", error.response?.data || error.message);
      throw error;
    });
  };
  

  const createTrainingEnrollment = (enrollmentData, jwt) => {
    console.log("Sending enrollment data:", enrollmentData);
  
    return axiosClient.post('/trainings', {  // Ensure this is the correct endpoint
      data: {
        Course_Name: enrollmentData.data.Course_Name,  // Ensure correct field names
        NCtier: enrollmentData.data.NCtier,            // Use correct field names (case-sensitive)
        Students_Name: enrollmentData.data.Students_Name,
        Students_Email: enrollmentData.data.Students_Email,
        Schedule: enrollmentData.data.Schedule,
        Client_Type: enrollmentData.data.Client_Type,
        Competency: enrollmentData.data.Competency || null,  // Optional field handling
        Confirmed: enrollmentData.data.Confirmed || null,    // Optional field handling
        users_permissions_user: enrollmentData.data.users_permissions_user,
      }
    }, {
      headers: {
        Authorization: `Bearer ${jwt}`  // Add JWT token in Authorization header
      }
    })
    .then(resp => {
      console.log("Enrollment created:", resp.data);
      return resp.data;
    })
    .catch(error => {
      console.error("Error creating enrollment:", error.response?.data || error.message);
      throw error;
    });
  };

  
  const getAssessments = (jwt) => {
    return axiosClient.get('/assessments?populate=*', {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }).then(resp => resp.data.data);
  };
  

  const getTrainings = (jwt) => {
    return axiosClient.get('/trainings?populate=*', {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }).then(resp => resp.data.data);
  };

  const getTrainers = (jwt) => {
    return axiosClient.get('/trainers?populate=*', {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    }).then(resp => resp.data.data);
  };
   
  const createTrainer = (trainerData, jwt) => {
    return axiosClient.post('/trainers', { data: trainerData }, {
        headers: { Authorization: `Bearer ${jwt}` }
    }).then(resp => resp.data.data)
    .catch(error => {
        console.error("Error creating trainer:", error);
        throw error;
    });
};

  
const GlobalApi = {
    registerUser,
    SignIn,
    getCourses,
    getUser,
    createCourse,
    deleteCourse,
    updateUser,
    updateCourse,
    createAssessmentEnrollment,
    createTrainingEnrollment,
    getAssessments,
    getTrainings,
    getUsers,
    getTrainers,
    createTrainer,


    
}



export default GlobalApi;