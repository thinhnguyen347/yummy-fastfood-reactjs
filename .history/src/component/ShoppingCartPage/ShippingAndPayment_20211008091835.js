import React, { useState, useEffect } from "react";
import CartSummary from "./CartSummary";
import GuestInfo from "./GuestInfo";
import PaymentInfo from "./PaymentInfo";
import { useSelector } from "react-redux";

export default function ShippingAndPayment({ returnToCart }) {
  const [addedList, setAddedList] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentOn, setPaymentOn] = useState(false);
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [showCouponAlert, setShowCouponAlert] = useState(false);
  const shippingFee = useSelector((state) => state.delivery.shippingFee);

  useEffect(() => {
    let data = localStorage.getItem("cart");
    setAddedList(JSON.parse(data));
  }, []);

  let subtotals = addedList.map((item) => item.price * item.amount);

  let total_temp = subtotals.reduce(
    (sum, currentValue) => sum + currentValue,
    0
  );
  let totalAfterVAT = total_temp * 1.1;
  let totalDiscount = total_temp * discount;
  let final_price = totalAfterVAT - totalDiscount + shippingFee;

  function returnToGuestInfo() {
    setPaymentOn(false);
  }

  function goToPaymentInfo() {
    setPaymentOn(true);
  }

  function salesOff(e) {
    let timer;
    switch (e.target.value) {
      case "SALE10":
        setDiscount(0.1);
        setCouponSuccess(true);
        setShowCouponAlert(true);
        break;
      case "SALE15":
        setDiscount(0.15);
        setCouponSuccess(true);
        setShowCouponAlert(true);
        break;
      default:
        if (e.target.value.trim("") !== "") {
          clearTimeout(timer);
          setDiscount(0);
          setShowCouponAlert(true);
          setCouponSuccess(false);
          timer = setTimeout(() => {
            setShowCouponAlert(false);
          }, 2000);
        }
        break;
    }
  }

  return (
    <>
      <nav aria-label="breadcrumb" className="ms-4 ms-lg-5 py-3">
        <ol className="breadcrumb">
          <li
            className="breadcrumb-item text-dark"
            onClick={() => returnToCart()}
          >
            Gi??? h??ng
          </li>
          <li
            className={`breadcrumb-item ${!paymentOn && "text-primary active"}`}
            onClick={() => returnToGuestInfo()}
          >
            Th??ng tin giao h??ng
          </li>
          <li
            className={`breadcrumb-item ${paymentOn && "text-primary active"}`}
          >
            Thanh to??n
          </li>
        </ol>
      </nav>
      <section className="px-3 py-5 mb-5 p-md-3">
        <h2 className="text-center">
          {paymentOn ? "Thanh to??n" : "Th??ng tin giao h??ng"}
        </h2>
        <p className="h6 pb-3 text-center">* * *</p>
        <div className="container pt-3 pt-md-4">
          <div className="row g-5">
            <div className="col-12 col-lg-6 py-0 line">
              {paymentOn ? (
                <PaymentInfo returnToGuestInfo={returnToGuestInfo} />
              ) : (
                <GuestInfo
                  returnToCart={returnToCart}
                  goToPaymentInfo={goToPaymentInfo}
                />
              )}
            </div>
            <div className="col-12 col-lg-6 py-0">
              <h4 className="mb-4 mb-md-5 fw-bold"> T??m t???t ????n h??ng</h4>
              {addedList.map(({ id, title, img, price, amount }) => (
                <CartSummary
                  key={id}
                  title={title}
                  price={price}
                  img={img}
                  amount={amount}
                />
              ))}

              <hr />
              <div className="container-fluid px-0">
                <div className="row row-cols-2 row-cols-md-1 g-3">
                  <div className="col-12 col-md-6 d-flex align-items-center">
                    <label htmlFor="code" className="d-block">
                      M?? gi???m gi?? (SALE10, SALE15):
                    </label>
                  </div>
                  <div className="col-12 col-md-6">
                    <input
                      id="code"
                      maxLength="10"
                      className="d-block p-2 rounded text-center w-100"
                      placeholder="Nh???p m?? gi???m gi??..."
                      onChange={(e) => salesOff(e)}
                    />
                    {!couponSuccess && showCouponAlert && (
                      <p className="m-0 pt-2 text-danger text-center">
                        M?? gi???m gi?? kh??ng t???n t???i!
                      </p>
                    )}
                    {couponSuccess && showCouponAlert && (
                      <p className="m-0 pt-2 text-success text-center">
                        ??p d???ng m?? th??nh c??ng!
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <hr />
              <div className="container-fluid mx-0 px-0 d-flex justify-content-between">
                <span className="d-block">T???m t??nh sau thu??? 10%:</span>
                <span className="d-block fw-bold">
                  {totalAfterVAT.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
              <div className="container-fluid mx-0 px-0 d-flex justify-content-between">
                <span className="d-block">Chi???t kh???u m?? gi???m gi??:</span>
                <span
                  className={`d-block fw-bold ${
                    discount > 0 ? "text-danger" : ""
                  }`}
                >
                  {discount > 0 ? "-" : ""}
                  {totalDiscount.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>

              <div className="container-fluid mx-0 px-0 d-flex justify-content-between">
                <span className="d-block">Ph?? v???n chuy???n:</span>
                <span className="d-block fw-bold">
                  {shippingFee.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>

              <span className="d-block fst-italic text-secondary">
                (??u ????i: Mi???n ph?? v???n chuy???n trong b??n k??nh 6km cho ????n h??ng
                tr??n 300 ng??n ?????ng)
              </span>

              <hr />
              <div className="container-fluid mx-0 px-0 d-flex justify-content-between">
                <span className="d-block">T???ng c???ng:</span>
                <span className="d-block h4 fw-bold text-danger">
                  {final_price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
