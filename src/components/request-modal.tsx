import { BaseModalProps, Modal } from "@components/basic/modal";
import { useRequest } from "@lib/request-network/use-request";

interface NewDepositModalProps extends BaseModalProps {
  requestId: string;
}

export const RequestModal = ({
  onClose,
  open,
  requestId,
}: NewDepositModalProps) => {
  const { data: request, isLoading } = useRequest({
    requestId,
  });

  if (isLoading) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="mb-4 text-lg font-bold">Request</h3>
      <hr className="my-4 border-base-300 dark:border-base-content/30" />

      <p>
        <span className="font-bold">Request Id: </span>
        {request?.requestId.slice(0, 20)}...
      </p>
      <p>
        <span className="font-bold">Reason: </span>
        {request?.contentData.reason}
      </p>
      <p>
        <span className="font-bold">Creator: </span>
        {request?.creator.value}
      </p>
      <p>
        <span className="font-bold">Payer: </span>
        {request?.payer?.value}
      </p>
      <p>
        <span className="font-bold">Payee: </span>
        {request?.payee?.value}
      </p>
      <p>
        <span className="font-bold">Expected amount: </span>
        {request?.expectedAmount}
      </p>
      <p>
        <span className="font-bold">Balance: </span>
        {request?.balance?.balance}
      </p>
      <p>
        <span className="font-bold">Network: </span>
        {request?.currencyInfo.network}
      </p>
      <p>
        <span className="font-bold">Currency: </span>
        {request?.currencyInfo.value}
      </p>
    </Modal>
  );
};
