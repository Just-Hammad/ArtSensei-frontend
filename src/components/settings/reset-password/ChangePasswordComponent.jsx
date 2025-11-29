"use client";

import { useActionState, useState, useEffect } from "react";
import BackButton from "@/components/settings/BackButton";
import { Input } from "@/components/ui/input";
import { changePasswordAction } from "@/actions/auth/change-password";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/shared/buttons/SubmitButton";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import PasswordSuccessScreen from "./ChangePasswordSuccessScreen";
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
  const [focusedField, setFocusedField] = useState(null);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  useEffect(() => {
    console.log(state);
    if (state.success) {
      setShowSuccessScreen(true);
    }
  }, [state, router]);

  const hasError = (fieldName) => {
    return state?.errors?.[fieldName];
  };

  return (
    <section
      id="change-password"
      className="min-h-[100dvh] p-4 sm:p-5 flex flex-col"
    >
      {showSuccessScreen && (
        <div className="z-[1000]">
          <PasswordSuccessScreen
            onBackToSettings={() => setShowSuccessScreen(false)}
          />
        </div>
      )}
      <header className="flex items-center gap-3 mb-8 sm:mb-10">
        <BackButton backUrl="/settings" />
        <div>
          <h1 className="text-2xl sm:text-xl font-semibold text-gray-900 tracking-tight">
            Change Password
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Update your password to keep your account secure
          </p>
        </div>
      </header>

      <section
        id="change-password-form-ctn"
        className="flex flex-col gap-6 w-full flex-1"
      >
        <form action={formAction} className="flex flex-col gap-6">
          {state?.errors?.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  {state.errors.root.map((error, idx) => (
                    <p key={idx} className="text-red-700 text-sm font-medium">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="current-password"
              className={`text-sm font-medium transition-all duration-200 ${
                focusedField === "current" || state?.values?.currentPassword
                  ? "text-gray-900"
                  : "text-gray-700"
              }`}
            >
              Current Password
            </label>
            <div className="relative group">
              <Input
                id="current-password"
                name="current-password"
                type={showCurrent ? "text" : "password"}
                placeholder="Enter your current password"
                onFocus={() => setFocusedField("current")}
                onBlur={() => setFocusedField(null)}
                className={`w-full h-12 text-base px-4 pr-12 bg-white transition-all duration-200 border-2 ${
                  hasError("currentPassword")
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-gray-200 focus:border-gray-700 focus:ring-gray-500/5"
                } rounded-lg placeholder:text-gray-500`}
                defaultValue={state?.values?.currentPassword || ""}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className={`absolute inset-y-0 right-0 flex items-center justify-center w-12 transition-all duration-200 ${
                  showCurrent
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showCurrent ? (
                  <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                ) : (
                  <Eye className="h-5 w-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
            {hasError("currentPassword") && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="text-red-600 text-xs font-medium">
                  {state.errors.currentPassword[0]}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="new-password"
              className={`text-sm font-medium transition-all duration-200 ${
                focusedField === "new" || state?.values?.newPassword
                  ? "text-gray-900"
                  : "text-gray-700"
              }`}
            >
              New Password
            </label>
            <div className="relative group">
              <Input
                id="new-password"
                name="new-password"
                type={showNew ? "text" : "password"}
                placeholder="Create a strong new password"
                onFocus={() => setFocusedField("new")}
                onBlur={() => setFocusedField(null)}
                className={`w-full h-12 text-base px-4 pr-12 bg-white transition-all duration-200 border-2 ${
                  hasError("newPassword")
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-gray-200 focus:border-gray-700 focus:ring-gray-500/5"
                } rounded-lg placeholder:text-gray-500`}
                defaultValue={state?.values?.newPassword || ""}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className={`absolute inset-y-0 right-0 flex items-center justify-center w-12 transition-all duration-200 ${
                  showNew
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showNew ? (
                  <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                ) : (
                  <Eye className="h-5 w-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
            {hasError("newPassword") && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="text-red-600 text-xs font-medium">
                  {state.errors.newPassword[0]}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirm-password"
              className={`text-sm font-medium transition-all duration-200 ${
                focusedField === "confirm" || state?.values?.confirmPassword
                  ? "text-gray-900"
                  : "text-gray-700"
              }`}
            >
              Confirm New Password
            </label>
            <div className="relative group">
              <Input
                id="confirm-password"
                name="confirm-password"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your new password"
                onFocus={() => setFocusedField("confirm")}
                onBlur={() => setFocusedField(null)}
                className={`w-full h-12 text-base px-4 pr-12 bg-white transition-all duration-200 border-2 ${
                  hasError("confirmPassword")
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                    : "border-gray-200 focus:border-gray-700 focus:ring-gray-500/5"
                } rounded-lg placeholder:text-gray-500`}
                defaultValue={state?.values?.confirmPassword || ""}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className={`absolute inset-y-0 right-0 flex items-center justify-center w-12 transition-all duration-200 ${
                  showConfirm
                    ? "text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {showConfirm ? (
                  <EyeOff className="h-5 w-5" strokeWidth={1.5} />
                ) : (
                  <Eye className="h-5 w-5" strokeWidth={1.5} />
                )}
              </button>
            </div>
            {hasError("confirmPassword") && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                <span className="text-red-600 text-xs font-medium">
                  {state.errors.confirmPassword[0]}
                </span>
              </div>
            )}
          </div>

          <SubmitButton
            label="Change Password"
            loadingLabel="Updating Password..."
            className="w-full h-12 mt-4 sm:mt-6 font-medium text-base"
          />

          <div className="flex items-start gap-2 pt-4 border-t border-gray-200">
            <AlertCircle className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 leading-relaxed">
              Password must be at least 6 characters long and include a letter,
              a number, and a special character.
            </p>
          </div>
        </form>
      </section>
    </section>
  );
};

export default ChangePasswordComponent;
