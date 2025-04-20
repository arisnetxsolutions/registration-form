"use client";
import React, { useState, useEffect, useRef } from "react";
import api from "../api/axiosConfig";
interface ValidateOTPProps {
  email: string;
  token: string;
  onValidationComplete: (token: string) => void;
}
const ValidateOTP: React.FC<ValidateOTPProps> = ({ email, token, onValidationComplete }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutos
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  // Temporizador para reenvío del código
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  // Manejar cambio de cada campo del OTP
  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Enfocar el siguiente campo si se ingresó un número
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Si se completó el OTP, enviar automáticamente
    if (newOtp.every((digit) => digit !== "")) {
      handleSubmit();
    }
  };
  useEffect(() => {
    // Verifica si todos los campos de OTP están llenos
    if (otp.every((digit) => digit !== "")) {
      handleSubmit(); // Llama a handleSubmit si el OTP está completo
    }
  }, [otp]);
  // Manejar retroceso entre campos del OTP
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  // Manejar pegado de código OTP
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const newOtp = pasteData.split("");
      setOtp(newOtp);
      newOtp.forEach((digit, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index]!.value = digit;
        }
      });
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };
  // Enviar OTP a la API para validación
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setMessage("");
    try {
      const data = { email, otp: otp.join(""), token };
      // Llamada a la API para validar el OTP
      const response = await api.post(`/api/v2/ValidateOTP`, data);
      if (response.status === 200) {
        console.log("🚀 ~ handleSubmit ~ response:", response);
        setMessage("✅ OTP successfully validated. Redirecting...");
        localStorage.removeItem("auth"); // Limpiar token de registro
        setTimeout(() => onValidationComplete(response.data.token), 2000);
      }
    } catch (error) {
      setMessage("❌ Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  // Reenviar código OTP
  const handleResendOTP = async () => {
    setIsSubmitting(true);
    setMessage("");
    setCanResend(false);
    setTimer(120); // Reiniciar temporizador
    try {
      await api.post("/api/v2/ResendOTP", { email });
      setMessage("✅ A new OTP has been sent to your email.");
    } catch (error) {
      setMessage("❌ Error resending OTP. Please try again.");
      setCanResend(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Formatear el tiempo restante del temporizador
  const formatTime = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
  // Verifica si el OTP está vacío
  const isOtpEmpty = otp.every((digit) => digit === "");
  return (
    <div className="  flex   justify-center">
      <div className="max-w-xl w-full bg-white p-8  ">
        <h2 className="text-2xl font-bold mb-4">Validate OTP</h2>
        <p className="mb-4">
          A verification code has been sent to your email: <strong>{email}</strong>
        </p>
        {/* Formulario OTP */}
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                maxLength={1}
                aria-label={`OTP digit ${index + 1}`}
                className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:ring-2 focus:ring-delv-500"
              />
            ))}
          </div>
          {/* Botón de validación */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 text-white bg-delv-400 rounded-lg font-medium hover:bg-delv-500 transition-colors disabled:opacity-50"
            onClick={handleSubmit}
          >
            {isSubmitting ? "Validating..." : "Validate OTP"}
          </button>
        </form>
        {/* Mensaje de estado */}
        {message && <p className="mt-4 text-sm text-center text-green-600">{message}</p>}
        {/* Opción para reenviar OTP */}
        <div className="mt-4 text-center">
          {canResend && isOtpEmpty ? (
            <button
              onClick={handleResendOTP}
              disabled={isSubmitting}
              className="text-delv-500 hover:underline disabled:opacity-50"
            >
              Resend OTP code
            </button>
          ) : (
            <p className="text-sm text-gray-600">
              You can resend the code in: <strong>{formatTime(timer)}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default ValidateOTP;
