"use server";

import { getClient } from "@/lib/Supabase/server";
import { validatePassword } from "@/utils/validators";

export async function changePasswordAction(prevState, formData) {
  const currentPassword = formData.get("current-password");
  const newPassword = formData.get("new-password");
  const confirmPassword = formData.get("confirm-password");
  const errors = {};

  if (!currentPassword || currentPassword.trim() === "") {
    errors.currentPassword = ["Current password is required"];
  }

  const newPasswordError = validatePassword(newPassword);
  if (newPasswordError) {
    errors.newPassword = [newPasswordError];
  }

  const confirmPasswordError = validatePassword(confirmPassword);
  if (confirmPasswordError) {
    errors.confirmPassword = [confirmPasswordError];
  }

  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    errors.confirmPassword = ["Passwords do not match"];
  }

  if (newPassword && currentPassword && newPassword === currentPassword) {
    errors.newPassword = ["New password must be different from current password"];
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      errors,
      values: {
        currentPassword,
        newPassword,
        confirmPassword
      }
    };
  }

  const supabase = await getClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      errors: { root: ["User not authenticated"] },
      values: {
        currentPassword,
        newPassword,
        confirmPassword
      }
    };
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });

  if (signInError) {
    return {
      success: false,
      errors: { currentPassword: ["Current password is incorrect"] },
      values: {
        currentPassword,
        newPassword,
        confirmPassword
      }
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return {
      success: false,
      errors: { root: [updateError.message] },
      values: {
        currentPassword,
        newPassword,
        confirmPassword
      }
    };
  }

  return {
    success: true,
    message: "Password changed successfully",
    values: {}
  };
}
