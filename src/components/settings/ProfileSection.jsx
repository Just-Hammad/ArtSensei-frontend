import { ChevronRight } from "lucide-react";
import Link from "next/link";

const ProfileSection = () => {
  return (
    <section id="profile-section">
      <div className="text-sm font-medium text-gray-500 mb-2">
        <span>Profile</span>
      </div>

      <div className="bg-white overflow-hidden rounded-t-xl rounded-b-xl shadow-sm">
        <Link
          href="/settings/edit-profile"
          className="w-full px-4 py-4 group hover:bg-gray-50 transition-all duration-200 cursor-pointer flex items-center justify-between border-b border-gray-300"
        >
          <span className="text-base text-gray-800">Your Profile</span>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
        </Link>

        <div className="w-full px-4 py-4 group hover:bg-gray-50 transition-all duration-200 cursor-pointer flex items-center justify-between border-b border-gray-300">
          <span className="text-base text-gray-800">Change Password</span>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
        </div>

        <div className="w-full px-4 py-4 group hover:bg-gray-50 transition-all duration-200 cursor-pointer flex items-center justify-between">
          <span className="text-base text-gray-800">Subscription</span>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
