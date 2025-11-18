"use client";
import { useChatStore } from "@/store";

const MediaContainer = ({ onUploadClick }) => {
  const activeAttachment = useChatStore((state) => state.activeAttachment);
  const uploadedImage = useChatStore((state) => state.uploadedImage);

  const getAttachmentUrl = (attachment) => {
    if (typeof attachment === 'string') {
      return attachment;
    }
    return attachment?.serverUrl || attachment?.localUrl;
  };

  const displayImage = activeAttachment 
    ? getAttachmentUrl(activeAttachment)
    : uploadedImage;

  if (!displayImage) {
    return (
      <div 
        onClick={onUploadClick}
        className='rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 h-[180px] overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:from-gray-200 hover:to-gray-300 transition-all duration-300 border-2 border-dashed border-gray-300'
      >
        <p className="text-gray-600 font-medium">Tap to upload your sketch</p>
        <p className="text-gray-500 text-sm mt-1">Share your artwork to get feedback</p>
      </div>
    );
  }

  return (
    <div className='rounded-3xl bg-gray-200 h-[180px] overflow-hidden flex items-center justify-center relative'>
      <img 
        src={displayImage} 
        alt="Uploaded content"
        className="max-w-full max-h-full object-contain"
      />
      {activeAttachment?.isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white text-sm font-medium">Uploading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaContainer