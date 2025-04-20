"use client"
import type React from "react"
import { useState } from "react"
import RegistrationForm from "./RegistrationForm"
import ValidateOTP from "./ValidateOTP"
const generarToken = (longitud: number) => {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < longitud; i++) {
    token += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return token; // ✅ Se retorna el token generado
}
interface EmbeddableRegistrationProps {
  redirectUrl: string;
  signInUrl: string;
}
const EmbeddableRegistration: React.FC<EmbeddableRegistrationProps> = ({ redirectUrl, signInUrl }) => {
  const [currentStep, setCurrentStep] = useState<"register" | "validate">("register")
  const [email, setEmail] = useState("")
  const token = generarToken(13) // ✅ Generar token de
  const handleRegistrationComplete = (registeredEmail: string) => {
    setEmail(registeredEmail)
    setCurrentStep("validate")
  }
  const handleValidationComplete = (token: string) => {
    console.log("Validación completada con éxito")
    location.href = redirectUrl + `?token=${token}` // ✅ Redirigir al dashboard
  }
  return (
    <div className="embeddable-registration">
      {currentStep === "register" ? (
        <RegistrationForm token={token} signInUrl={signInUrl} onRegistrationComplete={handleRegistrationComplete} />
      ) : (
        <ValidateOTP email={email} token={token} onValidationComplete={handleValidationComplete} />
      )}
    </div>
  )
}
export default EmbeddableRegistration
