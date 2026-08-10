
import Product from '../models/Product.js';

export const getProducts = async(req,res)=>{
    try {
        const products  =await Product.find()
res.json(products)
    } catch (error) {
        console.log(error);
        res.status(500).json({message : 'error'})
    }
};
export const createProduct = async(req,res)=>{
    try {
        const {name,price,description}= req.body;
        
        
        
       const product= await Product.create({
            name,price,description
        })
        res.status(201).json({message : 'you have added this product', product})
    } catch (error) {
         console.log(error);
        res.status(500).json({message : 'error'})
    }
}
export const getProductById = async(req,res)=>{
    try {
        const id = req.params.id;
    const productById = await Product.findById(id)
    if (!productById) {
       return res.status(404).json({message : 'Product is not found '})
    }
    res.status(200).json(productById)
    } catch (error) {
        console.log(error);
        res.status(500).json({message : 'error'})
    }
    
}
export const updateProduct= async(req,res)=>{
    try {
         const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id,
         req.body,
    { new: true }
    );
    if (!product) {
       return res.status(404).json({message : 'Product is not found '})
    }
    
    res.status(200).json({message : 'Product has been updated'})
    } catch (error) {
          console.log(error);
        res.status(500).json({message : 'error'})
    }
   
    
};
export const deleteProduct = async(req,res)=>{
    try {
        const id = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(id
    )
    if (!deletedProduct) {
        return res.status(404).json({message : 'Product has not been Found '})
    }
    res.status(200).json({message : "You have deleted" + deletedProduct.name})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : 'error'})
    }
    
}