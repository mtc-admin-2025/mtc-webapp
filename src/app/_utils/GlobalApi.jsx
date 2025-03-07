const { default: axios } = require("axios");

const axiosClient=axios.create({
    baseURL:'https://best-memory-ccc8028681.strapiapp.com/api'
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

const GlobalApi = {
    registerUser,
    SignIn,
    getCourses,
    getStudents,
    getUser,
    createStudent,
}

export default GlobalApi;