"use client";

import React, { useActionState, useState, useEffect } from "react";
import BackButton from "@/components/settings/BackButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction } from "@/actions/auth/change-password";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/shared/buttons/SubmitButton";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ChangePasswordComponent = () => {
  const router = useRouter();
  const [state, formAction] = useActionState(changePasswordAction, {
    success: false,
    errors: {},
    message: "",
    values: {},
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    console.log(state);
    if (state.success) {
      toast.success("Password Changed Successfully");
      router.push("/settings");
    }
  }, [state?.success, router]);

  return (
    <section id="change-password" className="p-4 flex flex-col gap-4">
      <header className="flex items-center gap-4">
        <BackButton backUrl="/settings" />
        <h1 className="text-3xl">Settings | Change Password</h1>
      </header>

      <section
        id="change-password-form-ctn"
        className="flex flex-col gap-4 mt-8 max-w-md"
      >
        <form action={formAction} className="flex flex-col gap-6">
          {state?.errors?.root && (
            <div className="text-red-500 text-sm">
              {state.errors.root.map((error, idx) => (
                <p key={idx}>{error}</p>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="current-password"
              className="text-gray-500 font-normal"
            >
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                name="current-password"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter your current password"
                className="w-full h-12 text-lg pr-10"
                defaultValue={state?.values?.currentPassword || ""}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {state?.errors?.currentPassword && (
              <span className="text-red-500 text-sm">
                {state.errors.currentPassword[0]}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="new-password" className="text-gray-500 font-normal">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                name="new-password"
                type={showNew ? "text" : "password"}
                placeholder="Enter your new password"
                className="w-full h-12 text-lg pr-10"
                defaultValue={state?.values?.newPassword || ""}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {state?.errors?.newPassword && (
              <span className="text-red-500 text-sm">
                {state.errors.newPassword[0]}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="confirm-password"
              className="text-gray-500 font-normal"
            >
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your new password"
                className="w-full h-12 text-lg pr-10"
                defaultValue={state?.values?.confirmPassword || ""}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {state?.errors?.confirmPassword && (
              <span className="text-red-500 text-sm">
                {state.errors.confirmPassword[0]}
              </span>
            )}
          </div>

          <SubmitButton
            label="Change Password"
            loadingLabel="Changing Password..."
            className="w-full mt-4"
          />
        </form>
      </section>
    </section>
  );
};

export default ChangePasswordComponent;
