import SignUpForm from "@/app/components/form/SignUpForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  return <SignUpForm />;
};

export default page;
