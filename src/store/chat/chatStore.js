import { create } from "zustand";
import {
  PERMISSION_STATES,
  ERROR_NAMES,
  PERMISSION_MESSAGES,
  AUDIO_PERMISSION_MESSAGES,
} from "@/constants/chat";
import { EMPTY_STRING } from "@/constants/general";
import { uploadToServer } from "@/actions/elevenlabs";
import { useElevenLabsStore } from "@/store";
import { useUserStore } from "@/store/user/userStore";
import { supabaseBrowser } from "@/lib/Supabase/client";
import { generateSessionUserId, generateGlobalUserId } from "@/utils/memoryUtils";

export const useChatStore = create((set, get) => ({
  cameraStream: null,
  isCameraActive: false,
  audioStream: null,
  isAudioActive: false,
  permissionState: PERMISSION_STATES.IDLE,
  audioPermissionState: PERMISSION_STATES.IDLE,
  permissionError: EMPTY_STRING,
  audioPermissionError: EMPTY_STRING,
  capturedImage: null,
  uploadedImage: null,
  showUploadInMain: false,
  showCapturedInMain: true,
  isAutoCapturing: false,
  autoCaptureInterval: 1000,
  similarityThreshold: 10,
  lastImageHash: null,
  lastCaptureTime: 0,
  currentSession: null,
  pendingAttachments: [],
  isUploadingAttachment: false,
  activeAttachment: null,

  // Set uploaded image when resuming a session
  setUploadedImageFromResume: (imageUrl) => {
    console.log("[Chat Store] Setting uploaded image from resumed session:", imageUrl);
    
    const attachment = {
      id: `resume-${Date.now()}`,
      localUrl: imageUrl,
      serverUrl: imageUrl,
      isUploading: false,
    };

    set({
      uploadedImage: imageUrl,
      activeAttachment: attachment,
      showUploadInMain: true,
    });
  },

  startCamera: async () => {
    set({
      permissionState: PERMISSION_STATES.REQUESTING,
      permissionError: EMPTY_STRING,
    });

    try {
      let stream = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: true,
        });
      } catch (backCameraError) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true,
        });
      }

      set({
        cameraStream: stream,
        isCameraActive: true,
        permissionState: PERMISSION_STATES.GRANTED,
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
      let permissionError = PERMISSION_MESSAGES.GENERIC;

      if (error.name === ERROR_NAMES.NOT_ALLOWED)
        permissionError = PERMISSION_MESSAGES.DENIED;
      else if (error.name === ERROR_NAMES.NOT_FOUND)
        permissionError = PERMISSION_MESSAGES.NOT_FOUND;
      else if (error.name === ERROR_NAMES.NOT_SUPPORTED)
        permissionError = PERMISSION_MESSAGES.NOT_SUPPORTED;

      set({ permissionState: PERMISSION_STATES.DENIED, permissionError });
    }
  },

  stopCamera: () => {
    const { cameraStream } = get();
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
    }
    set({
      cameraStream: null,
      isCameraActive: false,
      permissionState: PERMISSION_STATES.IDLE,
      permissionError: EMPTY_STRING,
      capturedImage: null,
      uploadedImage: null,
      showUploadInMain: false,
      isAutoCapturing: false,
      lastImageHash: null,
      lastCaptureTime: 0,
    });
  },

  retryPermission: () => {
    get().startCamera();
  },

  toggleCamera: () => {
    const { isCameraActive, stopCamera, startCamera } = get();

    if (isCameraActive) stopCamera();
    else startCamera();
  },

  startAudio: async () => {
    set({
      audioPermissionState: PERMISSION_STATES.REQUESTING,
      audioPermissionError: EMPTY_STRING,
    });

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      set({
        audioStream: stream,
        isAudioActive: true,
        audioPermissionState: PERMISSION_STATES.GRANTED,
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      let audioPermissionError = AUDIO_PERMISSION_MESSAGES.GENERIC;

      if (error.name === ERROR_NAMES.NOT_ALLOWED)
        audioPermissionError = AUDIO_PERMISSION_MESSAGES.DENIED;
      else if (error.name === ERROR_NAMES.NOT_FOUND)
        audioPermissionError = AUDIO_PERMISSION_MESSAGES.NOT_FOUND;
      else if (error.name === ERROR_NAMES.NOT_SUPPORTED)
        audioPermissionError = AUDIO_PERMISSION_MESSAGES.NOT_SUPPORTED;

      set({
        audioPermissionState: PERMISSION_STATES.DENIED,
        audioPermissionError,
      });
    }
  },

  stopAudio: () => {
    const { audioStream } = get();
    if (audioStream) {
      audioStream.getTracks().forEach((track) => track.stop());
    }
    set({
      audioStream: null,
      isAudioActive: false,
      audioPermissionState: PERMISSION_STATES.IDLE,
      audioPermissionError: EMPTY_STRING,
    });
  },

  retryAudioPermission: () => {
    get().startAudio();
  },

  toggleAudio: () => {
    const { isAudioActive, stopAudio, startAudio } = get();

    if (isAudioActive) stopAudio();
    else startAudio();
  },

  captureFrame: (videoElement, opts) => {
    const { capturedImage, uploadedImage, showUploadInMain } = get();

    if (capturedImage) {
      set({ capturedImage: null });
      return;
    }

    if (
      !videoElement ||
      !videoElement.videoWidth ||
      !videoElement.videoHeight
    ) {
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement, 0, 0);

    const imageDataUrl = canvas.toDataURL("image/jpeg", 0.9);

    if (uploadedImage) {
      set({
        capturedImage: imageDataUrl,
        showCapturedInMain: showUploadInMain ? false : true,
      });
    } else {
      set({
        capturedImage: imageDataUrl,
      });
    }

    try {
      const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(",");
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      };

      const file = dataURLtoFile(imageDataUrl, `capture_${Date.now()}.jpg`);
      const chatIdFromStore = useElevenLabsStore.getState
        ? useElevenLabsStore.getState().chatId
        : null;
      const userIdFromStore = useUserStore.getState
        ? useUserStore.getState().userId
        : null;

      const conv =
        (opts && opts.conversationId) ||
        chatIdFromStore ||
        (typeof window !== "undefined" && window.LMA_CONVERSATION_ID) ||
        null;
      const uid =
        (opts && opts.userId) ||
        userIdFromStore ||
        (typeof window !== "undefined" && window.LMA_USER_ID) ||
        null;

      uploadToServer(file, conv, uid).then(data => {
        console.log("[Capture] upload result:", data);
        
        if (data?.public_image_url) {
          get().updateSessionCoverImage(data.public_image_url);
        }
      }).catch(() => {});
    } catch (err) {
      console.info(
        "[Upload] failed to convert and upload captured image:",
        err
      );
    }
  },

  uploadImage: async (file) => {
    const { capturedImage } = get();
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        const imageDataUrl = e.target.result;
        const attachment = {
          id: Date.now().toString(),
          localUrl: imageDataUrl,
          file: file,
          serverUrl: null,
          isUploading: true,
        };

        set({ isUploadingAttachment: true });
        set((state) => ({
          pendingAttachments: [...state.pendingAttachments, attachment],
        }));

        if (capturedImage) {
          set({
            uploadedImage: imageDataUrl,
            showUploadInMain: true,
            showCapturedInMain: false,
            activeAttachment: attachment,
          });
        } else {
          set({
            uploadedImage: imageDataUrl,
            capturedImage: null,
            showUploadInMain: true,
            activeAttachment: attachment,
          });
        }

        try {
          const chatIdFromStore = useElevenLabsStore.getState
            ? useElevenLabsStore.getState().chatId
            : null;
          const userIdFromStore = useUserStore.getState
            ? useUserStore.getState().userId
            : null;

          const result = await uploadToServer(file, chatIdFromStore, userIdFromStore);
          
          if (result?.public_image_url) {
            const updatedAttachment = {
              ...attachment,
              serverUrl: result.public_image_url,
              isUploading: false,
            };

            set((state) => ({
              pendingAttachments: state.pendingAttachments.map((a) =>
                a.id === attachment.id ? updatedAttachment : a
              ),
              isUploadingAttachment: false,
              activeAttachment: updatedAttachment,
            }));

            get().updateSessionCoverImage(result.public_image_url);
            resolve(updatedAttachment);
          } else {
            set((state) => ({
              pendingAttachments: state.pendingAttachments.filter(
                (a) => a.id !== attachment.id
              ),
              isUploadingAttachment: false,
            }));
            reject(new Error("Upload failed"));
          }
        } catch (err) {
          set((state) => ({
            pendingAttachments: state.pendingAttachments.filter(
              (a) => a.id !== attachment.id
            ),
            isUploadingAttachment: false,
          }));
          reject(err);
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsDataURL(file);
    });
  },

  swapImageAndCamera: () => {
    const { showUploadInMain, capturedImage, uploadedImage } = get();

    if (capturedImage && uploadedImage) {
      set({
        showCapturedInMain: !get().showCapturedInMain,
      });
    } else {
      set({
        showUploadInMain: !showUploadInMain,
      });
    }
  },

  clearImages: () => {
    set({
      capturedImage: null,
      uploadedImage: null,
      showUploadInMain: false,
      showCapturedInMain: true,
      lastImageHash: null,
      lastCaptureTime: 0,
      pendingAttachments: [],
      isUploadingAttachment: false,
      activeAttachment: null,
    });
  },

  toggleAutoCapture: () => {
    set({ isAutoCapturing: !get().isAutoCapturing });
  },

  setAutoCapturing: (isAutoCapturing) => {
    set({ isAutoCapturing });
  },

  setActiveAttachment: (attachment) => {
    set({ activeAttachment: attachment });
  },

  clearPendingAttachments: () => {
    set({ pendingAttachments: [], isUploadingAttachment: false });
  },

  resetTextChatState: () => {
    set({
      uploadedImage: null,
      activeAttachment: null,
      pendingAttachments: [],
      isUploadingAttachment: false,
    });
  },

  setLastImageHash: (hash) => {
    set({ lastImageHash: hash });
  },

  setLastCaptureTime: (time) => {
    set({ lastCaptureTime: time });
  },

  getImageData: (videoElement) => {
    if (
      !videoElement ||
      !videoElement.videoWidth ||
      !videoElement.videoHeight
    ) {
      return null;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const width = 64;
    const height = Math.floor(
      videoElement.videoHeight * (width / videoElement.videoWidth)
    );
    const validHeight = Math.max(1, height);

    canvas.width = width;
    canvas.height = validHeight;

    ctx.drawImage(videoElement, 0, 0, width, validHeight);
    return ctx.getImageData(0, 0, width, validHeight);
  },

  calculateImageHash: (imageData) => {
    if (!imageData) return null;

    try {
      const { data, width, height } = imageData;

      if (!data || !width || !height || width <= 0 || height <= 0) {
        return null;
      }

      const grayscale = [];
      for (let i = 0; i < data.length; i += 4) {
        const gray =
          0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        grayscale.push(gray);
      }

      const totalPixels = width * height;
      const average =
        grayscale.reduce((sum, val) => sum + val, 0) / totalPixels;

      let hash = "";
      for (let i = 0; i < grayscale.length; i++) {
        hash += grayscale[i] >= average ? "1" : "0";
      }

      return hash;
    } catch (err) {
      return null;
    }
  },

  calculateSimilarity: (hash1, hash2) => {
    if (!hash1 || !hash2) return 100;
    if (hash1.length !== hash2.length) return 100;

    let differences = 0;
    for (let i = 0; i < hash1.length; i++) {
      if (hash1[i] !== hash2[i]) {
        differences++;
      }
    }

    return (differences / hash1.length) * 100;
  },

  getCurrentMainImage: () => {
    const { capturedImage, uploadedImage, showUploadInMain, showCapturedInMain } = get();
    
    if (capturedImage && uploadedImage) {
      return showCapturedInMain ? capturedImage : uploadedImage;
    }
    
    if (capturedImage) {
      return capturedImage;
    }
    
    if (uploadedImage) {
      return uploadedImage;
    }
    
    return null;
  },

  fetchUserMemories: async (chat_id, user_id) => {
    try {
      console.log("[Memory Fetch] Fetching memories for:", {
        chat_id,
        user_id,
      });

      const sessionUserId = generateSessionUserId(user_id);
      const globalUserId = generateGlobalUserId(user_id);

      console.log("[Memory Fetch] Generated user IDs:", {
        sessionUserId,
        globalUserId,
      });

      const { data: sessionMemories, error: sessionError } =
        await supabaseBrowser
          .rpc("get_session_memories", {
            p_user_id: sessionUserId,
            p_chat_session_id: chat_id,
          });

      if (sessionError) {
        console.error(
          "[Memory Fetch] Error fetching session memories:",
          sessionError
        );
      }

      const { data: globalMemories, error: globalError } = await supabaseBrowser
        .rpc("get_global_memories", {
          p_user_id: globalUserId,
        });

      if (globalError) {
        console.error(
          "[Memory Fetch] Error fetching global memories:",
          globalError
        );
      }

      console.group("[Memory Fetch Results]");
      console.log("Session Memories:", sessionMemories || []);
      console.log("Global Memories:", globalMemories || []);
      console.groupEnd();

      return {
        session: sessionMemories || [],
        global: globalMemories || [],
      };
    } catch (err) {
      console.error("[Memory Fetch] Unexpected error:", err);
      return { session: [], global: [] };
    }
  },

  createAndSetChatSession: async (userId, customMetadata = {}) => {
    try {
      const { createChatSession } = await import("@/actions/chat/create-session");
      
      const result = await createChatSession(userId, customMetadata);
      
      if (result.success) {
        const setChatId = useElevenLabsStore.getState().setChatId;
        setChatId(result.sessionId);
        
        set({ currentSession: result.session });
        
        console.log("[Chat Store] Chat session created:", result.sessionId);
        return result.sessionId;
      } else {
        console.error("[Chat Store] Failed to create chat session:", result.error);
        return null;
      }
    } catch (err) {
      console.error("[Chat Store] Error creating chat session:", err);
      return null;
    }
  },

  updateSessionCoverImage: async (publicImageUrl) => {
    const { currentSession } = get();
    
    if (!currentSession || currentSession.cover_image) {
      return;
    }

    try {
      const { updateCoverImage } = await import("@/actions/chat/update-cover-image");
      
      const result = await updateCoverImage(currentSession.id, publicImageUrl);
      
      if (result.success) {
        set({ currentSession: result.session });
        console.log("[Chat Store] Cover image updated:", publicImageUrl);
      }
    } catch (err) {
      console.error("[Chat Store] Error updating cover image:", err);
    }
  },

  resumeSession: async (sessionId, userId) => {
    try {
      console.log("[Chat Store] Resuming session:", { sessionId, userId });

      const { data: session, error } = await supabaseBrowser
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (error || !session) {
        console.error("[Chat Store] Failed to fetch session:", error);
        return null;
      }

      const setChatId = useElevenLabsStore.getState().setChatId;
      setChatId(session.id);
      
      set({ currentSession: session });
      
      console.log("[Chat Store] Session resumed:", session.id);
      return session.id;
    } catch (err) {
      console.error("[Chat Store] Error resuming session:", err);
      return null;
    }
  },

  markSessionAsInitiated: async (sessionId) => {
    const { currentSession } = get();
    
    // Check if session is already initiated to avoid unnecessary updates
    if (currentSession?.is_initiated) {
      console.log("[Chat Store] Session already initiated, skipping update");
      return;
    }

    try {
      const { initiateChatSession } = await import("@/actions/chat/initiate_session");
      
      const result = await initiateChatSession(sessionId);
      
      if (result.success) {
        // Update the local state to reflect the initiated status
        set({ 
          currentSession: { 
            ...currentSession, 
            is_initiated: true 
          } 
        });
        console.log("[Chat Store] Session marked as initiated:", sessionId);
      } else {
        console.error("[Chat Store] Failed to mark session as initiated:", result.message);
      }
    } catch (err) {
      console.error("[Chat Store] Error marking session as initiated:", err);
    }
  },
}));

// INTERFACE DEFINITIONS FOR REFERENCE ONLY

// CHAT chat_sessions TABLE IN SUPABASE

// interface ChatSession {
//   id: string;                 // UUID, unique session id
//   user_id: string;            // UUID, owner of the session
//   title: string;              // text, user-given title for the session
//   cover_image?: string | null; // text, optional public URL for session cover image
//   metadata: Record<string, any>; // JSONB, additional session-level info
//   created_at: string;         // timestamp with timezone, session creation
//   updated_at: string;         // timestamp with timezone, last update
// }
