import { ChevronRight } from "lucide-react";

const SupportSection = () => {
  return (
    <section id="support-section">
      <div className="text-sm font-medium text-gray-500 mb-2">
        <span>Support</span>
      </div>

      <div className="bg-white overflow-hidden rounded-t-xl rounded-b-xl shadow-sm">
        <div className="w-full px-4 py-4 group hover:bg-gray-50 transition-all duration-200 cursor-pointer flex items-center justify-between">
          <span className="text-base text-gray-800">Customer Support</span>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-all duration-200" />
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
