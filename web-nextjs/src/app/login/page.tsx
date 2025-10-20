"use client";
import { loginAction } from "@/actions/auth";
import { updateUser } from "@/stores/features/authSlice";
import { TextField, Button } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(5, "Password must be at least 5 characters")
    .required("Required"),
});

export default function LoginPage() {
  const router = useRouter();

  const form = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const res = await loginAction(values);
        if (!res || !res.success || !res.data?.user) {
          throw new Error(res.message || "Login failed");
        }
        updateUser(res.data?.user);
        localStorage.setItem("auth-token", res.data?.token || "");
        router.push("/");
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={form.handleSubmit}
        className="border border-gray-600 p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <div className="mb-4">
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            size="small"
            fullWidth
            value={form.values.email}
            onChange={form.handleChange}
            error={form.touched.email && !!form.errors.email}
          />
          {form.touched.email && form.errors.email ? (
            <div className="text-xs text-red-600 mt-1">{form.errors.email}</div>
          ) : null}
        </div>
        <div className="mb-6">
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            size="small"
            type="password"
            fullWidth
            value={form.values.password}
            onChange={form.handleChange}
            error={form.touched.password && !!form.errors.password}
          />
          {form.touched.password && form.errors.password ? (
            <div className="text-xs text-red-600 mt-1">
              {form.errors.password}
            </div>
          ) : null}
        </div>
        <Button type="submit" variant="contained" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
}
