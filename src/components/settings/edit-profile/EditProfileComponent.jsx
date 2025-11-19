import BackButton from "../BackButton";
import FullNameWrapper from "./FullNameWrapper";
import ProfileImage from "./ProfileImage";
import Email from "./Email";

const EditProfileComponent = () => {
  return (
    <section id="edit-profile" className="p-4 flex flex-col gap-4">
      <header className="flex items-center gap-4">
        <BackButton backUrl={"/settings"} />
        <h1 className="text-3xl">Settings | Edit Profile</h1>
      </header>

      <section
        id="profile-image-ctn"
        className="mt-5 flex items-center justify-center"
      >
        <ProfileImage />
      </section>

      <section id="profile-info-ctn" className="flex flex-col gap-4 mt-4">
        <FullNameWrapper />
        <Email />
      </section>
    </section>
  );
};

export default EditProfileComponent;
