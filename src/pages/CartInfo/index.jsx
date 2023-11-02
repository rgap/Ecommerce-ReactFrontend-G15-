
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, ProductShoppingCart } from "../../components";
import { read, update } from "../../services";
import { counterProductos } from "../../slices/cartSlice";
import { useFormik } from "formik";
import { basicSchema } from "../../schemas";

export default function CartInfo() {
  const navigate = useNavigate();
  const globalUser = useSelector((state) => state.user.data);
  const globalCart = useSelector(counterProductos);
  const [personalData, setPersonalData] = useState([]);

  const total = globalCart.reduce((accumulator, product) => {
    const qty = product.quantity;
    const price = product.price;
    const subtotal = qty * price;
    return accumulator + subtotal;
  }, 0);

  const onSubmit = async (values, actions) => {
    await update(
      personalData.id,
      values,
      "users"
    );
    navigate("/cart-shipping")
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
    onSubmit,
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
    // console.log(personalData)
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
      <div className="lg:flex">
        <section className="cart-info-left lg:w-[55%] ml-10">
          <div className="mt-5">
            <img
              onClick={redirect("/")}
              className="h-[50px] md:h-[70px] hover:cursor-pointer "
              src="https://raw.githubusercontent.com/rgap/Ecommerce-G15-ImageRepository/main/images/logo/beautipol-textlogo.png"
              alt=""
            />
          </div>

          {globalUser ? (
            <> </>
          ) : (
            <section className="flex justify-center">
              <div className="flex flex-col items-center gap-2">
                <p className="text-lg  break-words"> ¿Ya tienes una cuenta? </p>
                <div className="border flex w-[120px] h-[40px] justify-center items-center gap-1 flex-shrink-0 ">
                  <Button
                    ruta="/login"
                    text="Ingresar"
                    type="submit"
                    variant="primary"
                    className="hover:cursor-pointer"
                  />
                </div>
                <p className="text-lg text-center"> o </p>
                <p className="text-lg break-words">!Registrate con nosotros!</p>
                <div className="border flex w-[120px] h-[40px] justify-center items-center gap-1 flex-shrink-0 ">
                  <Button
                    ruta="/register"
                    text="Registrarse"
                    type="submit"
                    variant="primary"
                    className="hover:cursor-pointer"
                  />
                </div>
              </div>
            </section>
          )}

          <div className="mt-8 flex flex-col items-center">
            <p className="text-lg capitalize leading-8 break-words mb-3">
              Direccion de Entrega
            </p>
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className="w-[300px] md:w-[400px] xl:w-[500px] mb-10 flex flex-col gap-2"
            >
              <div className="p-2 border border-gray-700">
                <input
                  className="w-full outline-none"
                  id="name"
                  type="text"
                  placeholder="Nombres Completos"
                  onChange={handleChange}
                  value={values.name}
                  onBlur={handleBlur}
                />
              </div>
              {errors.name && touched.name && (
                <p className="text-xs text-red-500"> {errors.name} </p>
              )}

              <div className="p-2 border border-gray-700">
                <input
                  className="w-full outline-none"
                  id="address"
                  type="text"
                  placeholder="Direccion"
                  onChange={handleChange}
                  value={values.address}
                  onBlur={handleBlur}
                />
              </div>
              {errors.address && touched.address && (
                <p className=" text-xs text-red-500"> {errors.address} </p>
              )}

              <div className="p-2 border border-gray-700 outline-none">
                <input
                  className="w-full outline-none"
                  id="city"
                  type="text"
                  placeholder="Ciudad"
                  onChange={handleChange}
                  value={values.city}
                  onBlur={handleBlur}
                />
              </div>
              {errors.city && touched.city && (
                <p className="text-xs text-red-500"> {errors.city} </p>
              )}

              <div className="p-2 border border-gray-700 outline-none">
                <input
                  className="w-full outline-none"
                  id="region"
                  type="text"
                  placeholder="Region"
                  onChange={handleChange}
                  value={values.region}
                  onBlur={handleBlur}
                />
              </div>
              {errors.region && touched.region && (
                <p className="text-xs text-red-500"> {errors.region} </p>
              )}

              <div className="p-2 border border-gray-700 outline-none">
                <input
                  className="w-full outline-none"
                  id="phoneNumber"
                  type="text"
                  placeholder="Telefono"
                  onChange={handleChange}
                  value={values.phoneNumber}
                  onBlur={handleBlur}
                />
              </div>
              {errors.phoneNumber && touched.phoneNumber && (
                <p className="text-xs text-red-500"> {errors.phoneNumber} </p>
              )}

              <div className="flex justify-center mb-4 mt-10">
                <div className="w-[500px] flex justify-between">
                  <div className="flex w-[190px] h-[40px] items-center">
                    <img
                      className="w-6 h-6"
                      src="https://raw.githubusercontent.com/rgap/Ecommerce-G15-ImageRepository/fcccf12acd7bdce6bdc28e60b4b662dfbffb70cd/icons/arrow_back.svg"
                      alt=""
                    />
                    <span
                      onClick={redirect("/cart")}
                      className="text-sm leading-6 cursor-pointer hover:underline"
                    >
                      Regresar
                    </span>
                  </div>
                  <div className="flex justify-end">
                    <div className="w-[200px] h-[40px]">
                      <Button text="Continuar con Envio" type="submit"/>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>

        <section className="max-lg:hidden cart-info-right lg:w-[45%] h-screen bg-[--color-bg] flex flex-col justify-start items-center">
          <div className="w-full flex justify-center">
            <span className="text-xl font-bold mt-10 mb-10">
              Carrito de Compras
            </span>
          </div>

          <div className="lg:w-[350px] xl:w-[450px]">
            {globalCart.map((product) => (
              <ProductShoppingCart
                productId={product.id}
                productImage={product.url}
                productTitle={product.name}
                productSize={product.size}
                productColor={product.color}
                productPrice={product.price}
                productQuantity={product.quantity}
                product={product}
                visible={true}
              />
            ))}
          </div>

          <div className="mt-5 flex flex-col w-full">
            <div className="flex justify-end gap-5 mx-5">
              <p className="mb-2 text-lg leading-8">
                Subtotal: <span> S/ {total} </span>
              </p>
            </div>
            <p className="mx-2 text-right text-xs">
              (*) El importe total que pagará sera calculado en la sección
              ENVIOS.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
