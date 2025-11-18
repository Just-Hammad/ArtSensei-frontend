import ProfileSection from "./ProfileSection";
import AboutPoliciesSection from "./AboutPoliciesSection";
import SupportSection from "./SupportSection";
import AccountSection from "./AccountSection";
import MenuButton from "@/shared/buttons/MenuButton";

const SettingsComponent = async () => {

  return (
    <section id="settings-ctn" className="h-[90vh] w-full p-4 px-6 space-y-6 overflow-y-auto">
      <div className="flex items-center gap-4 text-gray-800">
        <MenuButton />
        <span className="text-3xl font-semibold">Settings</span>
      </div>

      <ProfileSection />

      <AboutPoliciesSection />

      <SupportSection />

      <AccountSection />

    </section>
  );
};

export default SettingsComponent;
