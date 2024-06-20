const SignInForm = () => {
  return (
    <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5 py-5">
      <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
        <div className="flex items-center justify-center w-full ">
          <div className="flex items-center xl:p-10">
            <form className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl">
              <h3 className="mb-3 text-4xl font-extrabold text-indigo-950">
                Sign In
              </h3>
              <p className="mb-4 text-slate-500/85">
                Enter your username and password
              </p>
              <a className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-indigo-900 bg-slate-100 hover:bg-slate-200 focus:ring-4 focus:ring-slate-300">
                <img
                  className="h-5 mr-2"
                  src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
                  alt=""
                />
                Sign in with Google
              </a>
              <div className="flex items-center mb-3">
                <hr className="h-0 border-b border-solid border-slate-200 grow" />
                <p className="mx-4 text-slate-400">or</p>
                <hr className="h-0 border-b border-solid border-slate-200 grow" />
              </div>
              <label
                htmlFor="email"
                className="mb-2 text-sm text-start text-indigo-950"
              >
                Username*
              </label>
              <input
                id="username"
                type="username"
                placeholder="Enter a username"
                className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-slate-200 mb-7 placeholder:text-slate-500/85 bg-slate-100 text-indigo-950 rounded-2xl"
              />
              <label
                htmlFor="password"
                className="mb-2 text-sm text-start text-indigo-950"
              >
                Password*
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter a password"
                className="flex items-center w-full px-5 py-4 mb-5 mr-2 text-sm font-medium outline-none focus:bg-slate-200 placeholder:text-slate-500/85 bg-slate-100 text-indigo-950 rounded-2xl"
              />
              <div className="flex flex-row justify-between mb-8">
                <label className="relative inline-flex items-center mr-3 cursor-pointer select-none"></label>
                <a href="" className="mr-4 text-sm font-medium text-indigo-500">
                  Forgot password?
                </a>
              </div>
              <button className="w-full px-6 py-5 mb-5 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-100 bg-indigo-500">
                Sign In
              </button>
              <p className="text-sm leading-relaxed text-indigo-950">
                Not registered yet? &nbsp;
                <a href="/sign-up" className="font-bold text-slate-500/85">
                  Create an Account
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
