import { Button } from '@/common/components/atoms/Button/Button';
import { Dialog } from '@/common/components/organisms/Dialog/Dialog';
import { DialogContent } from '@/common/components/organisms/Dialog/Dialog.Content';
import { DialogDescription } from '@/common/components/organisms/Dialog/Dialog.Description';
import { DialogFooter } from '@/common/components/organisms/Dialog/Dialog.Footer';
import { DialogHeader } from '@/common/components/organisms/Dialog/Dialog.Header';
import { DialogTitle } from '@/common/components/organisms/Dialog/Dialog.Title';
import { DialogTrigger } from '@/common/components/organisms/Dialog/Dialog.Trigger';
import { ctw } from '@/common/utils/ctw/ctw';
import { DialogClose } from '@radix-ui/react-dialog';
import { Send } from 'lucide-react';

import { useDefaultActionsLogic } from '@/pages/Entity/components/Case/actions-variants/DefaultActions/hooks/useDefaultActionsLogic/useDefaultActionsLogic';

export const DefaultActions = () => {
  const {
    isLoadingActions,
    canRevision,
    debouncedIsLoadingRejectCase,
    documentsToReviseCount,
    debouncedIsLoadingRevisionCase,
    onMutateRevisionCase,
    onMutateRejectCase,
    canReject,
    onMutateApproveCase,
    canApprove,
    debouncedIsLoadingApproveCase,
  } = useDefaultActionsLogic();

  return (
    <div className={`flex flex-wrap items-center gap-4 self-start pe-[3.35rem]`}>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="md"
            variant="warning"
            disabled={isLoadingActions || !canRevision}
            className={ctw(
              { loading: debouncedIsLoadingRejectCase },
              'whitespace-nowrap',
              'enabled:bg-warning enabled:hover:bg-warning/90',
            )}
          >
            Ask for all re-uploads {canRevision && `(${documentsToReviseCount})`}
          </Button>
        </DialogTrigger>
        <DialogContent className={`mb-96`}>
          <DialogHeader>
            <DialogTitle className={`text-2xl`}>Ask for all re-uploads</DialogTitle>
            <DialogDescription>
              <div className="mb-[10px]">
                By clicking the button below, an email with a link will be sent to the customer,
                directing them to re-upload the documents you have marked as “re-upload needed”.
              </div>
              <div>
                The case’s status will then change to “Revisions” until the customer will provide
                the needed documents and fixes.
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className={ctw(
                  'gap-x-2',
                  { loading: debouncedIsLoadingRevisionCase },
                  'enabled:bg-primary enabled:hover:bg-primary/90',
                )}
                disabled={isLoadingActions || !canRevision}
                onClick={onMutateRevisionCase}
              >
                <Send size={18} />
                Send email
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button
        size="md"
        variant="destructive"
        onClick={onMutateRejectCase}
        disabled={isLoadingActions || !canReject}
        className={ctw({
          loading: debouncedIsLoadingRejectCase,
        })}
      >
        Reject
      </Button>
      <Button
        size="md"
        variant="success"
        onClick={onMutateApproveCase}
        disabled={isLoadingActions || !canApprove}
        className={ctw({
          loading: debouncedIsLoadingApproveCase,
        })}
      >
        Approve
      </Button>
    </div>
  );
};
