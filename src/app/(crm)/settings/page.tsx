"use client";

import { useEffect } from "react";

import {
  useForm,
} from "react-hook-form";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  User,
  Lock,
  Palette,
  Save,
  Loader2,
} from "lucide-react";

import { useAuthStore } from "../../../store/authstore";

import {
  useUpdateProfile,
  useUpdatePassword,
} from "../../../hooks/use-settings";

import {
  profileSchema,
  passwordSchema,
  type ProfileFormValues,
  type PasswordFormValues,
} from "../../../schemas/settings";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const {
    user,
    setUser,
  } = useAuthStore();

  const updateProfile =
    useUpdateProfile();

  const updatePassword =
    useUpdatePassword();

  
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: {
      errors: profileErrors,
    },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),

    defaultValues: {
      name: "",
    },
  });

  
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: {
      errors: passwordErrors,
    },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),

    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

 
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name,
      });
    }
  }, [user, resetProfile]);

 
  const onProfileSubmit = async (
    data: ProfileFormValues
  ) => {
    try {
      const result =
        await updateProfile.mutateAsync(data);

      // Update Zustand with updated user
      setUser(result.user);

      alert(
        "Profile updated successfully"
      );
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    }
  };

  
  const onPasswordSubmit = async (
    data: PasswordFormValues
  ) => {
    try {
      await updatePassword.mutateAsync(
        data
      );

      resetPassword();

      alert(
        "Password updated successfully"
      );
    } catch (error) {
      console.error(
        "Password update error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update password"
      );
    }
  };

  return (
    <div className="space-y-6 p-6">

      
      <div>
        <h1 className="text-2xl font-semibold text-[#2F3529]">
          Settings
        </h1>

        <p className="mt-1 text-sm text-[#687060]">
          Manage your account and preferences.
        </p>
      </div>


     
      <section className="rounded-xl border border-[#d9d2bd] bg-white shadow-sm">

        <div className="flex items-center gap-3 border-b border-[#d9d2bd] p-5">

          <div className="rounded-lg bg-[#F2E8CF] p-2.5">
            <User className="h-5 w-5 text-[#59664A]" />
          </div>

          <div>
            <h2 className="font-semibold text-[#2F3529]">
              Profile
            </h2>

            <p className="text-sm text-[#687060]">
              Update your personal information.
            </p>
          </div>

        </div>


        <form
          onSubmit={handleProfileSubmit(
            onProfileSubmit
          )}
        >

          <div className="grid gap-5 p-5 md:grid-cols-2">

            {/* NAME */}

            <div className="space-y-2">

              <Label htmlFor="name">
                Name
              </Label>

              <Input
                id="name"
                {...registerProfile("name")}
                placeholder="Enter your name"
                className="focus-visible:ring-[#A3B18A]"
              />

              {profileErrors.name && (
                <p className="text-xs text-red-500">
                  {
                    profileErrors.name
                      .message
                  }
                </p>
              )}

            </div>


            {/* EMAIL */}

            <div className="space-y-2">

              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                value={user?.email || ""}
                disabled
                className="bg-gray-50"
              />

              <p className="text-xs text-[#687060]">
                Email cannot be changed here.
              </p>

            </div>


            {/* ROLE */}

            <div className="space-y-2">

              <Label>
                Role
              </Label>

              <div className="flex h-10 items-center rounded-md border border-input bg-[#F2E8CF]/40 px-3 text-sm font-medium text-[#59664A]">
                {user?.role || "User"}
              </div>

            </div>

          </div>


          {/* PROFILE BUTTON */}

          <div className="flex justify-end border-t border-[#d9d2bd] p-5">

            <Button
              type="submit"
              disabled={
                updateProfile.isPending
              }
              className="bg-[#A3B18A] text-white hover:bg-[#87966F]"
            >

              {updateProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}

            </Button>

          </div>

        </form>

      </section>


     
      <section className="rounded-xl border border-[#d9d2bd] bg-white shadow-sm">

        <div className="flex items-center gap-3 border-b border-[#d9d2bd] p-5">

          <div className="rounded-lg bg-[#F2E8CF] p-2.5">
            <Lock className="h-5 w-5 text-[#59664A]" />
          </div>

          <div>
            <h2 className="font-semibold text-[#2F3529]">
              Account Security
            </h2>

            <p className="text-sm text-[#687060]">
              Change your account password.
            </p>
          </div>

        </div>


        <form
          onSubmit={handlePasswordSubmit(
            onPasswordSubmit
          )}
        >

          <div className="grid gap-5 p-5 md:grid-cols-2">

           

            <div className="space-y-2">

              <Label htmlFor="currentPassword">
                Current Password
              </Label>

              <Input
                id="currentPassword"
                type="password"
                {...registerPassword(
                  "currentPassword"
                )}
                placeholder="Enter current password"
              />

              {passwordErrors.currentPassword && (
                <p className="text-xs text-red-500">
                  {
                    passwordErrors
                      .currentPassword
                      .message
                  }
                </p>
              )}

            </div>


            

            <div className="space-y-2">

              <Label htmlFor="newPassword">
                New Password
              </Label>

              <Input
                id="newPassword"
                type="password"
                {...registerPassword(
                  "newPassword"
                )}
                placeholder="Enter new password"
              />

              {passwordErrors.newPassword && (
                <p className="text-xs text-red-500">
                  {
                    passwordErrors
                      .newPassword
                      .message
                  }
                </p>
              )}

            </div>



            <div className="space-y-2 md:col-span-2">

              <Label htmlFor="confirmPassword">
                Confirm New Password
              </Label>

              <Input
                id="confirmPassword"
                type="password"
                {...registerPassword(
                  "confirmPassword"
                )}
                placeholder="Confirm new password"
                className="md:max-w-[50%]"
              />

              {passwordErrors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {
                    passwordErrors
                      .confirmPassword
                      .message
                  }
                </p>
              )}

            </div>

          </div>


          {/* PASSWORD BUTTON */}

          <div className="flex justify-end border-t border-[#d9d2bd] p-5">

            <Button
              type="submit"
              disabled={
                updatePassword.isPending
              }
              variant="outline"
              className="border-[#A3B18A] text-[#59664A] hover:bg-[#F2E8CF]"
            >

              {updatePassword.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Update Password
                </>
              )}

            </Button>

          </div>

        </form>

      </section>

    </div>
  );
}