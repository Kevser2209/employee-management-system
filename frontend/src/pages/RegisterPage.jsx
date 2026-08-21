import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import * as authService from "../services/authService";
import { getApiErrorMessage } from "../utils/apiError";
import { isValidEmail } from "../utils/validation";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.first_name.trim()) {
      nextErrors.first_name = "Ad zorunludur.";
    } else if (formData.first_name.trim().length > 100) {
      nextErrors.first_name = "Ad en fazla 100 karakter olabilir.";
    }

    if (!formData.last_name.trim()) {
      nextErrors.last_name = "Soyad zorunludur.";
    } else if (formData.last_name.trim().length > 100) {
      nextErrors.last_name = "Soyad en fazla 100 karakter olabilir.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "E-posta adresi zorunludur.";
    } else if (!isValidEmail(formData.email.trim())) {
      nextErrors.email = "Geçerli bir e-posta adresi girin.";
    }

    if (!formData.password) {
      nextErrors.password = "Şifre zorunludur.";
    } else if (formData.password.length < 8) {
      nextErrors.password = "Şifre en az 8 karakter olmalıdır.";
    } else if (formData.password.length > 128) {
      nextErrors.password = "Şifre en fazla 128 karakter olabilir.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await authService.register({
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      navigate("/login", { replace: true, state: { registered: true } });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "Kayıt işlemi tamamlanamadı."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-900">Kayıt Ol</h2>
      <p className="mt-1 text-sm text-slate-600">
        Yeni hesap oluşturmak için bilgilerinizi girin.
      </p>

      {submitError ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="first_name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Ad
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              autoComplete="given-name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
            {errors.first_name ? (
              <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="last_name" className="mb-1.5 block text-sm font-medium text-slate-700">
              Soyad
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              autoComplete="family-name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
            {errors.last_name ? (
              <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="ornek@sirket.com"
          />
          {errors.email ? (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
            Şifre
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="En az 8 karakter"
          />
          {errors.password ? (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          ) : null}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Zaten hesabınız var mı?{" "}
        <Link to="/login" className="font-medium text-slate-900 hover:underline">
          Giriş yapın
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
