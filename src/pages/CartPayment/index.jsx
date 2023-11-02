import { basicSchema, creditCardSchema } from "../../schemas";
import { inputs } from "./form";
import { read } from "../../services";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const initialCheckBox = true; //estado inicial de checkbox

export default function CartPayment() {
  const navigate = useNavigate();
  const globalUser = useSelector((state) => state.user.data);
  const [personalData, setPersonalData] = useState([]);
  const [selectedCredit, setSelectedCredit] = useState(false);
  const [checkbox, setCheckbox] = useState(initialCheckBox);

  const handleCreditClick = (id) => {
    setSelectedCredit(id);
  };

  const handleCheckBoxChange = () => {
    setCheckbox(!checkbox); //cambia valor de checkbox
    if (!checkbox) {
      setValues({
        name: personalData.name,
        address: personalData.address,
        city: personalData.city,
        region: personalData.region,
        phoneNumber: personalData.phoneNumber,
      });
    } else {
      //checkbox desmarcado
      setValues({
        name: "",
        address: "",
        city: "",
        region: "",
        phoneNumber: "",
      });
    }
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setValues,
  } = useFormik({
    initialValues: {
      name: "",
      address: "",
      city: "",
      region: "",
      phoneNumber: "",
    },
    validationSchema: basicSchema,
  });

  const formCreditCard = useFormik({
    initialValues: {
      creditCardNumber: "",
      expirationMonth: "",
      expirationYear: "",
      cvv: "",
    },
    validationSchema: creditCardSchema,
  });

  function redirect(route) {
    return (event) => {
      event.preventDefault();
      navigate(route);
    };
  }

  async function initializeFormData() {
    const users = await read("users");
    const foundUser = users.find(
      (user) => user.email.toLowerCase() === globalUser.email.toLowerCase()
    );
    if (foundUser) {
      setPersonalData({
        id: foundUser.id,
        name: foundUser.name,
        address: foundUser.address,
        city: foundUser.city,
        region: foundUser.region,
        phoneNumber: foundUser.phoneNumber,
      });
    }
  }

  useEffect(() => {
    initializeFormData();
  }, []);

  useEffect(() => {
    setValues({
      name: personalData.name,
      address: personalData.address,
      city: personalData.city,
      region: personalData.region,
      phoneNumber: personalData.phoneNumber,
    });
  }, [personalData]);

  return (
    <>
      <div className="mt-5">
        <img
          onClick={redirect("/")}
          className="h-[50px] md:h-[70px] hover:cursor-pointer "
          src="https://raw.githubusercontent.com/rgap/Ecommerce-G15-ImageRepository/main/images/logo/beautipol-textlogo.png"
          alt=""
        />
      </div>

      <div className="max-sm:hidden breadcrumb flex gap-3 mb-5 ml-20 text-sm">
        <div className="cursor-pointer hover:underline">Carrito</div>
        <span>/</span>
        <div className="cursor-pointer hover:underline">Informacion</div>
        <span>/</span>
        <div className="cursor-pointer hover:underline">Envios</div>
        <span>/</span>
        <div className="cursor-pointer">Pago</div>
      </div>

      <div className="lg:flex">
        <section className="cart-info-left lg:w-[50%] flex flex-col items-center">
          <p className="mb-5 font-bold text-lg ">Direccion de Facturacion </p>
          <form
            autoComplete="off"
            className="w-[300px] md:w-[400px] xl:w-[500px] mb-10 flex flex-col gap-2"
          >
            <div className="my-3 flex gap-1">
              <input
                checked={checkbox}
                onChange={handleCheckBoxChange}
                type="checkbox"
                id="checkboxAddress"
                name="checkboxAddress"
              />
              <label className="text-sm">
                Usar la misma direccion de Envio
              </label>
            </div>
            {inputs.map((input) => (
              <>
                <div className="p-2 border border-gray-700">
                  <input
                    className="w-full outline-none"
                    id={input.name}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleChange}
                    value={values[input.name]}
                    onBlur={handleBlur}
                  />
                </div>
                {errors[input.name] && touched[input.name] && (
                  <p className="text-xs text-red-500">{errors[input.name]}</p>
                )}
              </>
            ))}
          </form>
        </section>

        <section className="max-lg:hidden lg:w-[50%] flex flex-col justify-start items-start">
          <div className="flex flex-col">
            <p className="mb-5 font-bold text-lg">Pago</p>
            <p className="">Selecciona metodo de pago</p>
          </div>

          <div className="flex gap-10 mt-5 mb-7">
            <div className="w-[100px] h-[40px] flex">
              <img
                id="american"
                className={`cursor-pointer ${
                  selectedCredit === "american"
                    ? "border-2 rounded-sm border-teal-800 "
                    : ""
                }`}
                src="https://raw.githubusercontent.com/rgap/Ecommerce-G15-ImageRepository/82306af9c3214a4e16f35b88166da045a8b7bc40/icons/Payment-creditcards/amex.svg"
                alt=""
                onClick={() => handleCreditClick("american")}
              />
            </div>
            <div className="w-[100px] h-[40px] flex">
              <img
                id="paypal"
                className={`cursor-pointer ${
                  selectedCredit === "paypal"
                    ? "border-2 rounded-sm border-teal-800 "
                    : ""
                }`}
                src="https://raw.githubusercontent.com/rgap/Ecommerce-G15-ImageRepository/82306af9c3214a4e16f35b88166da045a8b7bc40/icons/Payment-creditcards/Paypal.svg"
                alt=""
                onClick={() => handleCreditClick("paypal")}
              />
            </div>
            <div className="w-[100px] h-[40px] flex gap-1  ">
              <img
                className={`cursor-pointer ${
                  selectedCredit === "visa"
                    ? "border-2 rounded-sm border-teal-800 "
                    : ""
                }`}
                id="visa"
                src="https://raw.githubusercontent.com/rgap/Ecommerce-G15-ImageRepository/82306af9c3214a4e16f35b88166da045a8b7bc40/icons/Payment-creditcards/Visa.svg"
                alt=""
                onClick={() => handleCreditClick("visa")}
              />
            </div>
            <div className="w-[100px] h-[40px] flex">
              <img
                className={`cursor-pointer ${
                  selectedCredit === "mastercard"
                    ? "border-2 rounded-sm border-teal-800 "
                    : ""
                }`}
                id="mastercard"
                src="https://raw.githubusercontent.com/rgap/Ecommerce-G15-ImageRepository/82306af9c3214a4e16f35b88166da045a8b7bc40/icons/Payment-creditcards/Masterrcard.svg"
                alt=""
                onClick={() => handleCreditClick("mastercard")}
              />
            </div>
          </div>

      
          <form  
          autoComplete="off"
           className="w-[500px]">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              for="creditCardNumber"
            >
              Número de Tarjeta
            </label>
            <input
              className="border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="creditCardNumber"
              type="text"
              placeholder="Número de Tarjeta"
              onChange={formCreditCard.handleChange}
              onBlur={formCreditCard.handleBlur}
            />
            {formCreditCard.errors.creditCardNumber &&
              formCreditCard.touched.creditCardNumber && (
                <p className="text-xs text-red-500">
                  {formCreditCard.errors.creditCardNumber}
                </p>
              )}
          </div>

          <div className="flex flex-wrap -mx-3 mb-4">
            <div className="w-1/2 px-3">
              <label
                className="block text-gray-700 text-sm font-bold mb-1"
                for="expirationMonth"
              >
                Mes
              </label>
              <input
                className=" border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="expirationMonth"
                type="text"
                placeholder="Mes"
                onChange={formCreditCard.handleChange}
                onBlur={formCreditCard.handleBlur}
              />
              {formCreditCard.errors.expirationMonth &&
                formCreditCard.touched.expirationMonth && (
                  <p className="text-xs text-red-500">
                    {formCreditCard.errors.expirationMonth}
                  </p>
                )}
            </div>
            <div className="w-1/2 px-3">
              <label
                className="block text-gray-700 text-sm font-bold mb-1"
                for="expirationYear"
              >
                Año
              </label>
              <input
                className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="expirationYear"
                type="text"
                placeholder="Año"
                onChange={formCreditCard.handleChange}
                onBlur={formCreditCard.handleBlur}
              />
              {formCreditCard.errors.expirationYear &&
                formCreditCard.touched.expirationYear && (
                  <p className="text-xs text-red-500">
                    {formCreditCard.errors.expirationYear}
                  </p>
                )}
            </div>
          </div>

          <div className="">
            <label
              className="block text-gray-700 text-sm font-bold mb-1"
              for="cvv"
            >
              CVV
            </label>
            <input
              className="border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cvv"
              type="text"
              placeholder="CVV"
              onChange={formCreditCard.handleChange}
              onBlur={formCreditCard.handleBlur}
            />
            {formCreditCard.errors.cvv && formCreditCard.touched.cvv && (
              <p className="text-xs text-red-500">
                {formCreditCard.errors.cvv}
              </p>
            )}
          </div>
    
            
            <button
              onClick={redirect("/cart-message")}
              type="submit"
              className="w-full mt-4 p-2 h-12 border text-white text-sm capitalize cursor-pointer mx-1 my-0.5 bg-[--color-cart-text-button-comp] "
            >
              Pagar
            </button>

            <p className="mt-2 text-xs text-justify">
              El precio total a pagar, incluidos los impuestos y gastos
              adicionales (si los hubiera), se indican claramente en la página
              de pago. Al hacer clic en "Pagar", usted autoriza el cargo
              correspondiente en su método de pago seleccionado
            </p>
          </form>
        
        </section>

</div>
      
    </>
  );
}