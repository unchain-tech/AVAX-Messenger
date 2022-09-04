import Layout from "../../components/layout/Layout";
import RequireWallet from "../../components/layout/RequireWallet";
import { useWallet } from "../../hooks/useWallet";
import { useMessengerContract } from "../../hooks/useMessengerContract";
import { useEffect } from "react";
import Error from "../../components/error/Error";

export default function OwnerPage() {
  const { currentAccount, connectWallet } = useWallet();
  const {
    messengerContract,
    owner,
    numOfPendingLimits,
    getOwner,
    getNumOfPendingLimits,
  } = useMessengerContract({
    currentAccount: currentAccount,
  });

  useEffect(() => {
    getOwner();
    getNumOfPendingLimits();
  }, [messengerContract]);

  return (
    <Layout>
      <RequireWallet
        currentAccount={currentAccount}
        connectWallet={connectWallet}
      >
        {owner === currentAccount ? (
          <div>numOfPendingLimits: {numOfPendingLimits?.toNumber()}</div>
        ) : (
          <Error statusCode={404} />
        )}
      </RequireWallet>
    </Layout>
  );
}
