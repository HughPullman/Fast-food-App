const Product = require("../models/Product");

const router = require("express").Router();
const stripe = require("stripe")('sk_test_51NYUiDH5YhD34SVSi9bcVQiofhl97vHEb0zIrDkLL2Ajo4jdJlNuKG2EogsN2vdgUvutLcGuB6UvM3pFHUmp0r1H00zpRc9fgJ');

//Create Checkout

router.post("/create-checkout", async (req, res) => {
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: await req.body.items.map(async item => {
                const storeItem = await Product.findById(item.id)
                console.log(item.id);
                console.log(storeItem);
                return {
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: storeItem.name
                        },
                        unit_amount: storeItem.price*100
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.SERVER_URL}/success`,
            cancel_url: `${process.env.SERVER_URL}/success`
        })
        res.json({url: session.url})
    } catch (e){
        res.status(500).json({error: e.message})
    }
})

module.exports = router;