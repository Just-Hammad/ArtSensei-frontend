import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SubmitButton } from "@/shared/buttons/SubmitButton";
import { deleteSession } from "@/actions/chat/delete-session";

const SessionDeleteDialog = ({ sessionId, trigger, open, onOpenChange }) => {
  const handleDeleteAction = async () => {
    const result = await deleteSession(sessionId);
    if (result.success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 gap-0 bg-white border border-gray-200">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
           
            <div className="flex-1 space-y-2">
              <DialogTitle className="text-lg font-semibold text-gray-900 text-left">
                Delete Session
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 text-left leading-relaxed">
                This action cannot be undone. This will permanently delete the
                session and all associated data.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-2 flex items-center justify-end gap-3 border-t border-gray-200 rounded-b-lg">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenChange(false);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <form action={handleDeleteAction} onClick={(e) => e.stopPropagation()}>
            <SubmitButton
              label="Delete"
              loadingLabel="Deleting..."
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-black transition-colors"
            />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDeleteDialog;
