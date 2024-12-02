const { default: axios } = require("axios");

const axiosClient=axios.create({
    baseURL:'https://typical-bell-38b79c7d7d.strapiapp.com/api'
})

const getCategory=()=>axiosClient.get('/categories?populate=*');

const getSliders=()=>axiosClient.get('/sliders?populate=*').then(resp=>{
    return resp.data.data
});

const getBrandList=()=>axiosClient.get('/brands?populate=*').then(resp=>{
    return resp.data.data
});

const getAllProducts = () => 
    axiosClient.get('/products?pagination[limit]=-1&populate=*')
      .then(resp => {
        return resp.data.data;
      });

const getAllOrders = () => 
    axiosClient.get('/orders?populate=*')
        .then(resp => {
            console.log("Orders fetched:", resp.data.data); // Debug log
            return resp.data.data;
        })
        .catch(error => {
            console.error("Error fetching orders:", error); // Debug log
            return [];
        });

const getProductsByBrand = (brand) =>
    axiosClient.get(`/products?filters[brands][name][$in]=${brand}&pagination[limit]=-1&populate=*`)
      .then(resp => {
        return resp.data.data;
      });
  
const registerUser=(username,email,password)=>axiosClient.post('/auth/local/register',{
    username:username,
    email:email,
    password:password
});

const SignIn=(email,password)=>axiosClient.post('/auth/local',{
    identifier:email,
    password:password,
 
})

const addToCart=(data,jwt)=>axiosClient.post('/user-carts',data,{
    headers:{
        Authorization:'Bearer '+jwt
    }
});

const getCartItems = (userId, jwt) => 
    axiosClient.get('/user-carts?filters[userId][$eq]='+userId+'&[populate][products][populate][images][populate][0]=url', {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    }).then(resp => {
        const data = resp.data.data;
        console.log(data);
        const cartItemsList = data.map((item, index) => ({
            name: item.attributes.products?.data[0].attributes.name,
            quantity: item.attributes.quantity,
            amount: item.attributes.amount,
            image: item.attributes.products?.data[0].attributes.images?.data[0]?.attributes?.url, 
            price: item.attributes.products?.data[0].attributes.price,
            variation: item.attributes.products?.data[0].attributes.variation,
            stock: item.attributes.products?.data[0].attributes.stock,
            id: item.id, 
            product: item.attributes.products?.data[0].id
        }));

        return cartItemsList;
    });

const deleteCartItem=(id,jwt)=>axiosClient.delete('/user-carts/'+id,
{
    headers:{
        Authorization:'Bearer '+jwt
    }
})

const createOrder=(data,jwt)=>axiosClient.post('/orders',data,{
    headers:{
        Authorization:'Bearer '+jwt
    }
});

const getMyOrder=(userId, jwt)=>axiosClient.get('/orders?filters[userId][$eq]='+userId+'&populate[orderItemList][populate][product][populate][images]=url')
.then(resp=>{
    const response=resp.data.data;
    const orderList=response.map(item=>({
        id:item.id,
        totalOrderAmount:item.attributes.totalOrderAmount,
        paymentId:item.attributes.paymentId,
        orderItemList:item.attributes.orderItemList,
        createdAt:item.attributes.createdAt,
        status:item.attributes.status,
        variation:item.attributes.variation,
        paymentMethod:item.attributes.paymentMethod,
        address: item.attributes.address,
        delivery_assignment: item.attributes.delivery_assignment,
    }));

    return orderList;
})

const updateProductStock = (productId, quantity, jwt) => {
    return axiosClient.put(`/products/${productId}`, {
        data: {
            stock: quantity
        }
    }, {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    });
};

const clearCart = async (userId, jwt) => {
    try {
        const cartItems = await getCartItems(userId, jwt);
        const deletePromises = cartItems.map(item => deleteCartItem(item.id, jwt));
        await Promise.all(deletePromises);
        return true;
    } catch (error) {
        console.error("Error clearing cart:", error);
        return false;
    }
};

const cancelOrder = (orderId, jwt) => {
    return axiosClient.put(`/orders/${orderId}`, {
        data: {
            status: "Cancelled"
        }
    }, {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    });
};

const receiveOrder = (orderId, jwt) => {
    return axiosClient.put(`/orders/${orderId}`, {
        data: {
            status: "Completed"
        }
    }, {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    });
};

const refundOrder = (orderId, jwt) => {
    return axiosClient.put(`/orders/${orderId}`, {
        data: {
            status: "Returns"
        }
    }, {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    });
};

const getProductStock = (productId, jwt) => {
    return axiosClient.get(`/products/${productId}`, {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    }).then(resp => resp.data.data.attributes.stock);
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
            icon: user.icon
        };
    });
};

const updateUser = (data, jwt) => {
    console.log("Updating user with data:", data);
    return axiosClient.put('/users/me', {
        username: data.username,
        email: data.email,
        password: data.password
    }, {
        headers: {
            Authorization: 'Bearer ' + jwt
        }
    });
};

const updateRefundFields = (orderId, refundFields, jwt) => {
    const formData = new FormData();

    // Append refund fields to formData
    formData.append('data', JSON.stringify({
        refund_reason: refundFields.refund_reason,
        refund_method: refundFields.refund_method,
        account_number: refundFields.account_number,
    }));

    // Append refund_proof file if it exists
    if (refundFields.refund_proof) {
        formData.append('files.refund_proof', refundFields.refund_proof);
    }

    return axiosClient.put(`/orders/${orderId}`, formData, {
        headers: {
            Authorization: 'Bearer ' + jwt,
            'Content-Type': 'multipart/form-data',
        },
    });
};

const updateCartItemQuantity = (id, newQuantity, jwt, newAmount) => {
    return axiosClient.put(`/user-carts/${id}`, {
        data: {
            quantity: newQuantity,
            amount: newAmount  // Add the new amount here
        }
    }, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    .then(response => {
        return response.data;
    })
    .catch(error => {
        console.error("Error updating cart item quantity:", error);
        return false;
    });
};

const pickOrder = (orderId) => {
    return axiosClient.put(
        `/orders/${orderId}`,
        {
            data: {
                status: "To Ship",
            },
        }
    );
};

const deliverOrder = (orderId) => {
    return axiosClient.put(
        `/orders/${orderId}`,
        {
            data: {
                status: "Delivered",
            },
        }
    );
};

const updateDeliverFields = (orderId, deliverFields, jwt) => {
    const formData = new FormData();

    // Append delivery fields to formData
    formData.append('data', JSON.stringify({
        address: deliverFields.address,
        delivery_assignment: deliverFields.delivery_assignment,
        email: deliverFields.email,
        phone: deliverFields.phone,
        paymentMethod: deliverFields.paymentMethod,
        totalOrderAmount: deliverFields.totalOrderAmount,
    }));

    // Append proof file if it exists
    if (deliverFields.delivery_proof && deliverFields.delivery_proof.data) {
        formData.append('files.delivery_proof', deliverFields.delivery_proof.data);
    }

    return axiosClient.put(`/orders/${orderId}`, formData, {
        headers: {
            Authorization: 'Bearer ' + jwt,
            'Content-Type': 'multipart/form-data',
        },
    });
};

const updateOrderFields = (orderId, orderFields, jwt) => {
    const formData = new FormData();

    // Append delivery fields to formData
    formData.append('data', JSON.stringify({
        payment_proof: orderFields.payment_proof,
       
    }));

    // Append proof file if it exists
    if (orderFields.payment_proof && orderFields.payment_proof.data) {
        formData.append('files.payment_proof', orderFields.payment_proof.data);
    }

    return axiosClient.put(`/orders/${orderId}`, formData, {
        headers: {
            Authorization: 'Bearer ' + jwt,
            'Content-Type': 'multipart/form-data',
        },
    });
};

const GlobalApi = {
    getCategory,
    getSliders,
    getBrandList,
    getAllProducts,
    getProductsByBrand,
    registerUser,
    SignIn,
    addToCart,
    getCartItems,
    deleteCartItem,
    createOrder,
    getMyOrder,
    updateProductStock,
    clearCart,
    cancelOrder,
    receiveOrder,
    getProductStock,
    getUser,
    updateUser,
    refundOrder,
    updateRefundFields,
    getAllOrders,
    updateCartItemQuantity,
    pickOrder,
    deliverOrder,
    updateDeliverFields,
    updateOrderFields,
}

export default GlobalApi;