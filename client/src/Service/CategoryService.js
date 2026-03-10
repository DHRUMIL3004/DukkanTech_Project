import axios from 'axios';


export const addCategory =async (category)=>{
  return await axios.post("#",category)
}


export const deleteCategory=async (categoryId)=>{
    return axios.delete(`#/${categoryId}`);
}


export const featchCategory=async ()=>{
  return await axios.get('#');
}