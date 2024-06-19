"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z
	.object({
		firstName: z.string().min(1, "Username is required").max(50),
		lastName: z.string().min(1, "Username is required").max(50),
		username: z.string().min(1, "Username is required").max(50),
		email: z.string().min(1, "Email is required").email("Invalid email"),
		password: z
			.string()
			.min(1, "Password is required")
			.min(8, "Password must have more than 8 characters"),
		confirmPassword: z.string().min(1, "Password confirmation is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Password do not match",
	});

const SignUpForm = () => {
	const { register, handleSubmit } = useForm<z.infer<typeof FormSchema>>({
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

	const submitData = (values: z.infer<typeof FormSchema>) => {
		console.log(values);
	};

	return (
		<form
			className="min-h-screen flex flex-col"
			onSubmit={handleSubmit(submitData)}
		>
			<div className="container max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-2">
				<div className="bg-white px-6 py-8 rounded shadow-md text-black w-auto">
					<h1 className="mb-8 text-3xl text-center">Sign up</h1>
					<div className="flex flex-row w-full">
						<input
							type="text"
							className="block border border-grey-light p-3 rounded mb-4 mr-2"
							placeholder="First Name"
							{...register("firstName")}
						/>

						<input
							type="text"
							className="block border border-grey-light p-3 rounded mb-4 ml-2"
							placeholder="Last Name"
							{...register("lastName")}
						/>
					</div>

					<input
						type="text"
						className="block border border-grey-light w-full p-3 rounded mb-4"
						placeholder="Username"
						{...register("username")}
					/>
					<input
						type="text"
						className="block border border-grey-light w-full p-3 rounded mb-4"
						placeholder="Email"
						{...register("email")}
					/>

					<input
						type="password"
						className="block border border-grey-light w-full p-3 rounded mb-4"
						placeholder="Password"
						{...register("password")}
					/>
					<input
						type="password"
						className="block border border-grey-light w-full p-3 rounded mb-4"
						placeholder="Confirm Password"
						{...register("confirmPassword")}
					/>

					<button
						type="submit"
						className="w-full text-center py-3 rounded bg-indigo-500 text-white hover:bg-indigo-600 focus:outline-none my-1"
					>
						Create Account
					</button>
				</div>

				<div className="text-grey-dark mt-6">
					Already have an account&nbsp;?&nbsp;
					<a
						className="no-underline border-b border-blue text-indigo-500"
						href="../login/"
					>
						Log in
					</a>
					.
				</div>
			</div>
		</form>
	);
};
export default SignUpForm;
