import { useState } from "react";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-80 h-[468px] p-4 bg-white rounded-2xl shadow-[0px_0px_28px_0px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-start gap-6">
        <div className="self-stretch h-72 flex flex-col justify-start items-start gap-2">
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div className="self-stretch justify-start text-black text-3xl font-semibold font-HindSiliguri">
              Log in
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <div className="self-stretch justify-start text-black text-lg font-medium font-HindSiliguri">
                  Mobile
                </div>
                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  required
                  className="self-stretch h-12 pl-6 pr-28 py-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-400 inline-flex justify-start items-center gap-2.5 text-base font-medium font-HindSiliguri"
                  placeholder="Mobile Number"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-1">
                <div className="self-stretch justify-start text-black text-lg font-medium font-HindSiliguri">
                  Password
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="self-stretch h-12 pl-6 pr-28 py-4 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-400 inline-flex justify-start items-center gap-2.5 text-base font-medium font-HindSiliguri"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <div className="self-stretch flex-1 justify-start text-black text-lg font-medium font-HindSiliguri underline">
            <a href="/forgot-password">Forget password</a>
          </div>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="self-stretch h-12 px-6 py-4 bg-red-700 rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-400 inline-flex justify-center items-center gap-2.5"
        >
          <div className="flex-1 text-center justify-start text-white text-base font-semibold font-HindSiliguri">
            Log in
          </div>
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
