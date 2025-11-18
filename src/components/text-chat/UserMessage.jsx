import React from 'react';

const UserMessage = ({ content, attachments = [], onAttachmentClick }) => {
  const getAttachmentUrl = (attachment) => {
    if (typeof attachment === 'string') {
      if (attachment.startsWith('http://') || attachment.startsWith('https://')) {
        return attachment;
      }
      if (attachment.startsWith('/uploads/')) {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
        return `${backendUrl}${attachment}`;
      }
      return attachment;
    }
    return attachment.serverUrl || attachment.localUrl;
  };

  const getAttachmentKey = (attachment, index) => {
    if (typeof attachment === 'string') {
      return attachment;
    }
    return attachment.id || index;
  };

  return (
    <div className="flex justify-end mb-4">
      <div className="max-w-[75%]">
        {attachments && attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2 justify-end">
            {attachments.map((attachment, index) => {
              const url = getAttachmentUrl(attachment);
              
              if (!url || url.trim() === '') {
                return null;
              }
              
              return (
                <div
                  key={getAttachmentKey(attachment, index)}
                  onClick={() => onAttachmentClick && onAttachmentClick(attachment)}
                  className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer hover:border-gray-400 transition-all"
                >
                  <img
                    src={url}
                    alt="Attachment"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.style.display = 'none';
                    }}
                  />
                  {attachment.isUploading && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        <div className="bg-gray-100 text-gray-800 px-4 py-3 rounded-lg shadow-sm break-words">
          {content}
        </div>
      </div>
    </div>
  );
};

export default UserMessage;