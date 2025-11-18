"use client";

import React from "react";
import Link from "next/link";
import { Settings, X, LogOut, HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavStore } from "@/store";
import ProfileImage from "./ProfileImage";
import {
  mainNavigationItems,
} from "@/store/navStore/navigationItems";
import { signOutAction } from "@/actions/auth/signout";

const SideNav = ({ user }) => {
  const { profile_image, full_name, email } = user.user_metadata || {};
  const { isOpen, closeNavBar } = useNavStore();

  return (
    <div className="">
      <div
        className={`fixed w-screen h-screen z-[100] bg-black/30 top-0 left-0 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeNavBar}
      />

      <div
        className={`fixed z-[1000] top-0 left-0 w-[280px] h-full bg-gray-50 shadow-xl shadow-black flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* close button */}
        <div className="absolute top-4 right-4">
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 cursor-pointer transition-all duration-200 hover:text-gray-800 active:shadow-[inset_0.125rem_0.125rem_0.25rem_rgba(163,177,198,0.6),inset_-0.125rem_-0.125rem_0.25rem_rgba(255,255,255,0.8)]"
            style={{
              boxShadow:
                "0.1875rem 0.1875rem 0.375rem rgba(163, 177, 198, 0.6), -0.1875rem -0.1875rem 0.375rem rgba(255, 255, 255, 0.8)",
            }}
            onClick={closeNavBar}
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ProfileImage
          profile_image={profile_image}
          full_name={full_name}
          email={email}
        />

        <div className="px-4">
          <Separator className="bg-gray-300" />
        </div>

        <nav className="flex-1 px-4 py-6 h-full flex flex-col justify-between">
          <div>
            <div className="mb-6">
              <h4 className="px-4 mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main
              </h4>
              <div className="flex flex-col space-y-1">
                {mainNavigationItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeNavBar}
                    className="flex items-center gap-4 px-4 py-3 text-gray-700 rounded-lg hover:bg-white/60 transition-all duration-200"
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
                <Link
                  href="/settings"
                  onClick={closeNavBar}
                  className="flex items-center gap-4 px-4 py-3 text-gray-700 rounded-lg hover:bg-white/60 transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-medium">Settings</span>
                </Link>
              </div>
            </div>

            <div>
              <Separator className={"bg-gray-300"} />
              <div className="flex flex-col space-y-1">
                <Link
                  href="/help"
                  onClick={closeNavBar}
                  className="flex items-center gap-4 px-4 py-3 text-gray-700 rounded-lg hover:bg-white/60 transition-all duration-200"
                >
                  <HelpCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Help</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-8">
            <button
              onClick={signOutAction}
              className="flex items-center gap-3 px-4 text-red-400 rounded-lg hover:bg-white/60 transition-all duration-200"
              type="button"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default SideNav;
