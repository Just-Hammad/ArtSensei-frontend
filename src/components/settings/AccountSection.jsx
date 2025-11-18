const AccountSection = () => {
  return (
    <section id="account-section">
      <div className="text-sm font-medium text-gray-500 mb-2">
        <span>Account</span>
      </div>

      <div className="bg-white overflow-hidden rounded-t-xl rounded-b-xl shadow-sm">
        <div className="w-full px-4 py-4 group hover:bg-gray-50 transition-all duration-200 cursor-pointer flex items-center justify-between">
          <span className="text-base text-red-500">Delete Account</span>
        </div>
      </div>
    </section>
  );
};

export default AccountSection;
