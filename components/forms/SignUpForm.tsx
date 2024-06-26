"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const FormSchema = z
	.object({
		firstName: z.string().min(1, "First Name is required").max(50),
		lastName: z.string().min(1, "Last Name is required").max(50),
		username: z
			.string()
			.min(1, "Username is required")
			.min(5, "Username must have more than 4 characters")
			.max(50),
		email: z.string().min(1, "Email is required").email("Invalid email"),
		password: z
			.string()
			.min(1, "Password is required")
			.min(9, "Password must have more than 8 characters"),
		confirmPassword: z.string().min(1, "Password confirmation is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Password do not match",
	});

const SignUpForm = () => {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const submitData = async (values: z.infer<typeof FormSchema>) => {
		const response = await fetch("/api/users", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				firstName: values.firstName,
				lastName: values.lastName,
				username: values.username,
				email: values.email,
				password: values.password,
			}),
		});
		const data = await response.json();
		if (response.ok) {
			toast.success(data.message);

			const signInData = await signIn("credentials", {
				username: values.username,
				password: values.password,
				redirect: false,
			});

			if (signInData?.error) {
				toast.error("Something went wrong");
				router.push("/sign-in");
			} else {
				router.push("/dashboard");
				router.refresh();
			}
		} else {
			toast.error(data.message);
		}
	};

	return (
		<form
			className="min-h-screen flex flex-col w-full h-full pb-6 bg-white rounded-3xl"
			onSubmit={handleSubmit(submitData)}
		>
			<div className="container max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-2 w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
				<div className="bg-white px-6 py-8  rounded  text-black w-full">
					<h3 className="mb-8 text-4xl font-extrabold text-indigo-950 text-center">
						Sign Up
					</h3>
					<a className="flex items-center justify-center w-full py-4 mb-6 text-sm font-medium transition duration-300 rounded-2xl text-indigo-900 bg-slate-100 hover:bg-slate-200 focus:ring-4 focus:ring-slate-300">
						<img
							className="h-5 mr-2"
							src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/motion-tailwind/img/logos/logo-google.png"
							alt=""
						/>
						Sign up with Google
					</a>
					<div className="flex items-center mb-3">
						<hr className="h-0 border-b border-solid border-slate-200 grow" />
						<p className="mx-4 text-slate-400">or</p>
						<hr className="h-0 border-b border-solid border-slate-200 grow" />
					</div>
					<div className="grid gap-x-6 grid-cols-2 w-full">
						<div>
							<label
								htmlFor="firstName"
								className="mb-2 text-sm text-start text-indigo-950"
							>
								First Name*
							</label>
							<input
								type="text"
								className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-slate-200 mb-6 placeholder:text-slate-500/85 bg-slate-100 text-indigo-950 rounded-2xl"
								placeholder="First Name"
								{...register("firstName")}
							/>

							{errors.firstName && (
								<div className="-mt-6 mb-3">
									<span className="text-red-700 text-xs">
										{errors.firstName.message}
									</span>
								</div>
							)}
						</div>
						<div>
							<label
								htmlFor="lastName"
								className="mb-2 text-sm text-start text-indigo-950"
							>
								Last Name*
							</label>
							<input
								type="text"
								className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-slate-200 mb-6 placeholder:text-slate-500/85 bg-slate-100 text-indigo-950 rounded-2xl"
								placeholder="Last Name"
								{...register("lastName")}
							/>

							{errors.lastName && (
								<div className="-mt-6 mb-3">
									<span className="text-red-700 text-xs ml-2 -mt-2">
										{errors.lastName.message}
									</span>
								</div>
							)}
						</div>
					</div>

					<label
						htmlFor="username"
						className="mb-2 text-sm text-start text-indigo-950"
					>
						Username*
					</label>
					<input
						type="text"
						className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-slate-200 mb-6 placeholder:text-slate-500/85 bg-slate-100 text-indigo-950 rounded-2xl"
						placeholder="Username"
						{...register("username")}
					/>
					{errors.username && (
						<div className="-mt-6 mb-3">
							<span className="text-red-700 text-xs -mt-5">
								{errors.username.message}
							</span>
						</div>
					)}
					<label
						htmlFor="email"
						className="mb-2 text-sm text-start text-indigo-950"
					>
						Email*
					</label>
					<input
						type="text"
						className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-slate-200 mb-6 placeholder:text-slate-500/85 bg-slate-100 text-indigo-950 rounded-2xl"
						placeholder="Email"
						{...register("email")}
					/>
					{errors.email && (
						<div className="-mt-6 mb-3">
							<span className="text-red-700 text-xs -mt-5">
								{errors.email.message}
							</span>
						</div>
					)}
					<label
						htmlFor="password"
						className="mb-2 text-sm text-start text-indigo-950"
					>
						Password*
					</label>
					<input
						type="password"
						className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-slate-200 mb-6 placeholder:text-slate-500/85 bg-slate-100 text-indigo-950 rounded-2xl"
						placeholder="Password"
						autoComplete="on"
						{...register("password")}
					/>
					{errors.password && (
						<div className="-mt-6 mb-3">
							<span className="text-red-700 text-xs -mt-5">
								{errors.password.message}
							</span>
						</div>
					)}
					<label
						htmlFor="confirmPassword"
						className="mb-2 text-sm text-start text-indigo-950"
					>
						Confirm Password*
					</label>
					<input
						type="password"
						className="flex items-center w-full px-5 py-4 mr-2 text-sm font-medium outline-none focus:bg-slate-200 mb-6 placeholder:text-slate-500/85 bg-slate-100 text-indigo-950 rounded-2xl"
						placeholder="Confirm Password"
						autoComplete="on"
						{...register("confirmPassword")}
					/>
					{errors.confirmPassword && (
						<div className="-mt-6 mb-3">
							<span className="text-red-700 text-xs -mt-5">
								{errors.confirmPassword.message}
							</span>
						</div>
					)}

					<button
						type="submit"
						className="w-full text-center mt-3 px-6 py-5 mb-6 text-sm font-bold leading-none text-white transition duration-300 md:w-96 rounded-2xl hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-100 bg-indigo-500"
					>
						Create Account
					</button>
					<p className="text-sm leading-relaxed text-indigo-950 text-center">
						Already have an account?&nbsp;
						<a href="/sign-in" className="font-bold text-slate-500/85">
							Sign in
						</a>
					</p>
				</div>
			</div>
		</form>
	);
};
export default SignUpForm;
