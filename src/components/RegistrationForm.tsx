import type React from "react";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import Link from "next/link";
import api from "../api/axiosConfig";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const formSchema = z.object({
  firstName: z.string().min(2, "First name must have at least 2 characters"),
  lastName: z.string().min(2, "Last name must have at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and conditions" }),
  }),
  token: z.string().length(13, "Invalid token"),
});
type FormData = z.infer<typeof formSchema>;
interface RegistrationFormProps {
  token: string
  signInUrl: string;
  onRegistrationComplete: (email: string, token: string) => void;
}
const RegistrationForm: React.FC<RegistrationFormProps> = ({ token, signInUrl, onRegistrationComplete }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    termsAccepted: true,
    token: token
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const registerUser = async (userData: any) => {
    try {
      setIsSubmitting(true);
      await api.post("api/v2/Registration_form", userData);
      onRegistrationComplete(userData.email, token);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleGoogleSignIn = async () => {
    console.log("Google Sign-In initiated");
    const provider = new GoogleAuthProvider();
    try {
      setIsSubmitting(true);
      if (auth.currentUser) {
        console.log("User already signed in:", auth.currentUser);
        const userData = {
          firstName: auth.currentUser.displayName?.split(" ")[0] || "N/A",
          lastName: auth.currentUser.displayName?.split(" ")[1] || "N/A",
          email: auth.currentUser.email || "",
          password: auth.currentUser.uid, // Placeholder (no se usa realmente)
          termsAccepted: true,
          token: token
        };
        await registerUser(userData);
        return;
      }
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Sign-In successful", user);
      // Construcción del objeto con datos de Google
      const userData = {
        firstName: user.displayName?.split(" ")[0] || "N/A",
        lastName: user.displayName?.split(" ")[1] || "N/A",
        email: user.email || "",
        password: user.uid, // Placeholder para evitar validaciones
        termsAccepted: true,
        token: token
      };
      await registerUser(userData);
    } catch (error: any) {
      console.error("Google Sign-In error", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      const validatedData = formSchema.parse(formData);
      await registerUser(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.formErrors.fieldErrors);
      } else {
        console.error("Error submitting form:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="space-y-4">
        <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-2 py-2 px-4 border rounded-full hover:bg-gray-50">
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </button>
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative bg-white px-4 text-sm text-gray-500">OR</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <div>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
              />
              <span>
                I accept the <a href="/terms" className="text-blue-600">Terms of Service</a> and
                <a href="/privacy" className="text-blue-600"> Privacy Policy</a>
              </span>
            </label>
            {errors.termsAccepted && <p className="mt-1 text-xs text-red-600">{errors.termsAccepted}</p>}
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full py-3 px-4 text-white bg-delv-400 rounded-lg font-medium hover:bg-delv-500 transition-colors">
            {isSubmitting ? "Submitting..." : "REGISTER AND APPLY"}
          </button>
          <div className="text-center text-sm ">
            Already have an account? <Link href={signInUrl || "/signIn"} className="text-purple-600 font-medium">Log in</Link>
          </div>
        </form>
      </div>
    </div >
  );
};
export default RegistrationForm;
