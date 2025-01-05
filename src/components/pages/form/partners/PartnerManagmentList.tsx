import {
  IPartnerResponse,
  ShareAttributes,
  SignatoryAttributes,
} from '@/api/services/partnerService';
import { sendDeleteRequest, sendPutRequest } from '@/api/swrConfig';
import BACKEND_ENDPOINTS from '@/api/urls';
import LoadingSvg from '@/components/loading/LoadingSvg';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import useCompanyData from '@/hooks/useCompanyData';
import { toast } from '@/hooks/useToast';
import { ROUTE_PATH } from '@/routes/routePaths';
import type { ICompanyData } from '@/types/common';
import { getMetaData } from '@/utils/getMetaData';
import { CheckCircle2, CheckIcon, Circle, EditIcon, XIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSWRMutation from 'swr/mutation';

// Types
interface Partner {
  uniqueId: string;
  name: string;
  isSignatory: boolean;
  share: string;
}

interface ShareEditState {
  [key: string]: { isEditing: boolean; tempShare: string | null };
}

interface DeleteDialogProps {
  isOpen: boolean;
  partnerName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteDialog = ({
  isOpen,
  partnerName,
  onConfirm,
  onCancel,
  isLoading = false,
}: DeleteDialogProps) => (
  <AlertDialog open={isOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete{' '}
          <span className='font-semibold text-gray-700'>{partnerName}</span> and
          remove their data from the system.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onCancel} disabled={isLoading}>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} disabled={isLoading}>
          {isLoading ? <LoadingSvg className='size-6' /> : 'Delete'}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

// Custom hook for partner data management
const usePartnerData = (companyData: ICompanyData | null) => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    if (!companyData) return;

    const partnersList: Partner[] =
      companyData.partners?.map((partner: IPartnerResponse) => ({
        uniqueId: partner.uniqueId,
        name: `${partner.firstName} ${partner.lastName}`,
        isSignatory: partner.isSignatory,
        share: String(partner.sharePercent || '0'),
      })) || [];

    const owner: Partner = {
      uniqueId: 'OWNER',
      name: `${companyData.firstName} ${companyData.lastName}`,
      isSignatory: false,
      share: String(companyData.sharePercent || '0'),
    };

    setPartners([owner, ...partnersList]);
  }, [companyData]);

  return { partners, setPartners };
};

// Custom hook for share editing
const useShareEditing = () => {
  const [editingShare, setEditingShare] = useState<ShareEditState>({});

  const startEditing = useCallback(
    (partnerId: string, currentShare: string) => {
      setEditingShare({
        [partnerId]: {
          isEditing: true,
          tempShare: currentShare === '0' ? null : currentShare,
        },
      });
    },
    []
  );

  const cancelEditing = useCallback((partnerId: string) => {
    setEditingShare((prev) => {
      const newState = { ...prev };
      delete newState[partnerId];
      return newState;
    });
  }, []);

  const updateTempShare = useCallback((partnerId: string, value: string) => {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) return;

    setEditingShare((prev) => ({
      ...prev,
      [partnerId]: { ...prev[partnerId], tempShare: value },
    }));
  }, []);

  return {
    editingShare,
    startEditing,
    cancelEditing,
    updateTempShare,
  };
};

// Custom hook for partner mutations
const usePartnerMutations = (
  partners: Partner[],
  setPartners: (partners: Partner[]) => void
) => {
  const [updatingSignatoryId, setUpdatingSignatoryId] = useState<string | null>(
    null
  );
  const [updatingShareId, setUpdatingShareId] = useState<string | null>(null);

  const { trigger: updateSignatory, isMutating: isUpdatingSignatory } =
    useSWRMutation(BACKEND_ENDPOINTS.UPDATE_PARTNER_SIGNATORY, sendPutRequest, {
      onSuccess: (data) => {
        toast({
          title: data.message || 'Signatory status updated successfully.',
        });
        setUpdatingSignatoryId(null);
      },
      onError: (error: Error) => {
        console.error('Failed to update signatory status:', error);
        toast({
          title: 'Failed to update signatory status.',
          variant: 'destructive',
        });
        setUpdatingSignatoryId(null);
      },
    });

  const { trigger: updateShare, isMutating: isUpdatingShare } = useSWRMutation(
    BACKEND_ENDPOINTS.UPDATE_PARTNER_SHARE,
    sendPutRequest,
    {
      onSuccess: (data) => {
        toast({
          title: data.message || 'Share updated successfully.',
        });
        setUpdatingShareId(null);
      },
      onError: (error: Error) => {
        console.error('Failed to update share:', error);
        toast({
          title: 'Failed to update share.',
          variant: 'destructive',
        });
        setUpdatingShareId(null);
      },
    }
  );

  const toggleSignatory = useCallback(
    async (uniqueId: string) => {
      try {
        setUpdatingSignatoryId(uniqueId);
        const updatedPartners = partners.map((p) =>
          p.uniqueId === uniqueId ? { ...p, isSignatory: !p.isSignatory } : p
        );
        const partner = updatedPartners.find((p) => p.uniqueId === uniqueId);

        if (!partner) {
          setUpdatingSignatoryId(null);
          return;
        }

        const signatoryAttributes: SignatoryAttributes = {
          type: uniqueId === 'OWNER' ? 'OWNER' : 'PARTNER',
          uniqueId: uniqueId === 'OWNER' ? '' : uniqueId,
          isSignatory: partner.isSignatory,
        };

        await updateSignatory({
          metaInfo: getMetaData(),
          attributes: signatoryAttributes,
        });

        setPartners(updatedPartners);
      } catch (error) {
        console.error('Failed to update signatory status:', error);
        toast({
          title: 'Failed to update signatory status.',
          variant: 'destructive',
        });
        setUpdatingSignatoryId(null);
      }
    },
    [partners, setPartners, updateSignatory]
  );

  const applyShareUpdate = useCallback(
    async (uniqueId: string, newShare: string) => {
      try {
        setUpdatingShareId(uniqueId);
        const otherSharesTotal = partners
          .filter((p) => p.uniqueId !== uniqueId)
          .reduce((sum, p) => sum + Number(p.share), 0);

        if (otherSharesTotal + Number(newShare) > 100) {
          toast({
            title: 'Total share cannot exceed 100%',
            variant: 'destructive',
          });
          setUpdatingShareId(null);
          return false;
        }

        const sharesAttributes: ShareAttributes = {
          type: uniqueId === 'OWNER' ? 'OWNER' : 'PARTNER',
          uniqueId: uniqueId === 'OWNER' ? '' : uniqueId,
          sharePercent: Number(newShare),
        };

        await updateShare({
          metaInfo: getMetaData(),
          attributes: sharesAttributes,
        });

        setPartners(
          partners.map((p) =>
            p.uniqueId === uniqueId ? { ...p, share: newShare } : p
          )
        );

        return true;
      } catch (error) {
        console.error('Failed to update share:', error);
        toast({
          title: 'Failed to update share.',
          variant: 'destructive',
        });
        setUpdatingShareId(null);
        return false;
      } finally {
        setUpdatingShareId(null);
      }
    },
    [partners, setPartners, updateShare]
  );

  return {
    toggleSignatory,
    applyShareUpdate,
    isUpdatingShare,
    isUpdatingSignatory,
    updatingSignatoryId,
    updatingShareId,
  };
};

// Partner Row Component
const PartnerRow = ({
  partner,
  editingShare,
  onSignatoryToggle,
  onShareEdit,
  onShareUpdate,
  onShareCancel,
  onShareChange,
  onDelete,
  updatingSignatoryId,
  updatingShareId,
  partners,
}: {
  partner: Partner;
  editingShare: ShareEditState;
  onSignatoryToggle: (uniqueId: string) => void;
  onShareEdit: (uniqueId: string, share: string) => void;
  onShareUpdate: (uniqueId: string) => void;
  onShareCancel: (uniqueId: string) => void;
  onShareChange: (uniqueId: string, value: string) => void;
  onDelete: (uniqueId: string) => void;
  updatingSignatoryId: string | null;
  updatingShareId: string | null;
  partners: Partner[];
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const isUpdatingThisSignatory = updatingSignatoryId === partner.uniqueId;
  const isUpdatingThisShare = updatingShareId === partner.uniqueId;

  const calculateTotalShare = (currentValue: string | null) => {
    if (currentValue === null) return 0;

    const otherSharesTotal = partners
      .filter((p) => p.uniqueId !== partner.uniqueId)
      .reduce((sum, p) => sum + Number(p.share), 0);
    return otherSharesTotal + Number(currentValue);
  };

  const isShareExceeding =
    editingShare[partner.uniqueId]?.tempShare !== null &&
    editingShare[partner.uniqueId]?.tempShare !== undefined
      ? calculateTotalShare(editingShare[partner.uniqueId].tempShare) > 100
      : false;

  useEffect(() => {
    if (editingShare[partner.uniqueId]?.isEditing) {
      inputRef.current?.focus();
    }
  }, [editingShare, partner.uniqueId]);

  return (
    <TableRow>
      <TableCell className='text-center'>{partner.name}</TableCell>
      <TableCell className='text-center'>
        <button
          onClick={() => onSignatoryToggle(partner.uniqueId)}
          className='hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50'
          disabled={isUpdatingThisSignatory}
          title={
            isUpdatingThisSignatory ? 'Updating signatory status...' : undefined
          }
        >
          {isUpdatingThisSignatory ? (
            <LoadingSvg className='size-5 text-primary' />
          ) : partner.isSignatory ? (
            <CheckCircle2 className='size-5 text-green-500' />
          ) : (
            <Circle className='size-5 text-gray-300' />
          )}
        </button>
      </TableCell>
      <TableCell className='text-center'>
        <div className='flex items-center justify-center gap-2'>
          {editingShare[partner.uniqueId]?.isEditing ? (
            <div className='relative'>
              <input
                ref={inputRef}
                type='number'
                value={editingShare[partner.uniqueId].tempShare ?? ''}
                onChange={(e) =>
                  onShareChange(partner.uniqueId, e.target.value)
                }
                className={`w-16 rounded border px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50 ${
                  isShareExceeding
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : ''
                }`}
                disabled={isUpdatingThisShare}
                title={
                  isShareExceeding
                    ? 'Total share cannot exceed 100%'
                    : undefined
                }
              />

              <div className='absolute -top-4 right-0 flex gap-1'>
                {isUpdatingThisShare ? (
                  <LoadingSvg className='size-4 text-primary' />
                ) : (
                  <>
                    <button
                      className='text-gray-500 hover:text-green-500 disabled:cursor-not-allowed disabled:opacity-50'
                      onClick={() => onShareUpdate(partner.uniqueId)}
                      disabled={isUpdatingThisShare || updatingShareId !== null}
                      title={
                        isShareExceeding
                          ? 'Total share cannot exceed 100%'
                          : 'Save share percentage'
                      }
                    >
                      <CheckIcon className='size-4' />
                    </button>
                    <button
                      className='text-gray-500 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50'
                      onClick={() => onShareCancel(partner.uniqueId)}
                      disabled={isUpdatingThisShare}
                      title='Cancel editing'
                    >
                      <XIcon className='size-4' />
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div
              className={`group flex items-center gap-2 ${
                isUpdatingThisShare
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer'
              }`}
              onClick={() =>
                !isUpdatingThisShare &&
                onShareEdit(partner.uniqueId, partner.share)
              }
              title={
                isUpdatingThisShare
                  ? 'Updating share percentage...'
                  : 'Click to edit share percentage'
              }
            >
              <span>{partner.share}%</span>
              <button
                className='disabled:cursor-not-allowed disabled:opacity-50 group-hover:opacity-80'
                disabled={isUpdatingThisShare || updatingShareId !== null}
              >
                <EditIcon className='mb-0.5 size-4' />
              </button>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className='text-center'>
        {partner.uniqueId !== 'OWNER' && (
          <div className='flex justify-center gap-2'>
            <Button variant='default' size='sm'>
              View
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => onDelete(partner.uniqueId)}
              disabled={isUpdatingThisSignatory || isUpdatingThisShare}
            >
              Delete
            </Button>
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};

// Main Component
const PartnersManagementList = () => {
  const navigate = useNavigate();
  const { companyData } = useCompanyData();
  const { partners, setPartners } = usePartnerData(companyData);
  const { editingShare, startEditing, cancelEditing, updateTempShare } =
    useShareEditing();
  const {
    toggleSignatory,
    applyShareUpdate,
    updatingSignatoryId,
    updatingShareId,
  } = usePartnerMutations(partners, setPartners);

  // Delete dialog state
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    uniqueId: string;
    partnerName: string;
  }>({
    isOpen: false,
    uniqueId: '',
    partnerName: '',
  });

  const { trigger: deletePartner, isMutating: isDeleting } = useSWRMutation(
    BACKEND_ENDPOINTS.DELETE_PARTNER(deleteDialog.uniqueId),
    sendDeleteRequest,
    {
      onSuccess: (data) => {
        toast({
          title: data.message || 'Partner deleted successfully.',
        });
      },
    }
  );

  const handleDeleteClick = (partnerUniqueId: string) => {
    const partner = partners.find((p) => p.uniqueId === partnerUniqueId);
    if (!partner) return;

    setDeleteDialog({
      isOpen: true,
      uniqueId: partner.uniqueId,
      partnerName: partner.name,
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePartner();
      setPartners(partners.filter((p) => p.uniqueId !== deleteDialog.uniqueId));
      setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      console.error('Failed to delete partner:', error);
      toast({
        title: 'Failed to delete partner.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog((prev) => ({ ...prev, isOpen: false }));
  };

  const handleShareUpdate = async (partnerId: string) => {
    const newShare = editingShare[partnerId]?.tempShare;
    if (typeof newShare !== 'string') return;

    try {
      const success = await applyShareUpdate(partnerId, newShare);
      if (success) {
        cancelEditing(partnerId);
      }
    } catch (error) {
      console.error('Failed to update share:', error);
    }
  };

  return (
    <div>
      <div className='mb-6 flex items-center justify-end'>
        <Button
          variant='default'
          onClick={() => navigate(ROUTE_PATH.addPartner)}
        >
          Add New Partner
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='text-center'>Name</TableHead>
            <TableHead className='text-center'>Signatory</TableHead>
            <TableHead className='text-center'>Share (%)</TableHead>
            <TableHead className='text-center'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {partners.map((partner) => (
            <PartnerRow
              key={partner.uniqueId}
              partner={partner}
              editingShare={editingShare}
              onSignatoryToggle={toggleSignatory}
              onShareEdit={startEditing}
              onShareUpdate={handleShareUpdate}
              onShareCancel={cancelEditing}
              onShareChange={updateTempShare}
              onDelete={handleDeleteClick}
              updatingSignatoryId={updatingSignatoryId}
              updatingShareId={updatingShareId}
              partners={partners}
            />
          ))}
        </TableBody>
      </Table>

      <DeleteDialog
        isOpen={deleteDialog.isOpen}
        partnerName={deleteDialog.partnerName}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default PartnersManagementList;
