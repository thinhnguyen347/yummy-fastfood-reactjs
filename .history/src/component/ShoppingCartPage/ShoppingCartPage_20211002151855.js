import React, {useState} from "react";
import ShoppingCart from "./ShoppingCart";

export default function ShoppingCartPage(){
const [cartShow, setCartShow] = useState(true);
const [showShippingInfo, showShippingInfo] = useState(true)

    return(
        <>
        {cartShow && <ShoppingCart/>}
        </>
    )
}