import Layout from "../../components/layout/Layout";
import RequireWallet from "../../components/layout/RequireWallet";
import { useWallet } from "../../hooks/useWallet";
import { useMessengerContract } from "../../hooks/useMessengerContract";
import { useEffect } from "react";
import Error from "../../components/error/Error";
import ChangeLimitsForm from "../../components/form/ChangeLimitsForm";

export default function OwnerPage() {
  const { currentAccount, connectWallet } = useWallet();
  const {
    mining,
    messengerContract,
    owner,
    numOfPendingLimits,
    getOwner,
    getNumOfPendingLimits,
    changeNumOfPendingLimits,
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
          <ChangeLimitsForm
            mining={mining}
            currentLimits={numOfPendingLimits}
            getLimits={getNumOfPendingLimits}
            changeLimits={changeNumOfPendingLimits}
          />
        ) : (
          <Error statusCode={404} />
        )}
      </RequireWallet>
    </Layout>
  );
}
