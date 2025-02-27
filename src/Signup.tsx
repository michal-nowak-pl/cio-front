import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface SignupFormInputs {
  firstName: string;
  email: string;
}

const Signup: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormInputs>();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [apiToken, setApiToken] = useState<string | null>(null);

  const onSubmit: SubmitHandler<SignupFormInputs> = async (data) => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      console.log("result:", result); // Log the error code
      console.log("Error code:", result.error_code); // Log the error code

      if (response.ok) {
        setMessage("Account created successfully!");
        console.log("response headers: ", response.headers); // Log the API token
        const token = response.headers.get("X-Api-Token");
        if (token) {
          setApiToken(token);
          localStorage.setItem("apiToken", token); // Store the token in local storage
        }
      } else {
        if (result.error_code === "email_taken") {
          setMessage("Email is already taken. Please use a different email.");
        } else {
          setMessage(result.message || "Signup failed");
        }
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        
        {message && (
          <div className={`p-3 mb-4 text-center rounded ${message.includes("success") ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              {...register("firstName", { required: "First name is required" })}
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-300"
            />
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Invalid email format" } })}
              className="mt-1 p-2 w-full border rounded-lg focus:ring focus:ring-blue-300"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg font-bold transition"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
