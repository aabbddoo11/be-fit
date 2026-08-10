import Product from "../models/Product.js";
import Cart from "../models/Cart.js";
export const addToCart = async (req, res) => {

    try {
        const { productId,quantity } = req.body;
        const id = req.user.id;
        const product = await Product.findById(productId)
        
        if (!product) {
            return res.status(404).json({ message: 'Product was not found' })
        }
        const cart = await Cart.findOne({ user: id });

        if (!cart) {
            if (quantity > product.stock) { return res.status(400).json({ message: `Available units are ${product.stock}` }); }
            const newCart = await Cart.create({
                user: id,
                products: [{
                    product: productId,
                    quantity: quantity

                }]
            })
           
            return res.status(201).json({ message: 'Product added to cart successfully', cart: newCart })
        }
        if (cart) {
            const existingProduct = cart.products.find(item => item.product.equals(productId));
            if (existingProduct) {
                
               const newQuantity= quantity+existingProduct.quantity;
                if (newQuantity>product.stock) {
                    return res.status(400).json({message : `Available units are ${product.stock} `})
                }
               existingProduct.quantity=newQuantity;

            } else {
                cart.products.push({
                    product: productId,
                    quantity: quantity
                });
            }
            await cart.save();

            return res.status(200).json({
                message: "Cart updated successfully",
                cart
            });
        }
    } catch (error) {
        return res.status(500).json({ message: '500 Internal Server Error' })
    }
}
export const getCart = async (req, res) => {
    try {
        const id = req.user.id;
        const cart = await Cart.findOne({ user: id }).populate("products.product");

        if (!cart) {
            return res.status(404).json({ message: 'your cart is empty' })
        }
        return res.status(200).json({ message: 'Your cart is ready', yourCart: cart })
    } catch (error) {
        return res.status(500).json({ message: 'Server error, Please retry again later' })

    }


}

export const updateCartQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const id = req.user.id;
        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' })
        }
        const pro = await Product.findById(productId);
        if (!pro) {
    return res.status(404).json({
        message: "Product was not found"
    });
}
        if (pro.stock<quantity) {
            return res.status(400).json({message : `The available unites are only ${pro.stock}`})
        }
        const cart = await Cart.findOne({ user: id });
        if (!cart) {
            return res.status(404).json({ message: 'Your cart is empty' })
        }
        const existingProduct = cart.products.find((item) => item.product.equals(productId));
        if (existingProduct) {
            existingProduct.quantity = quantity
        } else {
            return res.status(404).json({ message: 'Product not found' })
        }
        await cart.save();
        return res.status(200).json({
            message: "Cart updated successfully",
            cart
        });
    } catch (error) {
        return res.status(500).json({ message: 'Server error, Please retry again later' })

    }
};
export const removeFromCart = async (req, res) => {
    try {
        const productId = req.params.productId;
        const id = req.user.id;
        const cart = await Cart.findOne({ user: id });
        if (!cart) {
            return res.status(404).json({ message: 'Your cart is empty' })
        }
        const existingProduct = cart.products.find((item) => item.product.equals(productId))
        if (existingProduct) {
          cart.products=  cart.products.filter((item) => !item.product.equals(productId))
await cart.save();
        return res.status(200).json({ message: 'Product has been deleted' })
        } else {
            return res.status(404).json({ message: 'Your cart is empty' })


        }
        

    } catch (error) {
return res.status(500).json({
    message: "Server error, Please retry again later"
});
    }
};
export const clearCart = async (req,res) => {
    try {
     const   id= req.user.id;
const cart = await Cart.findOne({user:id});
if (cart) {
    cart.products=[];
    await cart.save();
    return res.status(200).json({
    message: "Cart cleared successfully",
    cart
});
}else{return res.status(404).json({message : 'Cart not found'})}
    } catch (error) {
        return res.status(500).json({message : 'Internal Server Error'})
    }
}