import SignInForm from "@/app/components/form/SignInForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  return <SignInForm />;
};

export default page;
