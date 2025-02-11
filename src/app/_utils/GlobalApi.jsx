const { default: axios } = require("axios");

const axiosClient=axios.create({
    baseURL:'https://deserving-friendship-7abc601c03.strapiapp.com/api'
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


const GlobalApi = {
    registerUser,
    SignIn,
    getCourses,
}

export default GlobalApi;