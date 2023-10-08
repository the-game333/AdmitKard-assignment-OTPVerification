import { BsFillShieldLockFill, BsTelephoneFill } from "react-icons/bs";
import { CgSpinner } from "react-icons/cg";
import logo from "./images/logo.png"
import twologo from "./images/twologo.png"
import thirdlogo from "./images/thirdlogo.png"
import OtpInput from "otp-input-react";
import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { auth } from "./firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";

const App = () => {
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [user, setUser] = useState(null);
  const [errorOtp, setErrorOtp] = useState(false);
  const [errorPh, setErrorPh] = useState(false);

  function onCaptchVerify() {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignup();
          },
          "expired-callback": () => {},
        },
        auth
      );
    }
  }

  function onSignup() {
    setLoading(true);
    onCaptchVerify();

    const appVerifier = window.recaptchaVerifier;

    const formatPh = "+" + ph;

    signInWithPhoneNumber(auth, formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        setErrorPh(false);
        toast.success("OTP sended successfully!");
      })
      .catch((error) => {
        setShowOTP(false);
        setErrorPh(true);
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        console.log(res);
        setUser(res.user);
        setLoading(false);
        setErrorOtp(false);
      })
      .catch((err) => {
        setErrorOtp(true);
        console.log(err);
        setLoading(false);
      });
  }
 function changeNumber(){
  console.log("hello");
  setShowOTP(false);
  setPh("");
 }
  return (
    <section className="bg-stone-50 flex items-center justify-center">
      <div>
        <Toaster toastOptions={{ duration: 4000 }} />
        <div id="recaptcha-container"></div>

                {/* This is the last page, show this when OTP is verified and user is set */}

        {user ? (
          <div className="w-80 flex flex-col gap-2 rounded-lg p-4" style={{height:"100%",marginTop:"5%"}}>
            <img src={thirdlogo} alt="BigCo Inc. logo" style={{height:"260px",width:"100%"}}/>
            <h4 className="text-center text-xl font-bold text-black my-4">Welcome to Admit Kard</h4>
            <p className="text-sm text-slate-500 text-center my-4">In order to provide you with the customer experience,
             <br/><span className="text-center font-bold text-sm text-zinc-500">we need to ask you a few questions.</span>
             </p>
                <button
                  className="bg-amber-400 flex items-center justify-center py-2.5 text-white rounded-3xl my-2"
                  style={{marginTop:"10px"}}
                ><span>Get Started</span>
                </button>
                <p className="text-center text-sm text-slate-500">*This will only take 5 mins.</p>
          </div>
        ) : (


          <div className="w-80 flex flex-col gap-4 rounded-lg p-4" style={{height:"100%",marginTop:"15%"}}>
            

            { /* If there is OTP, show below component otherwise the other component */ }

            {showOTP ? (
              <>
                <div className="flex items-center justify-center">

                <img src={twologo} alt="BigCo Inc. logo" style={{height:"100%",width:"55%"}}/>
               
                </div>
                <h1 className="text-center text-l text-zinc-600 my-1">Please Verify Mobile number</h1>
                <p className="text-center text-xs text-zinc-600 my-2">An OTP is sent to <span className="font-bold text-zinc-500">+{ph}</span> </p>
               <button onClick={changeNumber} className="font-bold text-sm text-yellow-400 text-center underline">Change Phone Number
               </button>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  OTPLength={6}
                  otpType="number"
                  disabled={false}
                  autoFocus
                  className="opt-container border-2"
                ></OtpInput>
                <h4 className="text-center text-l text-zinc-600 my-2">Didn't receive code? <button className="font-bold text-sm text-yellow-400 text-center">Resend</button></h4>
                {errorOtp && <p className="text-center font-bold text-orange-600 text-xs ">Wrong OTP!!!</p>}
                <button
                  onClick={onOTPVerify}
                  className="bg-amber-400 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded-3xl"
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Verify</span>
                </button>
              </>
            ) : (
              <>

                {/* This is the first page component that you will see  */}

                <img src={logo} alt="BigCo Inc. logo"/>
            <h1 className="text-center leading-normal text-slate-700 font-medium text-2xl" style={{marginTop:"25px"}}>
              Welcome Back
            </h1>
                <label
                  htmlFor=""
                  className="text-l text-slate-500 text-center"
                  style={{marginTop:"5px"}}
                >
                  Please sign in to your account
                </label>
                <PhoneInput country={"in"} value={ph} onChange={setPh} style={{marginTop:"65px"}}/>
                <p className="text-xs text-slate-500 text-center">We will send you a one time SMS message. <br/>Charges may apply.</p>
                {errorPh && <p className="text-center font-bold text-orange-600 text-xs ">Wrong Phone Number!!   Or limit exceeded.</p>}
                <button
                  onClick={onSignup}
                  className="bg-amber-400 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded-3xl"
                  style={{marginTop:"30px"}}
                >
                  {loading && (
                    <CgSpinner size={20} className="mt-1 animate-spin" />
                  )}
                  <span>Sign in with OTP</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default App;
